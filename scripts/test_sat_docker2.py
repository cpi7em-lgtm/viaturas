#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sobe script e executa no container"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

def run(ssh, cmd, timeout=60, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)
sftp = ssh.open_sftp()

with open(r'D:\tmp\test_sat_container.py', 'rb') as f:
    sftp.file('/opt/convex-viaturas/auth-api/test_sat.py', 'wb').write(f.read())
sftp.close()

# docker cp via exec seria complicado, mas o diretorio auth-api e montado no container
# (veja docker-compose: /opt/convex-viaturas/auth-api -> /app)
# Entao python3 /app/test_sat.py vai funcionar
out = run(ssh, f"{SUDO} docker exec auth-api-viaturas python3 /app/test_sat.py 2>&1", timeout=30)
print("=== Teste SAT no container ===")
print(out)
ssh.close()
