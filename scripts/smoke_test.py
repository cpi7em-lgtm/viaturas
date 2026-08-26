#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Smoke test final do Sistema de Viaturas"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import json

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    print("=" * 60)
    print("SMOKE TEST - SISTEMA DE VIATURAS CPI-7")
    print("=" * 60)

    # 1. nginx
    print("\n[1] GET / (nginx serve index.html)")
    out, _ = run(ssh, "curl -s -o /dev/null -w 'HTTP %{http_code} (%{size_download} bytes)\\n' http://localhost:8081/")
    print(f"    {out}")
    out, _ = run(ssh, "curl -s http://localhost:8081/ | grep -oE '<title>[^<]+</title>'")
    print(f"    Title: {out}")

    # 2. assets
    print("\n[2] GET /assets/index-BoQfFxBq.js")
    out, _ = run(ssh, "curl -s -o /dev/null -w 'HTTP %{http_code} (%{size_download} bytes)\\n' http://localhost:8081/assets/index-BoQfFxBq.js")
    print(f"    {out}")

    # 3. convex direto: units:list
    print("\n[3] convex direto: units:list (10 esperadas)")
    out, _ = run(ssh, "curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"units:list\",\"args\":{}}'")
    try:
        d = json.loads(out)
        if 'value' in d:
            print(f"    {len(d['value'])} units encontradas")
            for u in d['value']:
                print(f"      - {u.get('sigla')} ({u.get('code')})")
    except Exception as e:
        print(f"    parse err: {e}\n    raw: {out[:200]}")

    # 4. convex via nginx
    print("\n[4] convex via nginx: units:list (mesmo)")
    out, _ = run(ssh, "curl -s -X POST http://localhost:8081/convex/query/units:list -H 'Content-Type: application/json' -d '{\"args\":{}}'")
    try:
        d = json.loads(out)
        if 'value' in d:
            print(f"    {len(d['value'])} units (via nginx)")
    except Exception as e:
        print(f"    parse err: {e}\n    raw: {out[:200]}")

    # 5. auth-api health
    print("\n[5] auth-api /api/health")
    out, _ = run(ssh, "curl -s http://localhost:8081/api/health 2>&1")
    print(f"    {out[:200]}")

    # 6. auth-api login (fake)
    print("\n[6] auth-api /api/auth/login (CPF William, senha fake)")
    out, _ = run(ssh, "curl -s -X POST http://localhost:8081/api/auth/login -H 'Content-Type: application/json' -d '{\"cpf\":\"26034202833\",\"senha\":\"qualquer\"}'")
    print(f"    {out}")

    # 7. convex: pm_auth:listAll (com secret)
    print("\n[7] convex: pm_auth:listAll (deve mostrar William)")
    out, _ = run(ssh, "curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"pm_auth:listAll\",\"args\":{\"secret\":\"pmesp-import-2026\"}}'")
    try:
        d = json.loads(out)
        if 'value' in d:
            for u in d['value']:
                print(f"    - {u.get('warName')} ({u.get('cpf')}) - role={u.get('role')}, viaturasRole={u.get('viaturasRole')}")
    except Exception as e:
        print(f"    parse err: {e}")

    # 8. containers status
    print("\n[8] Containers (devem estar UP)")
    out, _ = run(ssh, "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A docker ps -a --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}' 2>&1 | grep -E 'viaturas|materiais'")
    print(out)

    print("\n" + "=" * 60)
    print("FIM SMOKE TEST")
    print("=" * 60)

    ssh.close()

if __name__ == "__main__":
    main()
