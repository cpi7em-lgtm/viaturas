#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testa urllib do Python com DNS do container"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

def run(ssh, cmd, timeout=60, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# Testa urllib direto no container (com mais debug)
print("=== Testa urllib.request com timeout maior ===")
cmd = '''python3 -c "
import urllib.request, socket
socket.setdefaulttimeout(30)
import urllib.error
try:
    data = 're=111926'.encode('iso-8859-1')
    req = urllib.request.Request('https://sistemasadmin.intranet.policiamiltar.sp.gov.br/sat/consultaReply.asp', data=data, headers={'User-Agent':'Mozilla/5.0','Content-Type':'application/x-www-form-urlencoded'}, method='POST')
    print('Resolved:', socket.gethostbyname('sistemasadmin.intranet.policiamiltar.sp.gov.br'))
    with urllib.request.urlopen(req, timeout=30) as r:
        body = r.read().decode('iso-8859-1', errors='replace')
        print('STATUS:', r.status, 'LEN:', len(body))
        print(body[:500])
except Exception as e:
    print('ERRO:', type(e).__name__, e)
"'''
out = run(ssh, f"{SUDO} docker exec auth-api-viaturas python3 -c \"{cmd}\"", timeout=60)
print(out)

ssh.close()
