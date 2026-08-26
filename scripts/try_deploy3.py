#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gerar admin key e fazer deploy do schema"""
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

    # 1. Verifica se generate_admin_key.sh existe
    print("=" * 60)
    print("1. generate_admin_key.sh no container?")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} docker exec convex-backend-viaturas ls / 2>&1 | head; echo '---'; {SUDO} docker exec convex-backend-viaturas ls /opt 2>&1 | head; echo '---'; {SUDO} docker exec convex-backend-viaturas find / -name 'generate_admin_key*' 2>/dev/null | head")
    print(out)
    print()

    # 2. Tenta rodar
    print("=" * 60)
    print("2. Executa generate_admin_key.sh")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} docker exec convex-backend-viaturas /generate_admin_key.sh 2>&1", timeout=30)
    print(out)
    if "No such file" in out or "not found" in out:
        # tenta outros paths
        for path in ['/usr/local/bin/generate_admin_key.sh', '/scripts/generate_admin_key.sh', '/bin/generate_admin_key.sh']:
            out2, _ = run(ssh, f"{SUDO} docker exec convex-backend-viaturas {path} 2>&1", timeout=30)
            print(f"  {path}: {out2[:200]}")
    print()

    # 3. Procura admin key nos logs do container
    print("=" * 60)
    print("3. Procura 'Admin Key' nos logs do container")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} docker logs convex-backend-viaturas 2>&1 | grep -iE 'admin.{0,10}key' | head -10", timeout=30)
    print(out)
    if not out:
        out, _ = run(ssh, f"{SUDO} docker logs --tail 200 convex-backend-viaturas 2>&1 | head -100", timeout=30)
        print("Primeiras 100 linhas dos logs:")
        print(out[:2000])
    print()

    # 4. Tenta via API
    print("=" * 60)
    print("4. Tenta via HTTP /api/generate_admin_key ou /api/admin/key")
    print("=" * 60)
    for ep in ['/api/generate_admin_key', '/api/admin_key', '/api/admin/key', '/api/admin', '/api/instance/admin_key']:
        out, _ = run(ssh, f"curl -s -X POST http://localhost:3212{ep} 2>&1 | head -3")
        print(f"  POST {ep}: {out[:200]}")

    ssh.close()

if __name__ == "__main__":
    main()
