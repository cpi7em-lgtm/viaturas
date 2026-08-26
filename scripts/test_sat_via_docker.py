#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Roda script Python DENTRO do container via stdin"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

with open(r'D:\tmp\test_sat_inside.py', encoding='utf-8') as f:
    script = f.read()

# Roda via docker exec -i (stdin)
cmd = f"{SUDO} docker exec -i auth-api-viaturas python3 -"
print("Executando...")
si, so, se = ssh.exec_command(cmd, timeout=120)
time.sleep(1)
try:
    se.write(script.encode('utf-8'))
    se.flush()
except Exception as e:
    print(f"write err: {e}")

# le output
out = ""
try:
    out = so.read().decode(errors='replace')
except Exception as e:
    print(f"read err: {e}")
err = se.read().decode(errors='replace') if se else ""
print("STDOUT:")
print(out)
print("STDERR:")
print(err[:2000])
ssh.close()
