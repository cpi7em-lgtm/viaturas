#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Substitui a função sat_consultar_re por uma versão limpa"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko, re

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

NEW_FUNC = '''def sat_consultar_re(re_num: str) -> dict:
    """Consulta dados de habilitacao do PM pelo RE no SAT da PMESP.
    Retorna dict com: encontrado, postoGraduacao, nome, opm, opmCode,
    cnhCategoria, boletim, dataProva, cassada.
    """
    import re as _re
    import urllib.request

    re_num = re_num.strip()
    if not re_num or not re_num.isdigit():
        return {"encontrado": False, "erro": "RE invalido"}

    data = f"re={re_num}".encode("iso-8859-1")
    req = urllib.request.Request(
        SAT_URL, data=data,
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
    if "Nenhum registro encontrado" in body:
        return {"encontrado": False, "erro": "PM sem habilitacao cadastrada no SAT"}

    # Pega o bloco entre "Dados do Policial Militar" e "ATENCAO"
    m = _re.search(r"Dados do Policial Militar(.*?)ATEN", body, _re.DOTALL)
    if not m:
        return {"encontrado": False, "erro": "Formato inesperado do SAT"}
    bloco = m.group(1)
    texto = _re.sub(r"<[^>]+>", " ", bloco)
    texto = _re.sub(r"\\s+", " ", texto).strip()

    # Extrai o trecho "CABO PM NOME COMPLETO OPM (607002140)" antes de "Dados da Habilitacao"
    m_pm = _re.search(r"OPM Atual\\s+(.+?)\\s+\\((\\d{9})\\)\\s+Dados da Habilita", texto)
    if not m_pm:
        return {"encontrado": False, "erro": "Bloco PM não encontrado", "texto_completo": texto}
    pm_texto = m_pm.group(1).strip()  # "CABO PM MICHEL WILLIAM DE MORAES CPI-7"
    opm_code = m_pm.group(2).strip()  # "607002140"

    # Separa posto, nome, opm
    # posto = "CABO PM" (termina em PM), nome = meio, opm = ultimo token
    m_posto = _re.match(r"^([A-Z][A-Z\\s/]+PM)\\s+(.+)$", pm_texto)
    if m_posto:
        posto = m_posto.group(1).strip()
        resto = m_posto.group(2).strip()
        # OPM = ultimo token
        m_opm = _re.search(r"\\s+([A-Z][A-Z0-9/ºª\\-]+)$", resto)
        if m_opm:
            opm_nome = m_opm.group(1).strip()
            nome = resto[:m_opm.start()].strip()
        else:
            opm_nome = ""
            nome = resto
    else:
        posto = ""
        nome = pm_texto
        opm_nome = ""

    # CNH: "Categoria B" -> m_cat = "B"
    m_cat = _re.search(r"Categoria\\s+([A-D]{1,2})", texto)
    cnh = m_cat.group(1) if m_cat else ""
    # Boletim: "Numero do Boletim BOL.INT.CPI7-12504" -> boletim = "INT.CPI7-12504"
    m_bol = _re.search(r"Boletim\\s+(?:BOL\\.?\\s*)?([\\w\\-\\.]+)", texto)
    boletim = m_bol.group(1) if m_bol else ""
    # Data: "Data da prova 18/10/2004"
    m_data = _re.search(r"Data da prova\\s+(\\d{2}/\\d{2}/\\d{4})", texto)
    data_prova = m_data.group(1) if m_data else ""
    # Cassada: "Cassada Sim" ou "Cassada Nao"
    m_cassada = _re.search(r"Cassada\\s+(Sim|N\u00e3o|N\u00c3o)", texto)
    cassada = bool(m_cassada and m_cassada.group(1).lower().startswith("sim"))

    return {
        "encontrado": True,
        "re": re_num,
        "postoGraduacao": posto,
        "nome": nome,
        "opm": opm_nome,
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

# Acha a função atual
m_start = content.find('def sat_consultar_re(')
if m_start < 0:
    print("Funcao não encontrada")
    ssh.close()
    sys.exit(1)

# Acha o fim da função (proximo def no nivel 0)
m_end = content.find('\n\n@app.get("/api/sat/consulta")', m_start)
if m_end < 0:
    m_end = content.find('\n\ndef ', m_start + 100)
if m_end < 0:
    m_end = len(content)

print(f"Funcao atual: linha {content[:m_start].count(chr(10))+1} a {content[:m_end].count(chr(10))+1}")

new_content = content[:m_start] + NEW_FUNC + content[m_end:]

with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
    f.write(new_content)
print("Funcao substituida")

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
            d = json.loads(r.read().decode())
            print(f"\n  RE {re_num}:")
            for k, v in d.items():
                if v: print(f"    {k}: {v}")
    except urllib.error.HTTPError as e:
        print(f"\n  RE {re_num} err HTTP {e.code}: {e.read().decode()[:200]}")
    except Exception as e:
        print(f"\n  RE {re_num} err: {e}")

ssh.close()
