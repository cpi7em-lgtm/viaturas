#!/usr/bin/env python3
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import paramiko, json
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655')

# 1. Ver o user William no Convex AGORA
print("=" * 60)
print("1. User William no Convex (AGORA)")
print("=" * 60)
si, so, se = ssh.exec_command('curl -s -X POST http://localhost:3212/api/query -H "Content-Type: application/json" -d \'{"path":"pm_auth:listAll","args":{"secret":"pmesp-import-2026"}}\'')
d = json.loads(so.read().decode(errors='replace'))
for u in d.get('value', []):
    print(f"  cpf={u.get('cpf')} viaturasRole={u.get('viaturasRole')} unidGestor={u.get('unidadesGestor')} promotedAt={u.get('promotedAt')}")

# 2. Ver o patch no auth-api
print()
print("=" * 60)
print("2. Patch no auth-api ta aplicado?")
print("=" * 60)
si, so, se = ssh.exec_command('grep -c "busca user COMPLETO" /opt/convex-viaturas/auth-api/auth_api_viaturas.py')
print('  "busca user COMPLETO" count:', so.read().decode(errors='replace').strip())

# 3. Logs do auth-api dos ultimos logins
print()
print("=" * 60)
print("3. Ultimos logs do auth-api")
print("=" * 60)
si, so, se = ssh.exec_command('SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A docker logs auth-api-viaturas --tail 30')
print(so.read().decode(errors='replace')[-2500:])

ssh.close()
