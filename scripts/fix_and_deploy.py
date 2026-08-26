#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Corrige convex.json e re-deploya"""
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

def run(ssh, cmd, timeout=180, get_pty=True):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Le admin key
    out, _ = run(ssh, "cat /opt/convex-viaturas/convex/.env.local")
    m = re.search(r'CONVEX_SELF_HOSTED_ADMIN_KEY=(\S+)', out)
    admin_key = m.group(1) if m else None
    print(f"Admin key: {admin_key[:60] if admin_key else 'NAO ENCONTRADA'}...")
    if not admin_key:
        # Gera
        out, _ = run(ssh, f"{SUDO} docker exec convex-backend-viaturas /convex/generate_admin_key.sh 2>&1")
        m = re.search(r'convex-self-hosted\|[a-f0-9]+', out)
        admin_key = m.group(0) if m else None
        print(f"Re-gerada: {admin_key[:60] if admin_key else 'FALHA'}...")

    # 2. Reescreve convex.json corretamente
    print()
    print("=" * 60)
    print("2. Reescreve convex.json (functions: './')")
    print("=" * 60)
    new_json = '{\n  "functions": "./"\n}\n'
    sftp = ssh.open_sftp()
    with sftp.file('/opt/convex-viaturas/convex/convex.json', 'w') as f:
        f.write(new_json)
    sftp.close()
    out, _ = run(ssh, "cat /opt/convex-viaturas/convex/convex.json")
    print(out)
    print()

    # 3. Limpa diretorio errado
    print("=" * 60)
    print("3. Remove convex/_generated/ antigo")
    print("=" * 60)
    out, _ = run(ssh, f"rm -rf /opt/convex-viaturas/convex/convex/ 2>&1; ls -la /opt/convex-viaturas/convex/ 2>&1 | head -20")
    print(out)
    print()

    # 4. Cria script de deploy
    print("=" * 60)
    print("4. Deploy!")
    print("=" * 60)
    deploy_script = f"""#!/bin/bash
set -a
source /opt/convex-viaturas/convex/.env.local
set +a
cd /opt/convex-viaturas/convex
{CONVEX_BIN} deploy --typecheck disable --codegen enable 2>&1
"""
    sftp = ssh.open_sftp()
    with sftp.file('/tmp/deploy_viaturas.sh', 'w') as f:
        f.write(deploy_script)
    sftp.chmod('/tmp/deploy_viaturas.sh', 0o755)
    sftp.close()
    out, err = run(ssh, "bash /tmp/deploy_viaturas.sh", timeout=180)
    print("STDOUT:")
    print(out)
    print("STDERR:")
    print(err)
    print()

    # 5. Verifica
    print("=" * 60)
    print("5. _generated criado onde?")
    print("=" * 60)
    out, _ = run(ssh, "find /opt/convex-viaturas -name '_generated' -type d 2>/dev/null")
    print(out)
    print()
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/convex/_generated/ 2>&1 | head")
    print(out)
    print()
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/convex/convex/ 2>&1 | head")
    print(out)
    print()

    # 6. Testa API
    print("=" * 60)
    print("6. Testa units:list via /api/query")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"units/list\",\"args\":{}}' 2>&1")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
