#!/usr/bin/env python3
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import paramiko, json
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655')

# Promove William pra admin
si, so, se = ssh.exec_command('curl -s -X POST http://localhost:3212/api/mutation -H "Content-Type: application/json" -d \'{"path":"pm_auth:setViaturasRole","args":{"secret":"pmesp-import-2026","cpf":"26034202833","viaturasRole":"admin","unidadesGestor":["j976xav14pysg2bvqbmekqrr3s8c025a"],"unidadesEditor":[]}}\'')
print('setRole:', so.read().decode(errors='replace')[:200])

# Verifica
si, so, se = ssh.exec_command('curl -s -X POST http://localhost:3212/api/query -H "Content-Type: application/json" -d \'{"path":"pm_auth:listAll","args":{"secret":"pmesp-import-2026"}}\'')
d = json.loads(so.read().decode(errors='replace'))
for u in d.get('value', []):
    if u.get('cpf') == '26034202833':
        print(f"William: viaturasRole={u.get('viaturasRole')} role={u.get('role')} unidGestor={u.get('unidadesGestor')}")
ssh.close()
