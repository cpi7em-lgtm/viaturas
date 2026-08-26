#!/usr/bin/env python3
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import paramiko, json
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655')
si, so, se = ssh.exec_command('curl -s -X POST http://localhost:3212/api/query -H "Content-Type: application/json" -d \'{"path":"pm_auth:listAll","args":{"secret":"pmesp-import-2026"}}\'')
d = json.loads(so.read().decode(errors='replace'))
for u in d.get('value', []):
    print(f"cpf={u.get('cpf')} nome={u.get('name')} role={u.get('role')} viaturasRole={u.get('viaturasRole')} unidGestor={u.get('unidadesGestor')} unidEditor={u.get('unidadesEditor')}")
ssh.close()
