#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Re-deploy com convex CLI novo (de node_modules)"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import re

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"

# USA A VERSAO NOVA DO CLI (que eu SCP'ei junto com node_modules)
CONVEX_BIN = "/opt/convex-viaturas/convex/node_modules/.bin/convex"

def run(ssh, cmd, timeout=180, get_pty=True):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 0. Limpa _generated pra forcar regenerar
    out, _ = run(ssh, "rm -rf /opt/convex-viaturas/convex/_generated")
    print(f"Limpeza: {out or '(ok)'}")

    # 1. Verifica versão do CLI novo
    print("=" * 60)
    print("1. Versão do convex CLI novo")
    print("=" * 60)
    out, _ = run(ssh, f"{CONVEX_BIN} --version 2>&1")
    print(out)
    out, _ = run(ssh, f"cat {CONVEX_BIN} | head -1 2>&1; ls -la {CONVEX_BIN} 2>&1")
    print(out)
    print()

    # 2. Deploy
    print("=" * 60)
    print("2. convex deploy")
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

    # 3. Verifica _generated
    print("=" * 60)
    print("3. _generated conteudo")
    print("=" * 60)
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/convex/_generated/ 2>&1")
    print(out)
    print()

    # 4. Testa API: units:list
    print("=" * 60)
    print("4. Testa units:list")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"units/list\",\"args\":{}}' 2>&1")
    print(out)
    print()

    # 5. Lista tables/funcoes do backend
    print("=" * 60)
    print("5. Lista functions deployadas (convex function-spec)")
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
    out, _ = run(ssh, "bash /tmp/fnspec.sh", timeout=60)
    print(out[:3000])

    ssh.close()

if __name__ == "__main__":
    main()
