#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Deploy com env vars via arquivo (evita problema de pipe)"""
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

def run(ssh, cmd, timeout=120, get_pty=True):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 0. Pega a admin key do .env.local que acabei de salvar
    print("=" * 60)
    print("0. Le admin key do .env.local")
    print("=" * 60)
    out, _ = run(ssh, "cat /opt/convex-viaturas/convex/.env.local")
    print(out)
    m = re.search(r'CONVEX_SELF_HOSTED_ADMIN_KEY=(\S+)', out)
    if m:
        admin_key = m.group(1)
        print(f"Admin key: {admin_key[:60]}...")
    else:
        # Pega do output do generate_admin_key.sh
        out, _ = run(ssh, f"{SUDO} docker exec convex-backend-viaturas /convex/generate_admin_key.sh 2>&1")
        m = re.search(r'convex-self-hosted\|[a-f0-9]+', out)
        if m:
            admin_key = m.group(0)
            print(f"Admin key re-gerada: {admin_key[:60]}...")
        else:
            print("FALHOU ao pegar admin key")
            ssh.close()
            return

    # 1. Atualiza .env.local com a chave CORRETA
    print()
    print("=" * 60)
    print("1. Reescreve .env.local")
    print("=" * 60)
    new_env = f"CONVEX_SELF_HOSTED_URL={URL}\nCONVEX_SELF_HOSTED_ADMIN_KEY={admin_key}\n"
    sftp = ssh.open_sftp()
    with sftp.file('/opt/convex-viaturas/convex/.env.local', 'w') as f:
        f.write(new_env)
    sftp.close()
    out, _ = run(ssh, "cat /opt/convex-viaturas/convex/.env.local")
    print(out)
    print()

    # 2. Deploy via script shell com source (evita problema de pipe)
    print("=" * 60)
    print("2. convex deploy via source .env.local")
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

    # 3. Verifica _generated/
    print("=" * 60)
    print("3. _generated/ existe?")
    print("=" * 60)
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/convex/_generated/ 2>&1 | head -20")
    print(out)
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/convex/convex-generated/ 2>&1 | head -20")
    print(out)
    print()

    # 4. Testa uma function minha via API
    print("=" * 60)
    print("4. POST /api/query units:list (minha function)")
    print("=" * 60)
    out, _ = run(ssh, f"curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{{\"path\":\"units/list\",\"args\":{{}}}}' 2>&1")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
