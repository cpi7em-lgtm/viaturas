#!/usr/bin/env python3
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655')
si, so, se = ssh.exec_command("grep -n 'OPM Atual\\|Habilita\\|Dados da' /opt/convex-viaturas/auth-api/auth_api_viaturas.py | head -10")
print(so.read().decode(errors='replace'))
ssh.close()
