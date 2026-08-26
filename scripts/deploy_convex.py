#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Deploy backend Convex Viaturas CPI-7
- SCP arquivos convex/ pro server
- roda npx convex deploy no /opt/convex-viaturas/convex
"""
import paramiko
import sys
import io
import os
import subprocess
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

CONVEX_DIR = Path("D:/USER/DESKTOPP/excel/viaturas/convex")
SERVER_CONVEX_DIR = "/opt/convex-viaturas/convex"

CONVEX_FILES = [
    "schema.ts",
    "_helpers.ts",
    "pm_auth.ts",
    "agendamentos.ts",
    "viaturas.ts",
    "dashboard.ts",
    "package.json",
    "tsconfig.json",
]


def run(ssh, cmd, timeout=120):
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    out = so.read().decode(errors='replace')
    err = se.read().decode(errors='replace')
    ec = so.channel.recv_exit_status() if hasattr(so.channel, 'recv_exit_status') else None
    return out, err, ec


def main():
    # 1) Conecta
    print("[1] Conectando SSH...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)
    print("OK conectado")

    # 2) Upload SFTP
    print("\n[2] Upload SFTP dos arquivos convex/...")
    sftp = ssh.open_sftp()
    sftp.mkdir(SERVER_CONVEX_DIR)  # ignora se já existe

    for f in CONVEX_FILES:
        local = CONVEX_DIR / f
        if not local.exists():
            print(f"  WARN: {f} não existe local, pulando")
            continue
        remote = f"{SERVER_CONVEX_DIR}/{f}"
        sftp.put(str(local), remote)
        print(f"  OK: {f}")
    print("OK upload")

    # 3) npx convex deploy (no server)
    print("\n[3] Rodando npx convex deploy...")
    out, err, ec = run(ssh, f"cd {SERVER_CONVEX_DIR} && npx convex deploy --yes 2>&1", timeout=120)
    print(out)
    if err:
        print("STDERR:", err)
    if ec != 0:
        print(f"ERRO deploy (exit code {ec})")
        ssh.close()
        return 1

    print("\nDEPLOY CONVEX CONCLUIDO!")
    ssh.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
