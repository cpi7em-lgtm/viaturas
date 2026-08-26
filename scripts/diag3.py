#!/usr/bin/env python3
"""Descobrir admin key e testar /api/import"""
import paramiko
import json

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

def run(ssh, cmd, timeout=30):
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. docker-compose-viaturas.yml
    print("=" * 60)
    print("1. docker-compose-viaturas.yml")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} cat /opt/convex-viaturas/docker-compose-viaturas.yml")
    print(out)
    print()

    # 2. /opt/convex/data (do Materiais)
    print("=" * 60)
    print("2. /opt/convex/data/ (Materiais)")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} ls -la /opt/convex/data/ 2>&1 | head -20")
    print(out)
    print()

    # 3. auth-api do Materiais (localização real)
    print("=" * 60)
    print("3. auth-api.py Materiais (sudo)")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} cat /opt/convex-app/auth-api/auth_api.py 2>/dev/null | head -100")
    print(out if out else "(nao encontrado)")

    print()
    print("=" * 60)
    print("4. convex CLI help")
    print("=" * 60)
    out, _ = run(ssh, "~/.npm/_npx/89c650e61e38ed13/node_modules/.bin/convex --help 2>&1 | head -40")
    print(out)

    print()
    print("=" * 60)
    print("5. convex deploy --help")
    print("=" * 60)
    out, _ = run(ssh, "~/.npm/_npx/89c650e61e38ed13/node_modules/.bin/convex deploy --help 2>&1 | head -40")
    print(out)

    print()
    print("=" * 60)
    print("6. convex dev --help")
    print("=" * 60)
    out, _ = run(ssh, "~/.npm/_npx/89c650e61e38ed13/node_modules/.bin/convex dev --help 2>&1 | head -40")
    print(out)

    print()
    print("=" * 60)
    print("7. /api/import com POST? Testa varios content-types")
    print("=" * 60)
    for ct in ['application/json', 'text/plain', 'application/octet-stream']:
        cmd = f"curl -s -o /dev/null -w '%{{http_code}}' -X POST -H 'Content-Type: {ct}' -d '{{}}' http://localhost:3212/api/import"
        out, _ = run(ssh, cmd, timeout=10)
        print(f"  POST /api/import (Content-Type: {ct}) -> {out}")
    # Tenta com query string
    for q in ['?format=ts', '?format=json', '?bundle=1']:
        cmd = f"curl -s -o /dev/null -w '%{{http_code}}' -X POST -H 'Content-Type: application/json' -d '{{}}' 'http://localhost:3212/api/import{q}'"
        out, _ = run(ssh, cmd, timeout=10)
        print(f"  POST /api/import{q} -> {out}")

    print()
    print("=" * 60)
    print("8. Lista todos endpoints /api do convex")
    print("=" * 60)
    # Tenta ler o binário do convex pra ver endpoints
    out, _ = run(ssh, f"{SUDO} docker exec convex-backend-viaturas ls / 2>&1 | head -30")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
