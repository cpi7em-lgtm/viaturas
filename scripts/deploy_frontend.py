#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Deploy do frontend bundle pro servidor"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import os

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

LOCAL_DIST = r"D:\USER\DESKTOPP\excel\viaturas\frontend\dist"
REMOTE_DIST_PARENT = "/opt/convex-viaturas"  # /opt/convex-viaturas/dist/ (montado no nginx)

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def put_dir(sftp, local_dir, remote_dir):
    """Sobe um diretório recursivamente"""
    if not os.path.isdir(local_dir):
        raise FileNotFoundError(f"Dir não existe: {local_dir}")
    try:
        sftp.mkdir(remote_dir)
    except OSError:
        pass  # já existe
    for entry in os.listdir(local_dir):
        local_path = os.path.join(local_dir, entry)
        remote_path = f"{remote_dir}/{entry}"
        if os.path.isfile(local_path):
            sftp.put(local_path, remote_path)
            print(f"  FILE {entry} ({os.path.getsize(local_path)} bytes)")
        elif os.path.isdir(local_path):
            put_dir(sftp, local_path, remote_path)

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Limpa /opt/convex-viaturas/dist/ (sudo)
    print("=" * 60)
    print("1. Limpa dist antigo")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} rm -rf /opt/convex-viaturas/dist 2>&1")
    print(out or "(ok)")
    out, _ = run(ssh, f"{SUDO} mkdir -p /opt/convex-viaturas/dist /opt/convex-viaturas/dist/assets 2>&1")
    print(out or "(ok)")
    out, _ = run(ssh, f"{SUDO} chown -R pm:pm /opt/convex-viaturas/dist 2>&1")
    print(out or "(ok)")
    print()

    # 2. SCP do dist
    print("=" * 60)
    print("2. Sobe dist/")
    print("=" * 60)
    sftp = ssh.open_sftp()
    put_dir(sftp, LOCAL_DIST, REMOTE_DIST_PARENT + "/dist")
    sftp.close()
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/dist/ /opt/convex-viaturas/dist/assets/ 2>&1")
    print(out)
    print()

    # 3. Ajusta permissoes pro nginx (uid 21)
    print("=" * 60)
    print("3. Ajusta permissoes pro nginx (uid 21)")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} chmod -R a+r /opt/convex-viaturas/dist 2>&1")
    print(out or "(ok)")
    print()

    # 4. Testa HTTP
    print("=" * 60)
    print("4. Testa HTTP")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -o /dev/null -w 'GET /: %{http_code} (%{size_download} bytes)\\n' http://localhost:8081/ 2>&1")
    print(out)
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/dist/assets/ 2>&1 | head")
    print(out)
    # Pega o nome do bundle
    bundle = None
    si, so, se = ssh.exec_command("ls /opt/convex-viaturas/dist/assets/index-*.js 2>/dev/null | head -1 | xargs basename")
    bundle = so.read().decode(errors='replace').strip()
    if bundle:
        out, _ = run(ssh, f"curl -s -o /dev/null -w 'GET /assets/{bundle}: %{{http_code}} (%{{size_download}} bytes)\\n' http://localhost:8081/assets/{bundle}")
        print(out)
    print()

    # 5. Testa API (login William)
    print("=" * 60)
    print("5. Testa /api/auth/login")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:8081/api/auth/login -H 'Content-Type: application/json' -d '{\"cpf\":\"26034202833\",\"senha\":\"teste123\"}' 2>&1 | head -10")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
