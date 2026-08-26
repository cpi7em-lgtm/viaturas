#!/usr/bin/env python3
"""Descobrir como o Materiais fez deploy do Convex"""
import paramiko

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

    # 1. docker-compose do Materiais (com sudo pq docker ps precisa)
    print("=" * 60)
    print("1. docker-compose.yml do Materiais (sudo)")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} cat /opt/convex/docker-compose.yml")
    print(out)
    print()

    # 2. Materiais docker ps
    print("=" * 60)
    print("2. Materiais containers")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} docker ps -a --format 'table {{{{.Names}}}}\\t{{{{.Status}}}}\\t{{{{.Ports}}}}'")
    print(out)
    print()

    # 3. Cache do npx - tem convex CLI?
    print("=" * 60)
    print("3. Cache npx convex CLI no servidor")
    print("=" * 60)
    out, _ = run(ssh, "ls -la /home/pm/.npm/_npx/89c650e61e38ed13/node_modules/.bin/ 2>&1 | head -20")
    print(out)
    print()

    # 4. /mnt/convex-data
    print("=" * 60)
    print("4. /mnt/convex-data/")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} ls -la /mnt/convex-data/ 2>&1 | head -30")
    print(out)
    print()

    # 5. Endpoints HTTP do Convex
    print("=" * 60)
    print("5. Testa endpoints do Convex (localhost:3212 - viaturas)")
    print("=" * 60)
    for ep in ['/', '/version', '/api/ping', '/api/version', '/api/deploy2', '/api/functions', '/api/push', '/api/codegen', '/api/admin', '/api/import']:
        cmd = f"curl -s -o /dev/null -w '%{{http_code}}' http://localhost:3212{ep}"
        out, _ = run(ssh, cmd, timeout=10)
        print(f"  {ep:25} -> {out}")
    print()

    # 6. Materiais: como tá o schema deployado? Tenta GET na api
    print("=" * 60)
    print("6. Materiais: schema.json ou similar")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} find /mnt/convex-data -maxdepth 3 -name '*.json' 2>/dev/null | head -10")
    print(out)
    out, _ = run(ssh, f"{SUDO} ls /mnt/convex-data/modules/ 2>/dev/null | head -10")
    print(out)

    # 7. auth_api.py: como o Materiais autentica
    print("=" * 60)
    print("7. Materiais convex auth_api.py (sudo)")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} cat /opt/convex/auth_api.py 2>/dev/null | head -80")
    print(out if out else "(vazio)")

    ssh.close()

if __name__ == "__main__":
    main()
