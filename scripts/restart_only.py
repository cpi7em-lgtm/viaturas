#!/usr/bin/env python3
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655')
si, so, se = ssh.exec_command('SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A docker restart convex-nginx-viaturas')
print('restart:', so.read().decode(errors='replace').strip())
time.sleep(4)
si, so, se = ssh.exec_command('curl -s -o /dev/null -w "GET /: %{http_code} (%{size_download} bytes)\\n" http://localhost:8081/')
print(so.read().decode(errors='replace').strip())
ssh.close()
