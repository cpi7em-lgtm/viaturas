#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tentar deploy do schema com CONVEX_DEPLOYMENT + CONVEX_DEPLOY_KEY"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"

CONVEX_BIN = "/home/pm/.npm/_npx/89c650e61e38ed13/node_modules/.bin/convex"
ADMIN_KEY = "viaturas-cpi7-2026-secret-key-32-chars-min-aaaa"
DEPLOY_URL = "http://localhost:3212"

def run(ssh, cmd, timeout=120, get_pty=True):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 0. Ver .env.local
    print("=" * 60)
    print("0. .env.local do viaturas")
    print("=" * 60)
    out, _ = run(ssh, "cat /opt/convex-viaturas/convex/.env.local")
    print(out)
    print()

    # 1. convex import --help
    print("=" * 60)
    print("1. convex import --help")
    print("=" * 60)
    out, _ = run(ssh, f"{CONVEX_BIN} import --help 2>&1", timeout=30)
    print(out)
    print()

    # 2. Tentar dev --once com env vars setadas
    print("=" * 60)
    print("2. convex dev --once com CONVEX_DEPLOYMENT + CONVEX_DEPLOY_KEY")
    print("=" * 60)
    cmd = (
        f"cd /opt/convex-viaturas/convex && "
        f"CONVEX_DEPLOYMENT={DEPLOY_URL} "
        f"CONVEX_DEPLOY_KEY={ADMIN_KEY} "
        f"{CONVEX_BIN} dev --once --typecheck disable --codegen disable 2>&1"
    )
    print(f"$ {cmd[:200]}...")
    out, err = run(ssh, cmd, timeout=180)
    print("STDOUT:")
    print(out)
    print("STDERR:")
    print(err)
    print()

    # 3. Ver o que aconteceu
    print("=" * 60)
    print("3. _generated existe agora?")
    print("=" * 60)
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/convex/_generated/ 2>&1 | head")
    print(out)
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/convex/convex-generated/ 2>&1 | head")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
