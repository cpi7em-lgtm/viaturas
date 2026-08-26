#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sobe script de teste e roda dentro do container"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
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

# Sobe o script
with open('D:/tmp/test_sat_inside.py', 'rb') as f:
    sftp.file('/tmp/test_sat_inside.py', 'wb').write(f.read())
sftp.close()
print("Script upado")

# Roda dentro do container
out = run(ssh, f"{SUDO} docker exec auth-api-viaturas python3 /tmp/test_sat_inside.py 2>&1", timeout=60)
print(out)

ssh.close()
