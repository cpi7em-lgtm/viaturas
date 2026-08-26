#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sobe o SAT proxy no host (systemd-style)"""
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

# Sobe o sat_proxy.py pro host
with open(r'D:\USER\DESKTOPP\excel\viaturas\scripts\sat_proxy.py', 'rb') as f:
    sftp.file('/opt/convex-viaturas/sat_proxy.py', 'wb').write(f.read())
sftp.chmod('/opt/convex-viaturas/sat_proxy.py', 0o755)
sftp.close()
print("sat_proxy.py upado")

# Verifica se já tá rodando, mata
run(ssh, "pkill -f 'sat_proxy.py' 2>/dev/null; sleep 1; echo 'killed (se existia)'")
# Roda em background com nohup
run(ssh, "nohup python3 /opt/convex-viaturas/sat_proxy.py > /tmp/sat_proxy.log 2>&1 &")
time.sleep(2)
# Testa
out = run(ssh, "curl -s 'http://localhost:8765/sat/consulta?re=111926' 2>&1")
print(f"\n[1] Testa William: {out[:500]}")
out = run(ssh, "curl -s 'http://localhost:8765/sat/consulta?re=999999' 2>&1")
print(f"\n[2] Testa invalido: {out[:500]}")

# Verifica se ta rodando
out = run(ssh, "ps aux | grep sat_proxy | grep -v grep")
print(f"\n[3] Processo: {out}")

# Pega o IP do host (gateway do docker)
out = run(ssh, "ip route show default 2>&1 | head -3")
print(f"\n[4] Default route: {out}")
out = run(ssh, "hostname -I 2>&1")
print(f"\n[5] IP host: {out}")

ssh.close()
