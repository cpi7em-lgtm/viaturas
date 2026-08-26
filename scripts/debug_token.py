#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Debug: simula exatamente o que o frontend faz"""
import sys, io, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Login com senha errada pra ver o handler (ou gerar token manualmente)
    # Vou gerar um token JWT manual no servidor
    print("=" * 60)
    print("1. Gera token JWT igual auth-api faria")
    print("=" * 60)
    cmd = '''python3 -c "
import hmac, hashlib, json, base64, time
secret = 'viaturas-pmesp-cpi7-2026-secret'
def b64(x): return base64.urlsafe_b64encode(x).decode().rstrip('=')
header = b64(json.dumps({'alg':'HS256','typ':'JWT'},separators=(',',':')).encode())
payload_data = {'pm': {'cpf':'26034202833','nome':'WILLIAM MICHEL','guerra':'WILLIAM','ptgr':'CB PM','opm':'607000140'}, 'aud':'viaturas','app':'viaturas','exp': int(time.time())+604800, 'iat': int(time.time())}
payload = b64(json.dumps(payload_data, separators=(',',':')).encode())
sig = b64(hmac.new(secret.encode(), f'{header}.{payload}'.encode(), hashlib.sha256).digest())
token = f'{header}.{payload}.{sig}'
print(token)
"'''
    out = run(ssh, cmd)
    token = out
    print(f"Token gerado: {token[:80]}...")
    print()

    # 2. /api/auth/me com token (deve passar)
    print("=" * 60)
    print("2. /api/auth/me com token")
    print("=" * 60)
    out = run(ssh, f"curl -s -i http://localhost:8081/api/auth/me -H 'Authorization: Bearer {token}' 2>&1 | head -20")
    print(out)
    print()

    # 3. /convex/query/dashboard:getHomeStats COM token (sem token, direto)
    print("=" * 60)
    print("3. /convex/query/dashboard:getHomeStats (sem token)")
    print("=" * 60)
    out = run(ssh, "curl -s -i -X POST http://localhost:8081/convex/query/dashboard:getHomeStats -H 'Content-Type: application/json' -d '{\"path\":\"dashboard:getHomeStats\",\"args\":{\"cpf\":\"26034202833\"}}' 2>&1 | head -20")
    print(out)
    print()

    # 4. /convex/query/dashboard:getHomeStats COM token (igual frontend faz)
    print("=" * 60)
    print("4. /convex/query/dashboard:getHomeStats (COM Bearer token)")
    print("=" * 60)
    out = run(ssh, f"curl -s -i -X POST http://localhost:8081/convex/query/dashboard:getHomeStats -H 'Content-Type: application/json' -H 'Authorization: Bearer {token}' -d '{{\"path\":\"dashboard:getHomeStats\",\"args\":{{\"cpf\":\"26034202833\"}}}}' 2>&1 | head -20")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
