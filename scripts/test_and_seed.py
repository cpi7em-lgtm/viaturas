#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testar functions e popular seed_units"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import json
import time

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"

def run(ssh, cmd, timeout=60, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Testa units.js:list (nome com .js porque é o bundle)
    print("=" * 60)
    print("1. Testa units.js:list")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"units.js:list\",\"args\":{}}' 2>&1")
    print(f"Sem auth: {out}")
    print()

    # 2. Tenta listar todas as functions publicas
    print("=" * 60)
    print("2. Lista public functions")
    print("=" * 60)
    out, _ = run(ssh, "curl -s http://localhost:3212/api/functions 2>&1 | head -200")
    print(out)
    print()

    # 3. Lista TODAS as functions (com dot notation)
    print("=" * 60)
    print("3. Lista functions (qual nome usar?)")
    print("=" * 60)
    for name in ['units:list', 'units.js:list', 'units/list', 'units.list', 'list']:
        out, _ = run(ssh, f"curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{{\"path\":\"{name}\",\"args\":{{}}}}' 2>&1")
        print(f"  '{name}': {out[:200]}")
    print()

    # 4. Pega admin key pra usar como auth (se precisar)
    out, _ = run(ssh, "cat /opt/convex-viaturas/.env.local")
    import re
    m = re.search(r'CONVEX_SELF_HOSTED_ADMIN_KEY="?([^"\n]+)"?', out)
    admin_key = m.group(1) if m else None
    print(f"Admin key: {admin_key[:60] if admin_key else 'FALHA'}...")

    # 5. Tenta com Authorization header
    if admin_key:
        print()
        print("=" * 60)
        print("4. Testa units.js:list COM Authorization")
        print("=" * 60)
        out, _ = run(ssh, f"curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -H 'Authorization: Convex {admin_key}' -d '{{\"path\":\"units.js:list\",\"args\":{{}}}}' 2>&1")
        print(out)
        print()

    # 6. Verifica o seed_units.py - tá pronto?
    print("=" * 60)
    print("5. Conteudo de seed_units.py")
    print("=" * 60)
    out, _ = run(ssh, "head -50 /opt/convex-viaturas/seed_units.py 2>&1")
    print(out)
    print()

    # 7. Verifica o auth-api (pra saber se ele tem o seed embutido)
    print("=" * 60)
    print("6. auth_api_viaturas.py - tem seed?")
    print("=" * 60)
    out, _ = run(ssh, "grep -E 'units.*upsert|seed|createOrUpdatePMUser' /opt/convex-viaturas/auth-api/auth_api_viaturas.py 2>&1 | head -20")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
