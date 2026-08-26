#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testa SAT via docker exec (Python com fastapi)"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
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

# Testa via docker exec (Python com fastapi instalado)
print("=== /api/sat/consulta via docker exec ===")
# Auth via header Authorization: Bearer ... (gera um token via /api/auth/login)
# Como não temos senha, vou usar um token gerado direto
# Vou gerar um token usando Python do container
gen = '''python3 -c "
import sys; sys.path.insert(0, '/app')
import os, json, time
os.environ['JWT_SECRET'] = 'viaturas-pmesp-cpi7-2026-secret'
import auth_api_viaturas as a
tok = a.make_token({'sub':'26034202833','iat':int(time.time()),'exp':int(time.time())+3600,'pm':{'cpf':'26034202833'},'aud':'viaturas','app':'viaturas'})
print(tok)
"'''
out = run(ssh, f"{SUDO} docker exec auth-api-viaturas bash -c '{gen}'", timeout=15)
token = out.strip().split('\n')[-1]
print(f"  Token: {token[:60]}...")

# Agora chama SAT com esse token
sat_cmd = f"curl -s -H 'Authorization: Bearer {token}' 'http://localhost:8081/api/sat/consulta?re=111926'"
out = run(ssh, f"{SUDO} docker exec auth-api-viaturas bash -c \"{sat_cmd}\"", timeout=30)
print(f"\n  /api/sat/consulta?re=111926:")
print(f"  {out[:1500]}")

# Testa RE invalido
sat_cmd2 = f"curl -s -H 'Authorization: Bearer {token}' 'http://localhost:8081/api/sat/consulta?re=999999'"
out = run(ssh, f"{SUDO} docker exec auth-api-viaturas bash -c \"{sat_cmd2}\"", timeout=30)
print(f"\n  /api/sat/consulta?re=999999 (invalido):")
print(f"  {out[:500]}")

ssh.close()
