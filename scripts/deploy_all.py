#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SCP arquivos TS, re-deploy Convex, deploy frontend, restart nginx"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko, os

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"
CONVEX_BIN = "/opt/convex-viaturas/node_modules/.bin/convex"

def run(ssh, cmd, timeout=180, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)
sftp = ssh.open_sftp()

# 1. SCP schema.ts e agendamentos.ts
for local, remote in [
    (r'D:\USER\DESKTOPP\excel\viaturas\convex\schema.ts', '/opt/convex-viaturas/convex/schema.ts'),
    (r'D:\USER\DESKTOPP\excel\viaturas\convex\agendamentos.ts', '/opt/convex-viaturas/convex/agendamentos.ts'),
]:
    sftp.put(local, remote)
    print(f"SCP: {os.path.basename(local)} ({os.path.getsize(local)} bytes)")

sftp.close()

# 2. Re-deploy Convex
print("\n=== Re-deploy Convex ===")
deploy_script = """#!/bin/bash
set -a
source /opt/convex-viaturas/.env.local
set +a
cd /opt/convex-viaturas
export CONVEX_TMPDIR=/home/pm/.convex-tmp
./node_modules/.bin/convex deploy --yes --typecheck disable --codegen enable 2>&1
"""
sftp = ssh.open_sftp()
with sftp.file('/tmp/deploy_v.sh', 'w') as f:
    f.write(deploy_script)
sftp.chmod('/tmp/deploy_v.sh', 0o755)
sftp.close()
out = run(ssh, "bash /tmp/deploy_v.sh", timeout=180)
print(out[-1500:])

# 3. Deploy frontend
print("\n=== Deploy frontend ===")
out = run(ssh, "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A rm -rf /opt/convex-viaturas/dist /opt/convex-viaturas/dist/assets 2>&1")
print(out)
out = run(ssh, "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A mkdir -p /opt/convex-viaturas/dist/assets 2>&1")
print(out)
out = run(ssh, "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A chown -R pm:pm /opt/convex-viaturas/dist 2>&1")
print(out)

sftp = ssh.open_sftp()
for local_name, remote in [
    (r'D:\USER\DESKTOPP\excel\viaturas\frontend\dist\index.html', '/opt/convex-viaturas/dist/index.html'),
    (r'D:\USER\DESKTOPP\excel\viaturas\frontend\dist\assets\index-DABelzrf.css', '/opt/convex-viaturas/dist/assets/index-DABelzrf.css'),
    (r'D:\USER\DESKTOPP\excel\viaturas\frontend\dist\assets\index-BeLfk9jD.js', '/opt/convex-viaturas/dist/assets/index-BeLfk9jD.js'),
]:
    sftp.put(local_name, remote)
    print(f"  {os.path.basename(local_name)} -> {remote}")
sftp.close()
out = run(ssh, "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A chmod -R a+r /opt/convex-viaturas/dist 2>&1")
print(f"chmod: {out}")

# 4. Restart nginx
out = run(ssh, "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A docker restart convex-nginx-viaturas 2>&1")
print(f"restart nginx: {out}")
time.sleep(5)

# 5. Verifica
out = run(ssh, "curl -s -o /dev/null -w 'GET /: %{http_code}\\n' http://localhost:8081/")
print(f"GET /: {out}")
out = run(ssh, "curl -s -o /dev/null -w 'GET /assets/index-BeLfk9jD.js: %{http_code}\\n' http://localhost:8081/assets/index-BeLfk9jD.js")
print(f"GET bundle: {out}")

# 6. Verifica functions (novas devem aparecer)
out = run(ssh, "cd /opt/convex-viaturas && ./node_modules/.bin/convex function-spec 2>&1 | grep -E 'agendamentos|create' | head -10")
print(out)
ssh.close()
