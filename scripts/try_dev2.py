#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tentar convex dev --once com timeout longo e log"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import time

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
CONVEX_BIN = "/opt/convex-viaturas/convex/node_modules/.bin/convex"

def run_capture(ssh, cmd, timeout=300, get_pty=True):
    """Roda comando, retorna output parcial se timeout"""
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
    out = "".join(output_chunks)
    return out, so.channel.recv_exit_status() if so.channel.exit_status_ready() else None

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Limpa processos convex pendentes (se algum)
    si, so, se = ssh.exec_command("pgrep -af 'convex dev' 2>&1")
    out = so.read().decode(errors='replace')
    print(f"Processos convex dev pendentes: {out if out else '(nenhum)'}")

    # 2. convex dev --once com timeout longo
    print("=" * 60)
    print("1. convex dev --once (timeout 240s)")
    print("=" * 60)
    dev_script = f"""#!/bin/bash
set -a
source /opt/convex-viaturas/convex/.env.local
set +a
cd /opt/convex-viaturas/convex
{CONVEX_BIN} dev --once --typecheck disable --codegen enable --tail-logs never 2>&1
"""
    sftp = ssh.open_sftp()
    with sftp.file('/tmp/dev_viaturas.sh', 'w') as f:
        f.write(dev_script)
    sftp.chmod('/tmp/dev_viaturas.sh', 0o755)
    sftp.close()

    out, ec = run_capture(ssh, "bash /tmp/dev_viaturas.sh", timeout=240)
    print(out[-4000:])
    print(f"Exit code: {ec}")
    print()

    # 2. function-spec
    print("=" * 60)
    print("2. convex function-spec")
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

    # 3. Testa API
    print("=" * 60)
    print("3. Testa units:list")
    print("=" * 60)
    si, so, se = ssh.exec_command("curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"units/list\",\"args\":{}}' 2>&1")
    out = so.read().decode(errors='replace')
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
