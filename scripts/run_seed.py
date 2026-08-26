#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rodar seed_units + verificar function-spec completo + criar user William"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import time

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"

def run(ssh, cmd, timeout=60, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Ver todas as functions (function-spec)
    print("=" * 60)
    print("1. Lista TODAS as functions deployadas")
    print("=" * 60)
    out, _ = run(ssh, "cd /opt/convex-viaturas && ./node_modules/.bin/convex function-spec 2>&1 | grep -E '\"identifier\"|\"functionType\"' | head -50")
    print(out)
    print()

    # 2. Roda seed_units.py (1x só)
    print("=" * 60)
    print("2. Roda seed_units.py")
    print("=" * 60)
    out, _ = run(ssh, "python3 /opt/convex-viaturas/seed_units.py 2>&1", timeout=30)
    print(out)
    print()

    # 3. Verifica via API
    print("=" * 60)
    print("3. Verifica units populadas")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"units:list\",\"args\":{}}' 2>&1")
    print(out)
    print()

    # 4. Cria user William via API
    print("=" * 60)
    print("4. Cria user William (admin master)")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:3212/api/mutation -H 'Content-Type: application/json' -d '{\"path\":\"pm_auth:createOrUpdatePMUser\",\"args\":{\"cpf\":\"26034202833\",\"re\":\"1119265\",\"digre\":\"\",\"name\":\"WILLIAM MICHEL\",\"warName\":\"WILLIAM\",\"postoGraduacao\":\"CB PM\",\"codptgr\":\"3\",\"role\":\"admin\",\"email\":\"william@pmesp.gov.br\",\"unidadesGestor\":[],\"unidadesEditor\":[]}}' 2>&1")
    print(out)

    # 5. Testa listar users
    print()
    print("=" * 60)
    print("5. Lista users (pode não ter query, mas tenta)")
    print("=" * 60)
    for name in ['pm_auth:listAll', 'users:list', 'users.js:list', 'pm_auth.js:listAll']:
        out, _ = run(ssh, f"curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{{\"path\":\"{name}\",\"args\":{{}}}}' 2>&1")
        print(f"  '{name}': {out[:200]}")
    print()

    # 6. function-spec: filtrar por modules
    print("=" * 60)
    print("6. function-spec: por module")
    print("=" * 60)
    out, _ = run(ssh, "cd /opt/convex-viaturas && ./node_modules/.bin/convex function-spec 2>&1 | grep '\"identifier\"' | sort -u")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
