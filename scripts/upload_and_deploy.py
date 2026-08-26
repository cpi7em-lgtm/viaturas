#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SCP arquivos TS do Windows pro servidor e fazer deploy"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import time
import os

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"

LOCAL_CONVEX = r"D:\USER\DESKTOPP\excel\viaturas\convex"
REMOTE_CONVEX = "/opt/convex-viaturas/convex"

FILES = [
    "schema.ts",
    "_helpers.ts",
    "pm_auth.ts",
    "agendamentos.ts",
    "viaturas.ts",
    "dashboard.ts",
    "units.ts",
    "tsconfig.json",
]

def run(ssh, cmd, timeout=60, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def run_capture(ssh, cmd, timeout=300, get_pty=True):
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
    sftp = ssh.open_sftp()

    # 1. SCP arquivos TS
    print("=" * 60)
    print("1. SCP arquivos TS pro servidor")
    print("=" * 60)
    for f in FILES:
        local_path = os.path.join(LOCAL_CONVEX, f)
        remote_path = f"{REMOTE_CONVEX}/{f}"
        if os.path.exists(local_path):
            size = os.path.getsize(local_path)
            sftp.put(local_path, remote_path)
            print(f"  {f}: {size} bytes -> {remote_path}")
        else:
            print(f"  {f}: NAO ENCONTRADO localmente ({local_path})")
    sftp.close()
    print()

    # 2. Verifica
    out, _ = run(ssh, f"ls -la {REMOTE_CONVEX}/ | head -20")
    print(out)
    print()

    # 3. Limpa _generated
    out, _ = run(ssh, "rm -rf /opt/convex-viaturas/convex/_generated")
    print(f"Limpa _generated: {out or '(ok)'}")
    print()

    # 4. Deploy!
    print("=" * 60)
    print("2. convex deploy --yes (DE VERDADE agora)")
    print("=" * 60)
    deploy_script = """#!/bin/bash
cd /opt/convex-viaturas
export CONVEX_TMPDIR=/home/pm/.convex-tmp
./node_modules/.bin/convex deploy --yes --typecheck disable --codegen enable 2>&1
"""
    sftp = ssh.open_sftp()
    with sftp.file('/tmp/deploy_v.sh', 'w') as f:
        f.write(deploy_script)
    sftp.chmod('/tmp/deploy_v.sh', 0o755)
    sftp.close()
    out, ec = run_capture(ssh, "bash /tmp/deploy_v.sh", timeout=240)
    print(out[-3000:])
    print(f"\nExit code: {ec}")
    print()

    # 5. function-spec
    print("=" * 60)
    print("3. function-spec")
    print("=" * 60)
    out, _ = run(ssh, "cd /opt/convex-viaturas && ./node_modules/.bin/convex function-spec 2>&1")
    print(out[:3000])
    print()

    # 6. Testa API
    print("=" * 60)
    print("4. Testa units:list via API")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"units/list\",\"args\":{}}' 2>&1")
    print(out)
    print()

    # 7. Lista tabelas
    print("=" * 60)
    print("5. convex data (tabelas)")
    print("=" * 60)
    out, _ = run(ssh, "cd /opt/convex-viaturas && ./node_modules/.bin/convex data 2>&1 | head -20")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
