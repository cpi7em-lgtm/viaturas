#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix UnboundLocalError opm_nome no sat_consultar_re"""
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

# Inicializa opm_nome = "" no inicio da funcao
old = '    # Extrai nome/pm (linha  após "Posto / Graduação - Nome")\n    m_nome = _re.search(r"Posto\\s*/\\s*Graduação\\s*-\\s*Nome.*?>([^<]+)</td><td>([^<]+)</td>", body, _re.DOTALL)'
new = '    opm_nome = ""\n    opm_code = ""\n    posto = ""\n    nome = ""\n    # Extrai nome/pm (linha  após "Posto / Graduação - Nome")\n    m_nome = _re.search(r"Posto\\s*/\\s*Graduação\\s*-\\s*Nome.*?>([^<]+)</td><td>([^<]+)</td>", body, _re.DOTALL)'

if old in content:
    content = content.replace(old, new, 1)
    print("Inicializacao adicionada")
else:
    print("Padrao não encontrado")

# Substitui o opm_nome no return pra usar a variavel local (que pode estar vazia)
# O return já usa opm_nome, entao OK

with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
    f.write(content)
print("Patch salvo")

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
            print(f"\n  RE {re_num}: {d[:600]}")
    except urllib.error.HTTPError as e:
        print(f"\n  RE {re_num} err HTTP {e.code}: {e.read().decode()[:200]}")
    except Exception as e:
        print(f"\n  RE {re_num} err: {e}")

ssh.close()
