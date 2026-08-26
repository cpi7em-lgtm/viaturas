#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tentar convex dev --once (config diferente de deploy)"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
CONVEX_BIN = "/opt/convex-viaturas/convex/node_modules/.bin/convex"

def run(ssh, cmd, timeout=180, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Tentar convex dev --once
    print("=" * 60)
    print("1. convex dev --once (em vez de deploy)")
    print("=" * 60)
    dev_script = f"""#!/bin/bash
set -a
source /opt/convex-viaturas/convex/.env.local
set +a
cd /opt/convex-viaturas/convex
{CONVEX_BIN} dev --once --typecheck disable --codegen enable 2>&1 | head -80
"""
    sftp = ssh.open_sftp()
    with sftp.file('/tmp/dev_viaturas.sh', 'w') as f:
        f.write(dev_script)
    sftp.chmod('/tmp/dev_viaturas.sh', 0o755)
    sftp.close()
    out, _ = run(ssh, "bash /tmp/dev_viaturas.sh", timeout=120)
    print(out[-3000:])
    print()

    # 2. Verifica functions deployadas
    print("=" * 60)
    print("2. convex function-spec")
    print("=" * 60)
    fnspec_script = f"""#!/bin/bash
set -a
source /opt/convex-viaturas/convex/.env.local
set +a
cd /opt/convex-viaturas/convex
{CONVEX_BIN} function-spec 2>&1 | head -50
"""
    sftp = ssh.open_sftp()
    with sftp.file('/tmp/fnspec.sh', 'w') as f:
        f.write(fnspec_script)
    sftp.chmod('/tmp/fnspec.sh', 0o755)
    sftp.close()
    out, _ = run(ssh, "bash /tmp/fnspec.sh", timeout=60)
    print(out)
    print()

    # 3. Testa /api/query
    print("=" * 60)
    print("3. Testa units:list via /api/query")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"units/list\",\"args\":{}}' 2>&1")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
