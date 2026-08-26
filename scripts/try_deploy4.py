#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gerar admin key e fazer deploy"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import re

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"
CONVEX_BIN = "/home/pm/.npm/_npx/89c650e61e38ed13/node_modules/.bin/convex"
URL = "http://localhost:3212"

def run(ssh, cmd, timeout=60, get_pty=True):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Gera admin key
    print("=" * 60)
    print("1. docker exec /convex/generate_admin_key.sh")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} docker exec convex-backend-viaturas /convex/generate_admin_key.sh 2>&1", timeout=30)
    print(out)
    print()

    # Pega a chave
    m = re.search(r'convex-self-hosted\|[a-f0-9]+', out, re.IGNORECASE)
    if not m:
        m = re.search(r'([a-f0-9]{40,})', out, re.IGNORECASE)
    if m:
        admin_key = m.group(0)
        if not admin_key.startswith('convex-self-hosted|'):
            admin_key = f"convex-self-hosted|{admin_key}"
        print(f"Admin key extraida: {admin_key[:60]}...")
    else:
        # Tenta outro padrao
        print(f"(Nao achei admin key no output. Tentando com format completo...)")
        # Tenta passar o instance_secret
        secret = "viaturas-cpi7-2026-secret-key-32-chars-min-aaaa"
        out, _ = run(ssh, f"{SUDO} docker exec -e CONVEX_INSTANCE_SECRET={secret} convex-backend-viaturas /convex/generate_admin_key.sh 2>&1", timeout=30)
        print(out)
        m = re.search(r'convex-self-hosted\|[a-f0-9]+', out, re.IGNORECASE)
        if m:
            admin_key = m.group(0)
        else:
            print("FALHOU. Saindo.")
            ssh.close()
            return

    # 2. Salva no .env.local do convex
    print("=" * 60)
    print("2. Atualiza .env.local com a admin key")
    print("=" * 60)
    out, _ = run(ssh, f"cat /opt/convex-viaturas/convex/.env.local")
    new_env = f"CONVEX_SELF_HOSTED_URL={URL}\nCONVEX_SELF_HOSTED_ADMIN_KEY={admin_key}\n"
    print(f"Antigo:\n{out}")
    print(f"\nNovo:\n{new_env}")

    # 3. Faz o deploy
    print()
    print("=" * 60)
    print("3. convex deploy --typecheck disable --codegen enable")
    print("=" * 60)
    cmd = (
        f"cd /opt/convex-viaturas/convex && "
        f"CONVEX_SELF_HOSTED_URL={URL} "
        f"CONVEX_SELF_HOSTED_ADMIN_KEY={admin_key} "
        f"{CONVEX_BIN} deploy --typecheck disable --codegen enable 2>&1"
    )
    print(f"$ (comando grande)")
    out, err = run(ssh, cmd, timeout=180)
    print("STDOUT:")
    print(out)
    print("STDERR:")
    print(err)
    print()

    # 4. Verifica _generated/
    print("=" * 60)
    print("4. _generated/ existe?")
    print("=" * 60)
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/convex/_generated/ 2>&1 | head -20")
    print(out)
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/convex/convex-generated/ 2>&1 | head -20")
    print(out)

    # 5. Testa API: GET schema ou list tables
    print("=" * 60)
    print("5. POST /api/query functions:list (vai dar 401 ou OK?)")
    print("=" * 60)
    out, _ = run(ssh, f"curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{{\"path\":\"functions/list\",\"args\":{{}}}}' 2>&1 | head -3")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
