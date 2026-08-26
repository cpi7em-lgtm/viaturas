#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Recria nginx container pra remontar dist"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Permissoes
    print("=" * 60)
    print("1. Permissoes no host")
    print("=" * 60)
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/dist/ /opt/convex-viaturas/dist/assets/ 2>&1")
    print(out)
    out, _ = run(ssh, "stat -c '%U %G %a %n' /opt/convex-viaturas/dist/index.html /opt/convex-viaturas/dist/assets/index-BoQfFxBq.js 2>&1")
    print(out)
    print()

    # 2. Restart nginx container (service name é nginx-viaturas, container_name é convex-nginx-viaturas)
    print("=" * 60)
    print("2. Restart nginx container")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} docker restart convex-nginx-viaturas 2>&1", timeout=30)
    print(out)
    time.sleep(5)

    # 3. Verifica
    print("=" * 60)
    print("3. Verifica mount")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} docker exec convex-nginx-viaturas ls -la /usr/share/nginx/html/ 2>&1")
    print(out)
    out, _ = run(ssh, f"{SUDO} docker exec convex-nginx-viaturas ls -la /usr/share/nginx/html/assets/ 2>&1")
    print(out)
    print()

    # 4. Testa HTTP
    print("=" * 60)
    print("4. Testa HTTP")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -o /dev/null -w 'GET /: %{http_code} (%{size_download} bytes)\\n' http://localhost:8081/")
    print(out)
    out, _ = run(ssh, "curl -s -o /dev/null -w 'GET /assets/index-BoQfFxBq.js: %{http_code} (%{size_download} bytes)\\n' http://localhost:8081/assets/index-BoQfFxBq.js")
    print(out)
    out, _ = run(ssh, "curl -s http://localhost:8081/ 2>&1 | head -20")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
