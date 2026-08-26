#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Restart nginx e testa convex via nginx"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import json

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    return out

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    out = run(ssh, f"{SUDO} docker restart convex-nginx-viaturas 2>&1")
    print(f"restart: {out}")
    time.sleep(5)

    # Testa 1: units:list
    print("\n[1] /convex/query/units:list via nginx")
    out = run(ssh, 'curl -s -X POST http://localhost:8081/convex/query/units:list -H \'Content-Type: application/json\' -d \'{"path":"units:list","args":{}}\'')
    print(out[:300])
    try:
        d = json.loads(out)
        if 'value' in d:
            print(f"OK: {len(d['value'])} units")
    except Exception as e:
        print(f"parse: {e}")

    # Testa 2: dashboard:getHomeStats com cpf
    print("\n[2] /convex/query/dashboard:getHomeStats com cpf William")
    out = run(ssh, 'curl -s -X POST http://localhost:8081/convex/query/dashboard:getHomeStats -H \'Content-Type: application/json\' -d \'{"path":"dashboard:getHomeStats","args":{"cpf":"26034202833"}}\'')
    print(out[:500])

    # Testa 3: viaturas:list (vai dar erro - sem viatura cadastrada)
    print("\n[3] /convex/query/viaturas:list com cpf William")
    out = run(ssh, 'curl -s -X POST http://localhost:8081/convex/query/viaturas:list -H \'Content-Type: application/json\' -d \'{"path":"viaturas:list","args":{"cpf":"26034202833"}}\'')
    print(out[:500])

    # Testa 4: agendamentos:list com cpf William
    print("\n[4] /convex/query/agendamentos:list com cpf William")
    out = run(ssh, 'curl -s -X POST http://localhost:8081/convex/query/agendamentos:list -H \'Content-Type: application/json\' -d \'{"path":"agendamentos:list","args":{"cpf":"26034202833"}}\'')
    print(out[:500])

    # Testa 5: criar agendamento
    print("\n[5] /convex/mutation/agendamentos:cre até (criar teste)")
    body = '{"path":"agendamentos:create","args":{"cpf":"26034202833","unidadeSigla":"CPI-7","tipoViaturaSolicitada":"GM-Trailblazer","dataMissao":1730000000000,"destino":"SP","finalidade":"TESTE","oficialAutorizador":"Cel TESTE","retiradaData":1730000000000,"retiradaHora":"08:00","devolucaoData":1730086400000,"devolucaoHora":"18:00"}}'
    out = run(ssh, f"curl -s -X POST http://localhost:8081/convex/mutation/agendamentos:cre até -H 'Content-Type: application/json' -d '{body}'")
    print(out[:500])

    ssh.close()

if __name__ == "__main__":
    main()
