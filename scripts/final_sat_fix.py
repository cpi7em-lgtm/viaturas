#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Patch FINAL: substitui a função sat_consultar_re inteira com versão limpa"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

# Versão final da função SAT (sem duplo escape - escrita em Python normal)
FUNC_LITERAL = '''def sat_consultar_re(re_num: str) -> dict:
    """Consulta dados de habilitacao do PM pelo RE no SAT da PMESP."""
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
    m = _re.search(r"Dados do Policial Militar(.*?)ATEN", body, _re.DOTALL)
    if not m:
        return {"encontrado": False, "erro": "Formato inesperado do SAT"}
    bloco = m.group(1)
    bloco = _html.unescape(bloco)
    texto = _re.sub(r"<[^>]+>", " ", bloco)
    texto = _re.sub(r"\\s+", " ", texto).strip()
    # Texto esperado: "...OPM Atual POSTO PM NOME OPM (CODIGO) Dados da Habilitacao Categoria Número do Boletim Data da prova Cassada  X BOL.XXXX dd/mm/yyyy  Nao"
    m_pm = _re.search(r"OPM Atual\\s+(.+?)\\s+\\((\\d{9})\\)\\s+Dados da", texto)
    if not m_pm:
        return {"encontrado": False, "erro": "Bloco PM não encontrado", "texto_completo": texto}
    pm_texto = m_pm.group(1).strip()
    opm_code = m_pm.group(2).strip()
    m_posto = _re.match(r"^([A-Z][A-Z\\s/]+PM)\\s+(.+)$", pm_texto)
    posto = ""
    nome = pm_texto
    opm_nome = ""
    if m_posto:
        posto = m_posto.group(1).strip()
        resto = m_posto.group(2).strip()
        m_opm = _re.search(r"\\s+([A-Z][A-Z0-9/ºª\\-]+)$", resto)
        if m_opm:
            opm_nome = m_opm.group(1).strip()
            nome = resto[:m_opm.start()].strip()
        else:
            nome = resto
    # CNH: pega a letra antes de BOL (ex: "B BOL.INT.CPI7-12504" -> CNH = "B")
    m_cat = _re.search(r"\\b([A-D])\\s+BOL", texto)
    cnh = m_cat.group(1) if m_cat else ""
    # Boletim: depois de "BOL."  até o proximo espaco (ex: BOL.INT.CPI7-12504 -> INT.CPI7-12504)
    m_bol = _re.search(r"BOL\\.([A-Za-z0-9\\-\\.]+)", texto)
    boletim = m_bol.group(1) if m_bol else ""
    # Data: dd/mm/yyyy
    m_data = _re.search(r"(\\d{2}/\\d{2}/\\d{4})", texto)
    data_prova = m_data.group(1) if m_data else ""
    # Cassada: "Sim" no final do texto (geralmente unica palavra que comeca com S)
    m_cassada = _re.search(r"Cassada\\s+(Sim|N\u00e3o|N\\u00c3o|Nao)$", texto.strip())
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


'''

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)
sftp = ssh.open_sftp()
with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'r') as f:
    content = f.read().decode('utf-8', errors='replace')

# Encontra o inicio e fim da função sat_consultar_re
m_start = content.find('def sat_consultar_re(')
# Acha o fim: 2 newlines + proximo def ou @app
search_from = m_start + 100
m_end = -1
for end_marker in ['\n\n\ndef ', '\n\n@app.', '\n\nasync def ']:
    idx = content.find(end_marker, search_from)
    if idx > 0 and (m_end < 0 or idx < m_end):
        m_end = idx

if m_start < 0 or m_end < 0:
    print(f"Erro: não encontrei função (start={m_start}, end={m_end})")
    print(f"comeco: {content[m_start:m_start+100] if m_start >= 0 else 'N/A'}")
    print(f"pedaco final: {content[search_from:search_from+500]}")
    sys.exit(1)

print(f"Funcao: linha {content[:m_start].count(chr(10))+1}  até {content[:m_end].count(chr(10))+1}")
print(f"Tamanho: {m_end - m_start} chars")

# Substitui
new_content = content[:m_start] + FUNC_LITERAL + content[m_end:]
with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
    f.write(new_content)
print("Funcao substituida")
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
    except Exception as e:
        print(f"\n  RE {re_num} err: {e}")
ssh.close()
