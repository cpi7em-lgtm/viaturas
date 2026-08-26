#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tentar outras env vars do convex CLI"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
CONVEX_BIN = "/home/pm/.npm/_npx/89c650e61e38ed13/node_modules/.bin/convex"
URL = "http://localhost:3212"

# 3 candidatos pra chave
KEYS = {
    "INSTANCE_SECRET": "viaturas-cpi7-2026-secret-key-32-chars-min-aaaa",  # mesmo do docker-compose
    "ADMIN_KEY":       "viaturas-cpi7-2026-secret-key-32-chars-min-aaaa",
    "SELF_HOSTED_KEY": "viaturas-cpi7-2026-secret-key-32-chars-min-aaaa",
}

def run(ssh, cmd, timeout=60, get_pty=True):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Procura env vars no source do convex CLI
    print("=" * 60)
    print("1. Procura 'SELF_HOSTED' no CLI source")
    print("=" * 60)
    out, _ = run(ssh, "grep -r 'SELF_HOSTED' /home/pm/.npm/_npx/89c650e61e38ed13/node_modules/convex/dist/cjs-types/cli/ 2>/dev/null | head -20")
    print(out)
    print()

    # 2. Procura 'INSTANCE_SECRET' e 'ADMIN_KEY'
    print("=" * 60)
    print("2. Procura 'INSTANCE_SECRET' e 'ADMIN_KEY' no CLI source")
    print("=" * 60)
    for kw in ['INSTANCE_SECRET', 'ADMIN_KEY', 'self_hosted_admin', 'SELF_HOSTED_ADMIN', 'CONVEX_SELF_HOSTED_KEY']:
        out, _ = run(ssh, f"grep -rln '{kw}' /home/pm/.npm/_npx/89c650e61e38ed13/node_modules/convex/dist/cjs-types/cli/ 2>/dev/null | head -5")
        if out: print(f"  {kw}:")
        for line in out.split('\n'):
            if line: print(f"    {line}")

    print()
    print("=" * 60)
    print("3. Tenta dev --once com CONVEX_INSTANCE_SECRET (mesmo do compose)")
    print("=" * 60)
    cmd = (
        f"cd /opt/convex-viaturas/convex && "
        f"CONVEX_SELF_HOSTED_URL={URL} "
        f"CONVEX_INSTANCE_SECRET={KEYS['INSTANCE_SECRET']} "
        f"{CONVEX_BIN} dev --once --typecheck disable --codegen disable 2>&1"
    )
    out, err = run(ssh, cmd, timeout=120)
    print("STDOUT:")
    print(out if out else "(vazio)")
    print("STDERR:")
    print(err if err else "(vazio)")
    print()

    # 4. _generated existe agora?
    print("=" * 60)
    print("4. _generated/convex-generated existe?")
    print("=" * 60)
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/convex/_generated/ 2>&1 | head; echo '---'; ls -la /opt/convex-viaturas/convex/convex-generated/ 2>&1 | head")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
