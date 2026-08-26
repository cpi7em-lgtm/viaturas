#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""William se promove como gestor de CPI-7 e testa criar agendamento"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import json

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Pega ID da CPI-7
    out = run(ssh, 'curl -s -X POST http://localhost:3212/api/query -H \'Content-Type: application/json\' -d \'{"path":"units:getByCode","args":{"code":"607000000"}}\'')
    d = json.loads(out)
    cpi7_id = d['value']['_id']
    print(f"CPI-7 ID: {cpi7_id}")

    # 2. Promove William como admin (cria user se não existe)
    print("\n[1] Promovendo William como admin...")
    body = f'{{"path":"pm_auth:setViaturasRole","args":{{"secret":"pmesp-import-2026","cpf":"26034202833","viaturasRole":"admin","unidadesGestor":["{cpi7_id}"],"unidadesEditor":[]}}}}'
    out = run(ssh, f"curl -s -X POST http://localhost:3212/api/mutation -H 'Content-Type: application/json' -d '{body}'")
    print(out[:500])

    # 3. Verifica William agora
    out = run(ssh, 'curl -s -X POST http://localhost:3212/api/query -H \'Content-Type: application/json\' -d \'{"path":"pm_auth:listAll","args":{"secret":"pmesp-import-2026"}}\'')
    d = json.loads(out)
    for u in d['value']:
        if u.get('cpf') == '26034202833':
            print(f"William: viaturasRole={u.get('viaturasRole')}, unidadesGestor={u.get('unidadesGestor')}")

    # 4. Tenta criar agendamento de novo
    print("\n[2] Cria agendamento teste")
    body = '{"path":"agendamentos:create","args":{"cpf":"26034202833","unidadeSigla":"CPI-7","tipoViaturaSolicitada":"GM-Trailblazer","dataMissao":1730000000000,"destino":"SP","finalidade":"TESTE E2E","oficialAutorizador":"Cel TESTE","retiradaData":1730000000000,"retiradaHora":"08:00","devolucaoData":1730086400000,"devolucaoHora":"18:00"}}'
    out = run(ssh, f"curl -s -X POST http://localhost:3212/api/mutation -H 'Content-Type: application/json' -d '{body}'")
    print(out[:500])

    # 5. Lista agendamentos
    print("\n[3] Lista agendamentos do William")
    out = run(ssh, 'curl -s -X POST http://localhost:3212/api/query -H \'Content-Type: application/json\' -d \'{"path":"agendamentos:list","args":{"cpf":"26034202833"}}\'')
    d = json.loads(out)
    if 'value' in d:
        print(f"Total: {len(d['value'])}")
        for a in d['value'][:3]:
            print(f"  - {a.get('destino')} ({a.get('status')}) - {a.get('tipoViaturaSolicitada')}")

    # 6. Dashboard
    print("\n[4] Dashboard home stats")
    out = run(ssh, 'curl -s -X POST http://localhost:3212/api/query -H \'Content-Type: application/json\' -d \'{"path":"dashboard:getHomeStats","args":{"cpf":"26034202833"}}\'')
    print(out[:300])

    ssh.close()

if __name__ == "__main__":
    main()
