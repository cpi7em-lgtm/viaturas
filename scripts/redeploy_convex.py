#!/usr/bin/env python3
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655')

# Ver caminhos do convex
si, so, se = ssh.exec_command('ls -la /opt/convex-viaturas/node_modules/.bin/convex /opt/convex-viaturas/convex/node_modules/.bin/convex 2>&1')
print('convex binarios:', so.read().decode(errors='replace'))

# Re-deploy com path correto
print('\n[Deploy]...')
deploy = """#!/bin/bash
set -a
source /opt/convex-viaturas/.env.local
set +a
cd /opt/convex-viaturas
export CONVEX_TMPDIR=/home/pm/.convex-tmp
./node_modules/.bin/convex deploy --yes --typecheck disable --codegen enable 2>&1
"""
sftp = ssh.open_sftp()
with sftp.file('/tmp/deploy_v.sh', 'w') as f:
    f.write(deploy)
sftp.chmod('/tmp/deploy_v.sh', 0o755)
sftp.close()

si, so, se = ssh.exec_command('bash /tmp/deploy_v.sh', timeout=180)
out = so.read().decode(errors='replace')
print(out[-3000:])

# Testa agora
time.sleep(3)
print('\n[TEST] buscar-cpf William:')
si, so, se = ssh.exec_command('curl -s -X POST http://localhost:8081/api/admin/buscar-cpf -H "Content-Type: application/json" -d \'{"secret":"pmesp-import-2026","cpf":"26034202833"}\' 2>&1')
print(so.read().decode(errors='replace')[:600])

ssh.close()
