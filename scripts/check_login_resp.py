#!/usr/bin/env python3
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655')
si, so, se = ssh.exec_command('grep -n "def login\|sync-convex\|sync_res\|usuario =\|viaturasRole" /opt/convex-viaturas/auth-api/auth_api_viaturas.py 2>/dev/null | head -30')
print(so.read().decode(errors='replace'))
ssh.close()
