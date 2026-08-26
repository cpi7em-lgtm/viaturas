"""
Materiais PMESP Auth API
- POST /api/auth/login {cpf, senha} -> {ok, token, usuario} (SOAP CPD)

- GET  /api/auth/me -> {usuario} (valida Bearer token)
- POST /api/auth/sync-convex -> sincroniza usuario com Convex (cria como viewer se não existir)
"""

import os
import time
import json
import hmac
import hashlib
import secrets
import base64
import urllib.request
import urllib.error
import urllib.parse
import subprocess
import socket
import asyncio
from xml.etree import ElementTree as ET
from typing import Optional, List
from fastapi import FastAPI, Request, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ===== SOAP CPD PM =====
SOAP_AUTH_HOST = os.environ.get("SOAP_AUTH_HOST", "10.61.9.19")
SOAP_PM_HOST = os.environ.get("SOAP_PM_HOST", "10.61.21.10")
SOAP_AUTH_URL = f"http://{SOAP_AUTH_HOST}/MS/aws_permxml.aspx"
SOAP_PM_URL = f"http://{SOAP_PM_HOST}/WSSCPM/Service.asmx"
SOAP_AUTH_HOSTNAME = "sistemasadmin.intranet.policiamilitar.sp.gov.br"
SOAP_PM_HOSTNAME = "webservices.intranet.policiamilitar.sp.gov.br"

# ===== JWT =====
JWT_SECRET = os.environ.get("JWT_SECRET", "materiais-pmesp-cpi7-2026-change-in-prod")
JWT_TTL = int(os.environ.get("JWT_TTL", "604800"))  # FIX (William 2026-07-10): 7 dias (era 24h, William sofria com expiracao recorrente)

# ===== Convex =====
CONVEX_URL = os.environ.get("CONVEX_URL", "http://convex-backend:3210")

# ===== ADMIN MASTERS (CPFs com role admin/master) =====
# Esses CPFs logam como admin (podem promover outros usuarios)
ADMIN_CPFS = set(filter(None, os.environ.get(
    "ADMIN_CPFS",
    "26034202833"  # William (michelwilliam) - admin master
).split(",")))

# ===== Status codes SOAP =====
AUTH_OK = 0
AUTH_CPF_INVALID = 2
AUTH_PASSWORD_INVALID = 3
AUTH_SYSTEM_INVALID = 4

app = FastAPI(title="Materiais PMESP Auth", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# SOAP helpers
# ============================================================
def _soap_call(soap_url, host_header, action, params, namespace="http://tempuri.org/",
               timeout=15, soap_action=None):
    ns_soap = "http://schemas.xmlsoap.org/soap/envelope/"
    body_xml = ""
    for k, v in params.items():
        body_xml += f"<{k}>{v}</{k}>"
    envelope = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="{ns_soap}">
  <soap:Body>
    <{action} xmlns="{namespace}">{body_xml}</{action}>
  </soap:Body>
</soap:Envelope>"""
    sa = soap_action or (namespace + action)
    req = urllib.request.Request(
        soap_url, data=envelope.encode("utf-8"),
        headers={
            "Content-Type": 'text/xml; charset="utf-8"',
            "SOAPAction": f'"{sa}"',
            "Host": host_header,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors='replace')[:500] if e.fp else ""
        raise RuntimeError(f"SOAP HTTP {e.code}: {body}")
    except urllib.error.URLError as e:
        raise RuntimeError(f"SOAP network error: {e}")


def soap_auth(cpf, senha):
    cpf_clean = str(cpf).replace(".", "").replace("-", "").strip()
    try:
        resp_xml = _soap_call(
            SOAP_AUTH_URL, SOAP_AUTH_HOSTNAME, "WS_PermXML.Execute",
            {"Sisnomsis": "PROTOCOLO", "Subsisnomsubsis": "PROTOCOLO",
             "Usrnumcpf": int(cpf_clean), "Tip_fuc": "M", "Senha": senha},
            namespace="MSU_Oficial",
            soap_action="MSU_Oficialaction/AWS_PERMXML.Execute",
        )
    except Exception as e:
        return {"status": -1, "erro": str(e)}
    try:
        root = ET.fromstring(resp_xml)
    except ET.ParseError as e:
        return {"status": -1, "erro": f"XML: {e}"}
    xml_ws = None
    for elem in root.iter():
        if elem.tag.endswith("Xml_ws_perm") and elem.text:
            xml_ws = elem.text
            break
    if not xml_ws:
        return {"status": -1, "erro": "Xml_ws_perm não encontrado"}
    try:
        perm = ET.fromstring(xml_ws)
        status_elem = None
        for child in perm.iter():
            if child.tag.endswith("Status") and child.text:
                status_elem = child
                break
        status = int(status_elem.text.strip()) if status_elem is not None else -1
    except ET.ParseError as e:
        return {"status": -1, "erro": f"Perm parse: {e}"}
    return {"status": status}


def busca_pm_por_cpf(cpf):
    cpf_clean = str(cpf).replace(".", "").replace("-", "").strip()
    try:
        resp_xml = _soap_call(
            SOAP_PM_URL, SOAP_PM_HOSTNAME, "procuraPMPorCPF",
            {"PMCPFNum": cpf_clean},
            soap_action="http://tempuri.org/procuraPMPorCPF",
        )
    except Exception:
        return None
    try:
        root = ET.fromstring(resp_xml)
        for elem in root.iter():
            if elem.tag.endswith("procuraPMPorCPFResult"):
                return elem
    except ET.ParseError:
        pass
    return None


def extract_pm_data(pm_elem, cpf=""):
    if pm_elem is None:
        return None
    data = {"cpf": cpf}

    def find_text(tag):
        for child in pm_elem.iter():
            if child.tag.endswith(tag) and child.text:
                return child.text
        return None

    # Mapeamento baseado no XML real retornado pelo CPD PM
    # (tags com prefixo "nomeGuePM", "numeroREPM", etc - fora do padrao "nomeGuerraPM")
    mapping = [
        ("nome", "nomePM"),
        ("guerra", "nomeGuePM"),
        ("re", "numeroREPM"),
        ("digre", "digitoREPM"),
        ("ptgr", "siglaPostoGraduacaoPM"),
        ("codptgr", None),  # tratado abaixo (complexo)
        ("unidade", "descricaoNivel02OPMCPA"),  # CPI-7 fica aqui
        ("opm", None),  # tratado abaixo (complexo, vem dentro de codigoOPMAtualPM)
        ("sexo", "sexoPM"),
        ("dataNascimento", "dataNascimentoPM"),
    ]
    for short, full in mapping:
        if full:
            val = find_text(full)
            if val:
                data[short] = val.strip() if isinstance(val, str) else val

    # codigoPostoGraduacaoPM é um nó complexo - pegar o código numerico
    for child in pm_elem.iter():
        if child.tag.endswith("codigoPostoGraduacaoPM"):
            # Pode ser um ComplexType - pegar codigoPostoGraduacaoPM (filho) ou o codigo
            # Estrutura: <codigoPostoGraduacaoPM><codigoPostoGraduacaoPM>5</codigoPostoGraduacaoPM>...</codigoPostoGraduacaoPM>
            # Iterar dentro procurando o numero
            for sub in child.iter():
                if sub.tag.endswith("codigoPostoGraduacaoPM") and sub is not child and sub.text and sub.text.strip().isdigit():
                    data["codptgr"] = sub.text.strip()
                    break
            # Se não achou, pegar codigoPostoGraduacaoAnterior (string tipo "CB")
            if "codptgr" not in data:
                for sub in child.iter():
                    if sub.tag.endswith("codigoPostoGraduacaoAnterior") and sub.text:
                        data["codptgr"] = sub.text.strip()
                        data["ptgr_codigo_anterior"] = sub.text.strip()
                        break
            # Captura tb a descricao (ex: "CABO PM")
            for sub in child.iter():
                if sub.tag.endswith("descricaoPostoGraduacaoPM") and sub.text:
                    data["ptgr_descricao"] = sub.text.strip()
                    break
            break

    # codigoOPMAtualPM é complexo - pegar codigoOPM interno
    for child in pm_elem.iter():
        if child.tag.endswith("codigoOPMAtualPM"):
            for sub in child.iter():
                if sub.tag.endswith("codigoOPM") and sub is not child and sub.text:
                    data["opm"] = sub.text.strip()
                    break
            break

    # email: vem dentro de dadosContatoFuncionario/FuncionarioContato[codigoTipoContato=4]
    for child in pm_elem.iter():
        if child.tag.endswith("FuncionarioContato"):
            tipo = None
            email = None
            número = None
            for sub in child.iter():
                if sub.tag.endswith("codigoTipoContato") and sub.text:
                    tipo = sub.text.strip()
                elif sub.tag.endswith("emailContato") and sub.text and sub.text != "-1":
                    email = sub.text.strip()
                elif sub.tag.endswith("numeroContato") and sub.text and sub.text != "-1":
                    número = sub.text.strip()
            if tipo == "4" and email:
                data["email"] = email
            if tipo in ("5", "6") and numero:
                data["telefone"] = numero

    return data


# ============================================================
# JWT helpers
# ============================================================
def _b64url(b):
    return base64.urlsafe_b64encode(b).decode().rstrip("=")


def make_token(payload):
    h = _b64url(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode())
    p = _b64url(json.dumps(payload, separators=(",", ":")).encode())
    sig = hmac.new(JWT_SECRET.encode(), f"{h}.{p}".encode(), hashlib.sha256).digest()
    return f"{h}.{p}.{_b64url(sig)}"


def verify_token(token):
    if not token or token.count(".") != 2:
        return None
    h, p, s = token.split(".")
    sig = hmac.new(JWT_SECRET.encode(), f"{h}.{p}".encode(), hashlib.sha256).digest()
    if not secrets.compare_digest(s, _b64url(sig)):
        return None
    try:
        # FIX: usa urlsafe_b64decode (decode, não encode!) e trabalha com bytes
        padded = p + "=" * ((4 - len(p) % 4) % 4)
        payload_bytes = base64.urlsafe_b64decode(padded.encode("ascii"))
        payload = json.loads(payload_bytes)
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None


def bearer(auth_header: Optional[str]) -> Optional[str]:
    if not auth_header:
        return None
    parts = auth_header.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return None


# ============================================================
# Convex sync (HTTP API direto, sem SDK)
# ============================================================
def convex_query(name, args):
    """Faz query no Convex via HTTP API."""
    try:
        url = f"{CONVEX_URL}/api/query"
        body = json.dumps({"path": name, "args": args}).encode()
        req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read())
    except Exception as e:
        return {"error": str(e)}


def convex_mutation(name, args):
    """Faz mutation no Convex via HTTP API."""
    try:
        url = f"{CONVEX_URL}/api/mutation"
        body = json.dumps({"path": name, "args": args}).encode()
        req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read())
    except Exception as e:
        return {"error": str(e)}


# ============================================================
# Models
# ============================================================
class LoginBody(BaseModel):
    cpf: str
    senha: str


class LegacyLoginBody(BaseModel):
    email: str = ""
    password: str = ""
    token: str = ""  # aceita JWT tambem


# ============================================================
# Endpoints
# ============================================================
@app.get("/api/health")
def health():
    return {"ok": True, "service": "materiais-pmesp-auth", "ts": int(time.time())}


@app.post("/api/admin/patch-bundle")
async def patch_bundle(body: dict):
    """Aplica patch no bundle servido. Bypass Convex pmStub:default error.
    Body: {secret: str, find: str, replace: str}
    """
    secret = body.get("secret", "")
    if secret != "pmesp-import-2026":
        raise HTTPException(403, "Bad secret")
    find = body.get("find", "")
    replace = body.get("replace", "")
    if not find:
        raise HTTPException(400, "find vazio")
    # Caminhos provaveis do bundle
    paths = [
        "/opt/convex/dist/assets/index-TxQlLGs8.js",
        "/var/www/materiais/assets/index-TxQlLGs8.js",
        "/usr/share/nginx/html/assets/index-TxQlLGs8.js",
    ]
    results = []
    for p in paths:
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    c = f.read()
                if find in c:
                    new_c = c.replace(find, replace)
                    with open(p, "w", encoding="utf-8") as f:
                        f.write(new_c)
                    results.append({"path": p, "replaced": c.count(find), "size": len(new_c)})
                else:
                    results.append({"path": p, "replaced": 0, "note": "find não encontrado"})
            except Exception as e:
                results.append({"path": p, "error": str(e)})
        else:
            results.append({"path": p, "skipped": "nao existe"})
    return {"ok": True, "results": results}


@app.post("/api/auth/login")
async def login_soap(body: LoginBody):
    """Login via SOAP CPD PM. Cria usuario viewer no Convex se primeiro acesso."""
    cpf = body.cpf.replace(".", "").replace("-", "").strip()
    senha = body.senha.strip()

    if not cpf or not senha:
        raise HTTPException(400, "CPF e senha obrigatorios")
    if len(cpf) != 11 or not cpf.isdigit():
        raise HTTPException(400, "CPF invalido (precisa ter 11 digitos)")

    # 1) Valida SOAP
    auth = soap_auth(cpf, senha)
    if auth["status"] != AUTH_OK:
        msgs = {
            AUTH_CPF_INVALID: "CPF ou senha invalidos",
            AUTH_PASSWORD_INVALID: "CPF ou senha invalidos",
            AUTH_SYSTEM_INVALID: "Sistema invalido",
        }
        return {"ok": False, "erro": msgs.get(auth["status"], "Erro desconhecido")}

    # 2) Busca dados PM
    pm_elem = busca_pm_por_cpf(cpf)
    pm_data = extract_pm_data(pm_elem, cpf)
    if not pm_data:
        return {"ok": False, "erro": "Nao foi possível obter dados do PM"}

    # 3) Cria/atualiza usuario no Convex
    # William (admin master) tem role admin. Outros PMs comecam como viewer
    if cpf in ADMIN_CPFS or (pm_data.get("email", "").lower() in ADMIN_EMAILS):
        role = "admin"
        print(f"[auth] ADMIN detectado: cpf={cpf} email={pm_data.get('email')}")
    else:
        role = "viewer"

    # Garante que user EXISTE no Convex usando pm_auth:createOrUpdatePMUser
    # (passa o objeto PM completo - SOAP já extraiu 12 campos)
    email_key = f"pm:{cpf}"
    sync_res = convex_mutation("pm_auth:createOrUpdatePMUser", {
        "secret": "pmesp-import-2026",
        "pm": {
            "cpf": cpf,
            "re": pm_data.get("re") or "",
            "digre": pm_data.get("digre") or "",
            "nome": pm_data.get("nome") or f"PM {cpf}",
            "guerra": pm_data.get("guerra") or "",
            "ptgr": pm_data.get("ptgr") or "",
            "codptgr": pm_data.get("codptgr") or "",
            "unidade": pm_data.get("unidade") or "",
            "opm": pm_data.get("opm") or "",
            "sexo": pm_data.get("sexo") or "",
            "dataNascimento": pm_data.get("dataNascimento") or "",
            "email": pm_data.get("email") or email_key,
            "telefone": pm_data.get("telefone") or "",
            "role": role,
        },
    })

    print(f"[auth] sync_res: {sync_res}")
    # Extrai userId E unitId
    convex_user_id = None
    convex_unit_id = None
    if isinstance(sync_res, dict):
        if "value" in sync_res and isinstance(sync_res["value"], dict):
            convex_user_id = sync_res["value"].get("userId")
            convex_unit_id = sync_res["value"].get("unitId")
        elif "userId" in sync_res:
            convex_user_id = sync_res["userId"]
            if isinstance(sync_res, dict):
                convex_unit_id = sync_res.get("unitId")
    print(f"[auth] convex_user_id: {convex_user_id} unit: {convex_unit_id}")

    # Garante que pm_data tem role correto (mesmo que promoteUser não exista)
    pm_data["role"] = role
    # userId do Convex: usa o ID real (ObjectId) quando disponível
    # IMPORTANTE: convexUserId DEVE ser o ObjectId real, não email/CPF!
    # Senão o frontend passa "pm:CPF" pra v.id("users") e o validator rejeita.
    final_user_id = convex_user_id if convex_user_id else email_key
    print(f"[auth] final_user_id: {final_user_id} (convex_user_id={convex_user_id!r}, email_key={email_key!r})")
    pm_data["userId"] = final_user_id
    pm_data["_id"] = final_user_id
    pm_data["convexUserId"] = final_user_id
    pm_data["_id_convex_real"] = final_user_id
    pm_data["_id_email_key"] = email_key  # backup formato email
    if convex_unit_id:
        pm_data["unitId"] = convex_unit_id  # ID real da unidade no Convex

    # Normaliza nomes dos campos PT -> EN (camelCase) que o frontend espera
    if pm_data.get("nome") and not pm_data.get("name"):
        pm_data["name"] = pm_data["nome"]
    if pm_data.get("guerra") and not pm_data.get("warName"):
        pm_data["warName"] = pm_data["guerra"]
    if pm_data.get("ptgr") and not pm_data.get("postoGraduacao"):
        pm_data["postoGraduacao"] = pm_data["ptgr"]
    if pm_data.get("unidade") and not pm_data.get("unitName"):
        pm_data["unitName"] = pm_data["unidade"]

    # 4) Gera JWT
    now = int(time.time())
    payload = {
        "sub": cpf,
        "iat": now,
        "exp": now + JWT_TTL,
        "pm": pm_data,
    }
    token = make_token(payload)

    return {
        "ok": True,
        "token": token,
        "usuario": pm_data,
        "ttl": JWT_TTL,
    }


@app.get("/api/auth/me")
async def me(authorization: Optional[str] = Header(None)):
    token = bearer(authorization)
    if not token:
        raise HTTPException(401, "Token ausente")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(401, "Token invalido ou expirado")
    return {"ok": True, "usuario": payload["pm"], "exp": payload["exp"]}


# Endpoint simples pra o app validar sessao: GET /api/auth/check?token=XXX
@app.get("/api/auth/check")
async def check(token: str = ""):
    """Valida token JWT (GET com token na URL pra facilitar o app)."""
    if not token:
        raise HTTPException(401, "Token ausente")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(401, "Token invalido ou expirado")
    return {"ok": True, "usuario": payload["pm"], "exp": payload["exp"]}


@app.post("/api/auth/promote")
async def promote(body: dict, authorization: Optional[str] = Header(None)):
    """Promove usuario (somente admin pode chamar)."""
    token = bearer(authorization)
    if not token:
        raise HTTPException(401, "Token ausente")
    payload = verify_token(token)
    if not payload or payload["pm"].get("role") not in ("admin", "master"):
        raise HTTPException(403, "Apenas admin pode promover usuarios")

    target_cpf = body.get("cpf")
    new_role = body.get("role", "viewer")
    if new_role not in ("viewer", "editor", "admin"):
        raise HTTPException(400, "Role invalido")

    res = convex_mutation("import:promoteUser", {
        "secret": "pmesp-import-2026",
        "cpf": target_cpf,
        "newRole": new_role,
    })
    return {"ok": "error" not in res, "result": res}





# === LCM Import (recebe JSON processado do Windows) ===
class LCMItem(BaseModel):
    patrimonio: str
    descricao: str
    numeroSerie: Optional[str] = None
    local: Optional[str] = None
    unidade: Optional[str] = None
    codOPM: Optional[str] = None
    nicho: Optional[str] = None
    categoria: Optional[str] = None
    status: Optional[str] = "ativo"


# === SIPL Patrimonio (scraping GeneXus em 10.61.9.19) ===
# Etapa 2 do workflow LCM: validar/enriquecer cada patrimonio do LCM
# consultando o SIPL oficial do CPD.
import re as _re
from concurrent.futures import ThreadPoolExecutor, as_completed

SIPL_BASE = "http://10.61.9.19/sipl/conopmpat.aspx"
EVENT_BUSCA = "E'BUSCAOPMPATRIMONIO'."  # aspas + ponto, EXATO pro GeneXus aceitar


def _sipl_parse(html: str) -> dict:
    """Extrai TEXTBLOCKDESCRICAOPATRIMONIO, TEXTBLOCKNUMSER, TEXTBLOCKOPM do HTML.

    FIX (William 2026-07-08): também extrai NOME DA OPM (vem junto no
    TEXTBLOCKOPM formato '607549000 - 54.BPM/I EM'). Permite atualizar
    o nome das OPMs no DB (mats genericos tipo 'Sub. CPI-7 (100)').
    """
    def find(pat):
        m = _re.search(pat, html, _re.IGNORECASE | _re.DOTALL)
        return m.group(1).strip() if m else ""
    desc = find(r"TEXTBLOCKDESCRICAOPATRIMONIO[^>]*>([^<]+)<")
    ser = find(r"TEXTBLOCKNUMSER[^>]*>([^<]+)<")
    opm_full = find(r"TEXTBLOCKOPM[^>]*>([^<]+)<")  # ex: "607549000 - 54.BPM/I EM"

    # Parse: separa código (9dig) do nome (resto depois do " - ")
    opm_code = ""
    opm_nome = ""
    if opm_full:
        m = _re.match(r"(\d{9,10})\s*[-–—]\s*(.+)", opm_full)
        if m:
            opm_code = m.group(1).strip()
            opm_nome = m.group(2).strip()
        else:
            # Caso seja só código sem nome
            m2 = _re.search(r"(\d{9,10})", opm_full)
            opm_code = m2.group(1).strip() if m2 else opm_full
            opm_nome = ""

    # status: procurado OK se algum campo preenchido
    ok = bool(desc or ser or opm_full)
    return {
        "ok": ok,
        "descricao": desc,
        "numeroSerie": ser,
        "opm": opm_code,           # só o código 9dig (compat com logica antiga)
        "opm_nome": opm_nome,     # nome legivel "54.BPM/I EM" (NOVO)
        "opm_full": opm_full,     # texto completo do TEXTBLOCKOPM
    }


def _sipl_buscar_um(pat: str) -> dict:
    """Busca 1 patrimonio no SIPL via GeneXus (formato EXATO que funciona).

    Logica VALIDADA (2026-07-02): pega GXState (JSON PURO não encriptado),
    modifica _EventName para E'BUSCAOPMPATRIMONIO'. (aspas+ponto EXATO) e faz
    POST com 16 campos incluindo vROT_MPAGE=ConOpmPat, GX_AJAX_KEY,
    AJAX_SECURITY_TOKEN, GX_CMP_OBJS={}, etc. Resposta HTML tem tags
    TEXTBLOCKDESCRICAOPATRIMONIO/TEXTBLOCKNUMSER/TEXTBLOCKOPM.
    """
    import json as _json
    try:
        # 1) GET inicial: pega GXState (JSON) + cookie ASP.NET_SessionId
        req = urllib.request.Request(SIPL_BASE)
        with urllib.request.urlopen(req, timeout=10) as r:
            init_html = r.read().decode(errors="replace")
            cookies = r.headers.get_all("Set-Cookie") or []
        sess_cookie = ""
        for c in cookies:
            if "ASP.NET_SessionId" in c:
                sess_cookie = c.split(";")[0]
        # GXState vem em value='...' com aspas SIMPLES e JSON dentro
        # Formato: name="GXState" value='{"_EventName":...}'
        parts = init_html.split('name="GXState"')
        if len(parts) < 2:
            return {"ok": False, "erro": "GXState não encontrado (partes < 2)"}
        after = parts[1]
        if "value='" not in after:
            return {"ok": False, "erro": "GXState não encontrado (sem value=')"}
        start = after.find("value='") + 7
        end = after.find("'", start)
        gx_raw = after[start:end]
        try:
            st até = _json.loads(gx_raw)
        except Exception as je:
            return {"ok": False, "erro": f"G×State parse fail: {je}"}

        # 2) Modifica _EventName no JSON pra BUSCAOPMPATRIMONIO (aspas+ponto EXATO)
        state["_EventName"] = "E'BUSCAOPMPATRIMONIO'."
        new_gx = _json.dumps(state, separators=(",", ":"))

        # 3) POST com TODOS os 16 campos (validado, funciona!)
        body = urllib.parse.urlencode({
            "GXState": new_gx,
            "vPATNUM": pat,
            "vROT_MPAGE": "ConOpmPat",
            "vDATETIMENOW_MPAGE": state.get("vDATETIMENOW_MPAGE", ""),
            "vSUB_SIS_MPAGE": "",
            "GXUI_MESSAGE_Icon": "",
            "GX_FocusControl": "vPATNUM",
            "GX_AJAX_KEY": state.get("GX_AJAX_KEY", ""),
            "AJAX_SECURITY_TOKEN": state.get("AJAX_SECURITY_TOKEN", ""),
            "GX_CMP_OBJS": "{}",
            "sCallerURL": "",
            "GX_RES_PROVIDER": "GXResourceProvider.aspx",
            "GX_THEME": "Fantastic",
            "_EventName": "E'BUSCAOPMPATRIMONIO'.",
            "_EventGridId": "",
            "_EventRowId": "",
        }).encode()
        req = urllib.request.Request(
            SIPL_BASE, data=body, method="POST",
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": SIPL_BASE,
                "Cookie": sess_cookie,
            },
        )
        with urllib.request.urlopen(req, timeout=20) as r:
            post_html = r.read().decode(errors="replace")
        return _sipl_parse(post_html)
    except Exception as e:
        return {"ok": False, "erro": f"{type(e).__name__}: {e}"}


class SIPLEnriquecerBody(BaseModel):
    items: List[dict]  # [{patrimonio, descricao?, numeroSerie?, opm?}, ...]


@app.post("/api/sipl/enriquecer-lcm")
async def sipl_enriquecer_lcm(body: SIPLEnriquecerBody, authorization: Optional[str] = Header(None)):
    """Etapa 2 do LCM: busca cada patrimonio no SIPL (CPD) e cruza com dados do LCM.
    Retorna: {ok, results: [{patrimonio, lcm: {...}, sipl: {...}, match: bool}], stats}.
    Workers paralelos: 10.
    """
    # Autenticacao: requer bearer token (qualquer user logado)
    if not bearer(authorization):
        raise HTTPException(401, "Token ausente")
    payload = verify_token(bearer(authorization))
    if not payload:
        raise HTTPException(401, "Token invalido")

    items = body.items[:500]  # limite por request
    results = []
    hits = 0
    enriched = 0

    # FIX (William 2026-07-08): SIPL NAO consulta com digito verificador.
    # Patrimonio vindo como "223001649-N" precisa virar "223001649" antes
    # de mandar pro CPD senao o servidor retorna 504/timeout.
    def _normalize_pat(pat: str) -> str:
        # Tudo que vem ANTES do "-" se tiver 6+ digitos, senao o proprio valor
        m = _re.match(r"^(\d{6,10})-[A-Z]$", (pat or "").strip())
        if m:
            return m.group(1)
        return (pat or "").strip()

    with ThreadPoolExecutor(max_workers=8) as ex:
        future_to_idx = {
            ex.submit(_sipl_buscar_um, _normalize_pat(item.get("patrimonio", ""))): i
            for i, item in enumerate(items)
        }
        sipl_data = {}
        # FIX (William 2026-07-08): retry 1x pra patrimonios que falharam com
        # timeout/504. CPD as vezes engole 1-2 patrimonios por onda de carga.
        failures = []
        for fut in as_completed(future_to_idx):
            idx = future_to_idx[fut]
            try:
                res = fut.result()
                if not res.get("ok") and ("timeout" in str(res.get("erro", "")).lower() or "504" in str(res.get("erro", ""))):
                    failures.append(idx)
                sipl_data[idx] = res
            except Exception as e:
                sipl_data[idx] = {"ok": False, "erro": str(e)}
                failures.append(idx)

        # Retry 1x pros que falharam, sequencialmente (sem paralelismo pra não sobrecarregar)
        for idx in failures:
            try:
                res = _sipl_buscar_um(_normalize_pat(items[idx].get("patrimonio", "")))
                sipl_data[idx] = res
            except Exception as e:
                sipl_data[idx] = {"ok": False, "erro": f"retry also failed: {e}"}

    for i, item in enumerate(items):
        sipl = sipl_data.get(i, {"ok": False, "erro": "timeout"})
        lcm = {
            "patrimonio": item.get("patrimonio"),
            "patrimonio_consultado": _normalize_pat(item.get("patrimonio", "")),  # NEW: debug
            "descricao": item.get("descricao", ""),
            "numeroSerie": item.get("numeroSerie", ""),
            "opm": item.get("opm", ""),
        }
        match_fields = []
        if sipl.get("ok"):
            hits += 1
            # Enriquecido = SIPL tem dados que LCM não tinha
            if sipl.get("descricao") and not lcm["descricao"]:
                lcm["descricao"] = sipl["descricao"]
                enriched += 1
                match_fields.append("descricao")
            if sipl.get("numeroSerie") and not lcm["numeroSerie"]:
                lcm["numeroSerie"] = sipl["numeroSerie"]
                enriched += 1
                match_fields.append("numeroSerie")
            if sipl.get("opm") and not lcm["opm"]:
                lcm["opm"] = sipl["opm"]
                enriched += 1
                match_fields.append("opm")
            # Match = LCM já tinha o dado e SIPL confirmou
            if lcm["descricao"] and sipl.get("descricao"):
                match_fields.append("descricao_confirmado")
        results.append({
            "patrimonio": item.get("patrimonio"),
            "lcm": lcm,
            "sipl": sipl,
            "match": sipl.get("ok", False),
            "enriched_fields": match_fields,
        })

    return {
        "ok": True,
        "total": len(items),
        "hits_sipl": hits,
        "enriched": enriched,
        "results": results,
    }


class LCMPreviewBody(BaseModel):
    items: List[LCMItem]
    overwriteNichoCategoria: Optional[bool] = False


class LCMImportBody(BaseModel):
    items: List[LCMItem]
    overwriteNichoCategoria: Optional[bool] = False


@app.post("/api/lcm/preview")
async def lcm_preview(body: LCMPreviewBody, authorization: Optional[str] = Header(None)):
    """Calcula preview de upsert sem aplicar. Retorna toCreate/toUpdate/toSkip."""
    if not body.items:
        return {"total": 0, "toCreate": 0, "toUpdate": 0, "toSkip": 0, "results": []}
    CHUNK = 100
    totals = {"toCreate": 0, "toUpdate": 0, "toSkip": 0}
    all_results = []
    for i in range(0, len(body.items), CHUNK):
        chunk = [it.dict() for it in body.items[i:i+CHUNK]]
        r = convex_query("materials:previewUpsert", {
            "items": chunk,
            "overwriteNichoCategoria": body.overwriteNichoCategoria,
        })
        if "value" in r:
            v = r["value"]
            totals["toCreate"] += v.get("toCreate", 0)
            totals["toUpdate"] += v.get("toUpdate", 0)
            totals["toSkip"] += v.get("toSkip", 0)
            all_results.extend(v.get("results", []))
    return {
        "total": len(body.items),
        **totals,
        "results": all_results,
    }


@app.post("/api/lcm/import")
async def lcm_import(body: LCMImportBody, authorization: Optional[str] = Header(None)):
    """Aplica upsert em batch. Retorna created/updated/skipped/errors."""
    if not body.items:
        return {"total": 0, "created": 0, "updated": 0, "skipped": 0, "errors": 0}
    CHUNK = 100
    totals = {"created": 0, "updated": 0, "skipped": 0, "errors": 0}
    for i in range(0, len(body.items), CHUNK):
        chunk = [it.dict() for it in body.items[i:i+CHUNK]]
        try:
            r = convex_mutation("materials:upsertBatchByPatrimonio", {
                "items": chunk,
                "overwriteNichoCategoria": body.overwriteNichoCategoria,
            })
            if "value" in r:
                v = r["value"]
                totals["created"] += v.get("created", 0)
                totals["updated"] += v.get("updated", 0)
                totals["skipped"] += v.get("skipped", 0)
        except Exception as e:
            totals["errors"] += 1
            print(f"[lcm/import] chunk {i} error: {e}")
    return {"total": len(body.items), **totals}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081)