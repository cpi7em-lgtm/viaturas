#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sobe sat_proxy_v2 no host e testa"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)
sftp = ssh.open_sftp()

with open(r'D:\USER\DESKTOPP\excel\viaturas\scripts\sat_proxy_v2.py', 'rb') as f:
    sftp.file('/opt/convex-viaturas/sat_proxy.py', 'wb').write(f.read())
sftp.chmod('/opt/convex-viaturas/sat_proxy.py', 0o755)
sftp.close()
print("sat_proxy.py upado")

run(ssh, "pkill -f sat_proxy.py 2>/dev/null; sleep 1")
run(ssh, "nohup python3 /opt/convex-viaturas/sat_proxy.py > /tmp/sat_proxy.log 2>&1 & disown")
time.sleep(2)
out = run(ssh, "curl -s 'http://localhost:8765/sat/consulta?re=111926' 2>&1")
print(f"\n[1] William: {out[:800]}")
out = run(ssh, "curl -s 'http://localhost:8765/sat/consulta?re=999999' 2>&1")
print(f"\n[2] invalido: {out[:300]}")

# Testa do CONTAINER (via host.docker.internal)
print()
print("[3] Do container via host.docker.internal:8765")
out = run(ssh, f"{SUDO} docker exec auth-api-viaturas curl -s 'http://host.docker.internal:8765/sat/consulta?re=111926' 2>&1")
print(f"  {out[:500]}")

# Testa de fora (10.36.177.138)
print()
print("[4] De fora (10.36.177.138:8765)")
out = run(ssh, "curl -s 'http://10.36.177.138:8765/sat/consulta?re=111926' 2>&1")
print(f"  {out[:500]}")

ssh.close()
