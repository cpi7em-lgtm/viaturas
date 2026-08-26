#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Debug sessão expirada"""
import sys, io, time, json
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

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Conteudo do auth_api_viaturas.py
    print("=" * 60)
    print("1. auth_api_viaturas.py (so a parte de auth)")
    print("=" * 60)
    out = run(ssh, "cat /opt/convex-viaturas/auth-api/auth_api_viaturas.py 2>&1 | head -150")
    print(out)
    print()

    # 2. JWT_TTL no docker-compose
    print("=" * 60)
    print("2. docker-compose (env JWT_*)")
    print("=" * 60)
    out = run(ssh, "grep -E 'JWT|SECRET|TTL|aud|app' /opt/convex-viaturas/docker-compose-viaturas.yml 2>&1")
    print(out)
    print()

    # 3. Variaveis dentro do container auth-api
    print("=" * 60)
    print("3. Env do container auth-api-viaturas")
    print("=" * 60)
    out = run(ssh, f"{SUDO} docker exec auth-api-viaturas env 2>&1 | grep -E 'JWT|SECRET|TTL|aud|app|CONVEX'")
    print(out)
    print()

    # 4. Logs do auth-api
    print("=" * 60)
    print("4. Ultimos logs do auth-api-viaturas")
    print("=" * 60)
    out = run(ssh, f"{SUDO} docker logs auth-api-viaturas --tail 50 2>&1")
    print(out[-3000:])
    print()

    # 5. Teste E2E: login + me logo depois
    print("=" * 60)
    print("5. Teste: login + me")
    print("=" * 60)
    # Login (vai falhar com senha errada mas mostra o handler)
    out = run(ssh, "curl -s -X POST http://localhost:8002/api/auth/login -H 'Content-Type: application/json' -d '{\"cpf\":\"26034202833\",\"senha\":\"qualquer\"}'")
    print(f"login (senha fake): {out}")
    print()

    # 6. Verificar /api/auth/me sem token
    out = run(ssh, "curl -s -i http://localhost:8002/api/auth/me 2>&1 | head -20")
    print(f"me sem token:")
    print(out)
    print()

    # 7. /api/auth/me com token fake
    out = run(ssh, "curl -s -i http://localhost:8002/api/auth/me -H 'Authorization: Bearer fake.token.aqui' 2>&1 | head -20")
    print(f"me com token fake:")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
