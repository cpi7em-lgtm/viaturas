#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ver onde _generated foi criado"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"

def run(ssh, cmd, timeout=30):
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    cmds = [
        "find /opt/convex-viaturas -name '_generated' -type d 2>/dev/null",
        "find /opt/convex-viaturas -name '*.ts' -newer /opt/convex-viaturas/convex/.env.local 2>/dev/null | head -20",
        "ls -la /opt/convex-viaturas/convex/convex/ 2>/dev/null | head -20",
        "ls -la /tmp/ 2>/dev/null | grep -i generated | head -5",
        "ls -la /tmp/convex-viaturas/ 2>/dev/null | head -10",
        "cat /opt/convex-viaturas/convex/.env.local",
    ]
    for c in cmds:
        print(f"$ {c}")
        out, _ = run(ssh, c)
        print(out if out else "(vazio)")
        print()
    ssh.close()

if __name__ == "__main__":
    main()
