#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Substitui a função sat_consultar_re por uma versão robusta"""
import sys, io, time, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

# A função antiga (do add_sat.py) - vamos substituir ela
OLD_FUNC_PATTERN = re.compile(
    r"def sat_consultar_re\(re: str\) -> dict:.*?^def ",
    re.DOTALL | re.MULTILINE
)

NEW_FUNC = '''def sat_consultar_re(re: str) -> dict:
    """Consulta dados de habilitacao do PM pelo RE (sem digito verificador)."""
    import re as _re
    import urllib.request
    re = re.strip()
    if not re or not re.isdigit():
        return {"encontrado": False, "erro": "RE invalido"}

    data = f"re={re}".encode("iso-8859-1")
    req = urllib.request.Request(
        SAT_URL,
        data=data,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": SAT_HOST,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            body = r.read().decode("iso-8859-1", errors="replace")
    except Exception as e:
        return {"encontrado": False, "erro": f"Erro ao consultar SAT: {e}"}

    if "Dados do Policial Militar" not in body:
        return {"encontrado": False, "erro": "PM não encontrado no SAT"}

    # Pega o bloco entre "Dados do Policial Militar" e "ATENCAO"
    m = _re.search(r"Dados do Policial Militar(.*?)ATEN", body, _re.DOTALL)
    if not m:
        return {"encontrado": False, "erro": "Formato inesperado do SAT"}
    bloco = m.group(1)
    texto = _re.sub(r"<[^>]+>", " ", bloco)
    texto = _re.sub(r"\\s+", " ", texto).strip()

    # Extrai o trecho entre "OPM Atual" e "Dados da Habilitacao"
    m_bloco = _re.search(r"OPM Atual\\s+(.*?)\\s+Dados da Habilita", texto)
    if not m_bloco:
        return {"encontrado": False, "erro": "Bloco não encontrado", "texto_completo": texto}
    pm_opm = m_bloco.group(1).strip()
    # pm_opm = "CABO PM MICHEL WILLIAM DE MORAES CPI-7 (607002140)" (com &nbsp; que viraram espacos)
    m_code = _re.search(r"\\((\\d{9})\\)", pm_opm)
    opm_code = m_code.group(1) if m_code else ""
    sem_code = _re.sub(r"\\s*\\(\\d{9}\\)\\s*", " ", pm_opm).strip()
    # Pega posto (terminado em PM) e nome
    m_posto = _re.match(r"^([A-Z][A-Z\\s/]+PM)\\s+(.+)$", sem_code)
    posto = ""
    nome = sem_code
    opm = ""
    if m_posto:
        posto = m_posto.group(1).strip()
        resto = m_posto.group(2).strip()
        # OPM é o ULTIMO token (geralmente CPI-X, BPM/I, BAEP)
        m_opm = _re.search(r"\\s+([A-Z][A-Z0-9/\\u00ba\\u00aa\\-]+)$", resto)
        if m_opm:
            opm = m_opm.group(1).strip()
            nome = resto[:m_opm.start()].strip()
        else:
            nome = resto

    m_cat = _re.search(r"\\b([A-D]{1,2})\\s+BOL", texto, _re.IGNORECASE)
    cnh = m_cat.group(1) if m_cat else ""
    m_bol = _re.search(r"BOL\\.\\s*([\\w\\-\\.]+)", texto, _re.IGNORECASE)
    boletim = m_bol.group(1) if m_bol else ""
    m_data = _re.search(r"(\\d{2}/\\d{2}/\\d{4})", texto)
    data_prova = m_data.group(1) if m_data else ""
    m_cassada = _re.search(r"Cassada\\s*(Sim|N\\u00e3o|N\\u00c3o)", texto, _re.IGNORECASE)
    cassada = bool(m_cassada and m_cassada.group(1).lower().startswith("sim"))
    return {
        "encontrado": True,
        "re": re,
        "postoGraduacao": posto,
        "nome": nome,
        "opm": opm,
        "opmCode": opm_code,
        "cnhCategoria": cnh,
        "boletim": boletim,
        "dataProva": data_prova,
        "cassada": cassada,
    }


def '''

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)
sftp = ssh.open_sftp()

with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'r') as f:
    content = f.read().decode('utf-8', errors='replace')

# Substitui a funcao
m = OLD_FUNC_PATTERN.search(content)
if m:
    print(f"Encontrei função antiga ({m.end() - m.start()} chars)")
    new_content = content[:m.start()] + NEW_FUNC + content[m.end():]
    with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
        f.write(new_content)
    print("Funcao substituida")
else:
    print("Funcao antiga NAO encontrada")

# Restart
out = run(ssh, f"{SUDO} docker restart auth-api-viaturas 2>&1")
print(f"restart: {out}")
time.sleep(5)

# Testa
import urllib.request, json, hmac, hashlib, base64
SECRET = "viaturas-pmesp-cpi7-2026-secret"
def b64(x): return base64.urlsafe_b64encode(x).decode().rstrip('=')
header = b64(json.dumps({"alg":"HS256","typ":"JWT"}, separators=(",",":")).encode())
payload = b64(json.dumps({"sub":"26034202833","iat":int(time.time()),"exp":int(time.time())+3600,"pm":{"cpf":"26034202833"},"aud":"viaturas","app":"viaturas"}, separators=(",",":")).encode())
sig = b64(hmac.new(SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
token = f"{header}.{payload}.{sig}"

for re_num in ['111926', '999999']:
    url = f"http://10.36.177.138:8081/api/sat/consulta?re={re_num}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            d = r.read().decode()
            print(f"  RE {re_num}: {d[:500]}")
    except urllib.error.HTTPError as e:
        print(f"  RE {re_num} err HTTP {e.code}: {e.read().decode()[:200]}")
    except Exception as e:
        print(f"  RE {re_num} err: {e}")
    print()

ssh.close()
