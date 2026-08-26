#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Remove o def solto deixado pelo patch anterior"""
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

# Remove o "def " solto antes do @app.get
old = '        "cassada": cassada,\n    }\n\n\ndef \n\n\n@app.get("/api/sat/consulta")'
new = '        "cassada": cassada,\n    }\n\n\n@app.get("/api/sat/consulta")'

if old in content:
    content = content.replace(old, new, 1)
    print("def solto removido")
else:
    print("Padrao não encontrado, vou tentar de outro jeito")
    # Tenta achar 'def \n\n\n@app.get' e remover
    if '\n\ndef \n\n\n@app.get' in content:
        content = content.replace('\n\ndef \n\n\n@app.get', '\n\n@app.get', 1)
        print("Removido via pattern alternativo")

with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
    f.write(content)
print("Salvo")

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
