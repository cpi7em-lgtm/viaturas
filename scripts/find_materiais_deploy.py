#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Achar como Materiais fez deploy do schema convex"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import re

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

def run(ssh, cmd, timeout=60, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Onde o Materiais tem o source convex?
    print("=" * 60)
    print("1. Source do Materiais convex")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} find / -path '/proc' -prune -o -name 'schema.ts' -print 2>/dev/null | grep -v 'node_modules' | head -10")
    print(out)
    out, _ = run(ssh, f"{SUDO} find /opt /home -name 'convex.json' 2>/dev/null | head -10")
    print(out)
    print()

    # 2. Onde o Materiais tem os _generated?
    print("=" * 60)
    print("2. Materiais _generated")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} find / -path '/proc' -prune -o -name '_generated' -type d -print 2>/dev/null | head -10")
    print(out)
    print()

    # 3. Procura scripts de deploy
    print("=" * 60)
    print("3. Scripts de deploy existentes")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} find / -path '/proc' -prune -o -name '*.sh' -print 2>/dev/null | xargs grep -l 'convex\\|deploy\\|convex-backend\\|3210' 2>/dev/null | head -20")
    print(out)
    print()

    # 4. Verifica se tem .env.local no Materiais (onde tava o admin key)
    print("=" * 60)
    print("4. .env.local do Materiais")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} find / -path '/proc' -prune -o -name '.env.local' -print 2>/dev/null | head -10")
    print(out)
    out, _ = run(ssh, f"{SUDO} cat /home/pm/.env.local 2>/dev/null; echo '---'; {SUDO} cat /opt/.env.local 2>/dev/null; echo '---'; {SUDO} cat /root/.env.local 2>/dev/null")
    print(out)
    print()

    # 5. Materiais tem node_modules local?
    print("=" * 60)
    print("5. Materiais: node_modules em /opt ou /home")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} ls /opt/convex-app/ 2>&1; echo '---'; {SUDO} ls /opt/convex-app/convex/ 2>&1; echo '---'; {SUDO} ls /opt/convex-app/convex/node_modules 2>&1 | head")
    print(out)
    print()

    # 6. Docker exec no Materiais convex-backend: listar files
    print("=" * 60)
    print("6. Docker exec no Materiais: listar /convex")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} docker exec convex-backend ls /convex 2>&1 | head -30")
    print(out)
    out, _ = run(ssh, f"{SUDO} docker exec convex-backend cat /convex/admin_key 2>&1 | head -5")
    print(out)
    print()

    # 7. .convex ou arquivos de admin key
    print("=" * 60)
    print("7. Admin key files")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} find / -path '/proc' -prune -o -name '*admin*key*' -print 2>/dev/null | head -10")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
