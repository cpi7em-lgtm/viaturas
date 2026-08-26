#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Investiga e conserta DNS do container auth-api-viaturas"""
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

# 1. DNS do host
print("=== /etc/resolv.conf do HOST ===")
out = run(ssh, f"{SUDO} cat /etc/resolv.conf")
print(out)

# 2. DNS do container
print("\n=== DNS do container auth-api-viaturas ===")
out = run(ssh, f"{SUDO} docker exec auth-api-viaturas cat /etc/resolv.conf")
print(out)

# 3. Testa DNS do container
print("\n=== Testa DNS no container ===")
out = run(ssh, f"{SUDO} docker exec auth-api-viaturas nslookup sistemasadmin.intranet.policiamilitar.sp.gov.br 2>&1 | head -10")
print(out)
out = run(ssh, f"{SUDO} docker exec auth-api-viaturas ping -c 2 8.8.8.8 2>&1 | head -5")
print(out)

# 4. Adiciona DNS do host no container (opcao: usar --dns no docker run)
# OU adicionar dns no docker-compose e restart
# Mais simples: editar o docker-compose pra usar network_mode: host
# OU adicionar dns: no service
print("\n=== docker-compose network ===")
out = run(ssh, "grep -E 'dns|network' /opt/convex-viaturas/docker-compose-viaturas.yml 2>&1")
print(out or "(nenhum dns/network)")

# 5. Testa diretamente do servidor (sem container)
print("\n=== Testa SAT direto do servidor (sem container) ===")
out = run(ssh, "curl -s -X POST 'https://sistemasadmin.intranet.policiamiltar.sp.gov.br/sat/consultaReply.asp' -d 're=111926' -H 'User-Agent: Mozilla/5.0' 2>&1 | head -c 200")
print(out)

ssh.close()
