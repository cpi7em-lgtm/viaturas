#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Muda auth-api pra chamar o SAT proxy local (em vez do SAT direto)"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko, re

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)
sftp = ssh.open_sftp()

# Re-upa sat_proxy_v2 com regex melhor
with open(r'D:\USER\DESKTOPP\excel\viaturas\scripts\sat_proxy_v2.py', 'rb') as f:
    sftp.file('/opt/convex-viaturas/sat_proxy.py', 'wb').write(f.read())
sftp.chmod('/opt/convex-viaturas/sat_proxy.py', 0o755)
sftp.close()
print("sat_proxy re-upado")

# Restart sat_proxy
def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

run(ssh, "pkill -f sat_proxy.py 2>/dev/null; sleep 1; nohup python3 /opt/convex-viaturas/sat_proxy.py > /tmp/sat_proxy.log 2>&1 & disown")
time.sleep(2)
out = run(ssh, "curl -s 'http://localhost:8765/sat/consulta?re=111926' 2>&1")
print(f"\n[1] William (regex melhorado): {out[:800]}")
ssh.close()

# Re-conecta
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)
sftp = ssh.open_sftp()

# Agora patcha auth-api pra chamar o proxy local (em vez do SAT direto)
with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'r') as f:
    content = f.read().decode('utf-8', errors='replace')

# Substitui a função sat_consultar_re pra chamar o proxy local
old = '''# URL do SAT (sistema de habilitacao de motoristas da PMESP)
SAT_URL = "https://sistemasadmin.intranet.policiamiltar.sp.gov.br/sat/consultaReply.asp"
SAT_HOST = "sistemasadmin.intranet.policiamiltar.sp.gov.br"'''
new = '''# SAT proxy local (corre no host na porta 8765) - evita problemas de SSL/DNS do container
# Container chama via http://host.docker.internal:8765 (ou IP do host)
SAT_PROXY_URL = "http://host.docker.internal:8765/sat/consulta"'''

if old in content:
    content = content.replace(old, new, 1)
    print("URL trocada")
else:
    print("OLD não encontrado (ja foi trocado?)")

# Substitui a chamada urllib dentro da funcao
old2 = '''    data = f"re={re}".encode("iso-8859-1")
    req = urllib.request.Request(
        SAT_URL,
        data=data,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": SAT_HOST,
        },
        method="POST",
    )'''
new2 = '''    # Chama o SAT proxy local (corre no host, evita SSL/DNS do container)
    req = urllib.request.Request(
        f"{SAT_PROXY_URL}?re={urllib.parse.quote(re)}",
        headers={"Accept": "application/json"},
        method="GET",
    )'''

if old2 in content:
    content = content.replace(old2, new2, 1)
    print("Chamada urllib trocada")
else:
    print("OLD2 não encontrado (ja foi trocado?)")

# Adiciona import urllib.parse se não tiver
if 'import urllib.parse' not in content:
    content = content.replace('import urllib.request', 'import urllib.request\nimport urllib.parse', 1)

with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
    f.write(content)
print("auth-api patch salvo")

# Restart auth-api
out = run(ssh, f"{SUDO} docker restart auth-api-viaturas 2>&1")
print(f"restart: {out}")
time.sleep(5)
ssh.close()

# Re-conecta
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Testa
print("\n[2] /api/sat/consulta via nginx")
out = run(ssh, "curl -s 'http://localhost:8081/api/health' 2>&1")
print(f"  health: {out}")

# Testa com token
import json, hmac, hashlib, base64
SECRET = "viaturas-pmesp-cpi7-2026-secret"
def b64(x): return base64.urlsafe_b64encode(x).decode().rstrip('=')
header = b64(json.dumps({"alg":"HS256","typ":"JWT"}, separators=(",",":")).encode())
payload = b64(json.dumps({"sub":"26034202833","iat":int(time.time()),"exp":int(time.time())+3600,"pm":{"cpf":"26034202833"},"aud":"viaturas","app":"viaturas"}, separators=(",",":")).encode())
sig = b64(hmac.new(SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
token = f"{header}.{payload}.{sig}"

# Tenta do Windows primeiro (via nginx)
import urllib.request as ur
try:
    req = ur.Request("http://10.36.177.138:8081/api/sat/consulta?re=111926", headers={"Authorization": f"Bearer {token}"})
    with ur.urlopen(req, timeout=20) as r:
        print(f"  via nginx (Windows): {r.read().decode()[:600]}")
except Exception as e:
    print(f"  via nginx err: {e}")

# Tenta direto (sem nginx)
try:
    req = ur.Request("http://10.36.177.138:8002/api/sat/consulta?re=111926", headers={"Authorization": f"Bearer {token}"})
    with ur.urlopen(req, timeout=20) as r:
        print(f"  direto :8002: {r.read().decode()[:600]}")
except Exception as e:
    print(f"  direto err: {e}")

ssh.close()
