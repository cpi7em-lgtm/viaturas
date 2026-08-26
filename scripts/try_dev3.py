#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Consertar .env.local (com aspas) e tentar convex dev --once"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import time

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"
CONVEX_BIN = "/opt/convex-viaturas/convex/node_modules/.bin/convex"

def run(ssh, cmd, timeout=60, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def run_capture(ssh, cmd, timeout=240, get_pty=True):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    output_chunks = []
    start = time.time()
    try:
        while True:
            if so.channel.recv_ready():
                chunk = so.channel.recv(4096).decode(errors='replace')
                output_chunks.append(chunk)
            elif so.channel.exit_status_ready():
                break
            else:
                time.sleep(0.5)
                if time.time() - start > timeout:
                    so.channel.close()
                    break
    except Exception as e:
        output_chunks.append(f"\n[ERRO] {e}")
    return "".join(output_chunks), so.channel.recv_exit_status() if so.channel.exit_status_ready() else None

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Pega admin key atual
    out, _ = run(ssh, "cat /opt/convex-viaturas/convex/.env.local")
    import re
    m = re.search(r'CONVEX_SELF_HOSTED_ADMIN_KEY=(\S+)', out)
    admin_key = m.group(1) if m else None
    if not admin_key:
        out, _ = run(ssh, f"{SUDO} docker exec convex-backend-viaturas /convex/generate_admin_key.sh 2>&1")
        m = re.search(r'convex-self-hosted\|[a-f0-9]+', out)
        admin_key = m.group(0) if m else None
    print(f"Admin key: {admin_key[:60] if admin_key else 'FALHA'}...")

    # 2. Reescreve .env.local COM ASPAS (evita problema do |)
    new_env = (
        f'CONVEX_SELF_HOSTED_URL="http://localhost:3212"\n'
        f'CONVEX_SELF_HOSTED_ADMIN_KEY="{admin_key}"\n'
    )
    sftp = ssh.open_sftp()
    with sftp.file('/opt/convex-viaturas/convex/.env.local', 'w') as f:
        f.write(new_env)
    sftp.close()
    print(f"\n.env.local novo:")
    out, _ = run(ssh, "cat /opt/convex-viaturas/convex/.env.local")
    print(out)
    print()

    # 3. Testa source direto
    print("=" * 60)
    print("1. Testa source do .env.local")
    print("=" * 60)
    out, _ = run(ssh, "bash -c 'set -a; source /opt/convex-viaturas/convex/.env.local; set +a; echo URL=$CONVEX_SELF_HOSTED_URL; echo KEY=${CONVEX_SELF_HOSTED_ADMIN_KEY:0:30}...' 2>&1")
    print(out)
    print()

    # 4. convex dev --once
    print("=" * 60)
    print("2. convex dev --once (timeout 240s, sem --tail-logs)")
    print("=" * 60)
    dev_script = f"""#!/bin/bash
set -a
source /opt/convex-viaturas/convex/.env.local
set +a
cd /opt/convex-viaturas/convex
{CONVEX_BIN} dev --once --typecheck disable --codegen enable --tail-logs disable 2>&1
"""
    sftp = ssh.open_sftp()
    with sftp.file('/tmp/dev_viaturas.sh', 'w') as f:
        f.write(dev_script)
    sftp.chmod('/tmp/dev_viaturas.sh', 0o755)
    sftp.close()
    out, ec = run_capture(ssh, "bash /tmp/dev_viaturas.sh", timeout=240)
    print(out[-4000:])
    print(f"\nExit code: {ec}")
    print()

    # 5. function-spec
    print("=" * 60)
    print("3. convex function-spec")
    print("=" * 60)
    fnspec_script = f"""#!/bin/bash
set -a
source /opt/convex-viaturas/convex/.env.local
set +a
cd /opt/convex-viaturas/convex
{CONVEX_BIN} function-spec 2>&1
"""
    sftp = ssh.open_sftp()
    with sftp.file('/tmp/fnspec.sh', 'w') as f:
        f.write(fnspec_script)
    sftp.chmod('/tmp/fnspec.sh', 0o755)
    sftp.close()
    out, _ = run_capture(ssh, "bash /tmp/fnspec.sh", timeout=30)
    print(out[:2000])
    print()

    # 6. Testa API
    print("=" * 60)
    print("4. Testa units:list")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"units/list\",\"args\":{}}' 2>&1")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
