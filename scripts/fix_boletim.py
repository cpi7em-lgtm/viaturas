#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ajusta regex do boletim, CNH, data, cassada"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)
sftp = ssh.open_sftp()
with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'r') as f:
    content = f.read().decode('utf-8', errors='replace')

# Ajusta o bloco de regex (cat, bol, data, cassada)
old = '''    # CNH: "Categoria B" -> m_cat = "B"
    m_cat = _re.search(r"Categoria\\s+([A-D]{1,2})", texto)
    cnh = m_cat.group(1) if m_cat else ""
    # Boletim: "Numero do Boletim BOL.INT.CPI7-12504" -> boletim = "INT.CPI7-12504"
    m_bol = _re.search(r"Boletim\\s+(?:BOL\\.?\\s*)?([\\w\\-\\.]+)", texto)
    boletim = m_bol.group(1) if m_bol else ""
    # Data: "Data da prova 18/10/2004"
    m_data = _re.search(r"Data da prova\\s+(\\d{2}/\\d{2}/\\d{4})", texto)
    data_prova = m_data.group(1) if m_data else ""
    # Cassada: "Cassada Sim" ou "Cassada Nao"
    m_cassada = _re.search(r"Cassada\\s+(Sim|N\\u00e3o|N\\u00c3o)", texto)
    cassada = bool(m_cassada and m_cassada.group(1).lower().startswith("sim"))'''

new = '''    # Formato: "Categoria Número do Boletim Data da prova Cassada  B BOL.INT.CPI7-12504 18/10/2004  Nao"
    # CNH: "B BOL" -> antes do BOL
    m_cat = _re.search(r"\\b([A-D])\\s+BOL", texto)
    cnh = m_cat.group(1) if m_cat else ""
    # Boletim: "BOL.INT.CPI7-12504" -> depois do BOL.
    m_bol = _re.search(r"BOL\\.([\\w\\-\\.]+)", texto)
    boletim = m_bol.group(1) if m_bol else ""
    # Data: dd/mm/yyyy
    m_data = _re.search(r"(\\d{2}/\\d{2}/\\d{4})", texto)
    data_prova = m_data.group(1) if m_data else ""
    # Cassada: "Nao" no final (geralmente)
    m_cassada = _re.search(r"\\b(Sim|N\u00e3o|N\\u00c3o|Nao)$", texto.strip())
    cassada = bool(m_cassada and m_cassada.group(1).lower().startswith("sim"))'''

if old in content:
    content = content.replace(old, new, 1)
    print("regex ajustados")
else:
    print("pattern não encontrado")
    # debug
    if 'm_bol = _re.search' in content:
        # mostra o trecho
        idx = content.find('m_bol = _re.search')
        print(content[idx:idx+800])

with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
    f.write(content)
print("Salvo")
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
