#!/usr/bin/env python3
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655')
print("=== Ultimos 50 logs do auth-api ===")
si, so, se = ssh.exec_command('SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A docker logs auth-api-viaturas --tail 80')
print(so.read().decode(errors='replace'))
ssh.close()
