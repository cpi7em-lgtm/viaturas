#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testa sat_consultar_re direto no servidor"""
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

# Testa direto (sem auth, vai dar 401 mas confirma que endpoint existe)
print("=== /api/sat/consulta sem auth (espera 401) ===")
out = run(ssh, "curl -s -o /dev/null -w '%{http_code}\\n' 'http://localhost:8081/api/sat/consulta?re=111926'")
print(f"  HTTP: {out}")

# Testa a função sat_consultar_re direto (bypass auth)
print()
print("=== sat_consultar_re('111926') direto ===")
cmd = """cd /opt/convex-viaturas/auth-api && python3 -c "from auth_api_viaturas import sat_consultar_re; import json; print(json.dumps(sat_consultar_re('111926'), indent=2, ensure_ascii=False))" 2>&1"""
out = run(ssh, cmd, timeout=30)
print(out)

print()
print("=== sat_consultar_re('999999') (RE invalido) ===")
out = run(ssh, """cd /opt/convex-viaturas/auth-api && python3 -c "from auth_api_viaturas import sat_consultar_re; import json; print(json.dumps(sat_consultar_re('999999'), indent=2, ensure_ascii=False))" 2>&1""")
print(out)

ssh.close()
