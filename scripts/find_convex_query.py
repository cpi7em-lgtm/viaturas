#!/usr/bin/env python3
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655')
# Procura a função convex_query
si, so, se = ssh.exec_command('grep -n "def convex_query\\|def convex_mutation\\|def make_token" /opt/convex-viaturas/auth-api/auth_api_viaturas.py')
print(so.read().decode(errors='replace'))
print('---')
# E testa direto o endpoint pra ver se retorna
si, so, se = ssh.exec_command('curl -s -X POST http://localhost:8081/api/admin/buscar-cpf -H "Content-Type: application/json" -d \'{"secret":"pmesp-import-2026","cpf":"26034202833"}\' 2>&1')
print(so.read().decode(errors='replace')[:400])
ssh.close()
