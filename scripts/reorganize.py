#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Reorganizar estrutura igual Materiais e fazer deploy"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import re
import time

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

def run(ssh, cmd, timeout=60, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def run_capture(ssh, cmd, timeout=300, get_pty=True):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    output_chunks = []
    start = time.time()
    try:
        while True:
            if so.channel.recv_ready():
                chunk = so.channel.recv(4096).decode(errors='replace')
                output_chunks.append(chunk)
            elif so.channel.exit_status_ready():
                break
            else:
                time.sleep(0.5)
                if time.time() - start > timeout:
                    so.channel.close()
                    break
    except Exception as e:
        output_chunks.append(f"\n[ERRO] {e}")
    return "".join(output_chunks), so.channel.recv_exit_status() if so.channel.exit_status_ready() else None

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 0. Pega admin key atual
    out, _ = run(ssh, "cat /opt/convex-viaturas/convex/.env.local")
    m = re.search(r'CONVEX_SELF_HOSTED_ADMIN_KEY="?([^"\n]+)"?', out)
    if not m:
        out, _ = run(ssh, f"{SUDO} docker exec convex-backend-viaturas /convex/generate_admin_key.sh 2>&1")
        m = re.search(r'convex-self-hosted\|[a-f0-9]+', out)
    admin_key = m.group(0) if m else None
    print(f"Admin key: {admin_key[:60] if admin_key else 'FALHA'}...")

    # 1. Para containers antes de mexer
    print()
    print("=" * 60)
    print("1. Para container convex-backend-viaturas")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} docker stop convex-backend-viaturas 2>&1")
    print(out or "(parado)")

    # 2. Reorganiza estrutura
    print()
    print("=" * 60)
    print("2. Reorganiza estrutura")
    print("=" * 60)
    cmds = [
        # Estado atual
        "ls -la /opt/convex-viaturas/ 2>&1 | head",
        # Cria estrutura nova: /opt/convex-viaturas/{convex.json, .env.local, node_modules, convex/}
        # Move: /opt/convex-viaturas/convex/* (exceto .env.local e convex.json) pra /opt/convex-viaturas/convex_temp/
        f"cd /opt/convex-viaturas && mkdir -p convex_backup",
        f"cd /opt/convex-viaturas && mv convex/* convex_backup/ 2>&1 | head; echo '---'",
        f"cd /opt/convex-viaturas && mv convex/.env.local convex_backup/ 2>/dev/null; echo '---'",
        f"cd /opt/convex-viaturas && ls convex_backup/ | head",
        # Remove o dir convex vazio
        f"cd /opt/convex-viaturas && rmdir convex 2>&1; echo '---'",
        # Move os arquivos de volta pra /opt/convex-viaturas/convex/
        f"cd /opt/convex-viaturas && mv convex_backup convex/ && ls -la convex/ | head -20",
        f"cd /opt/convex-viaturas && ls -la | head -20",
    ]
    for c in cmds:
        print(f"$ {c}")
        out, _ = run(ssh, c)
        print(out if out else "(ok)")
        print()

    # 3. Cria /opt/convex-viaturas/convex.json (raiz)
    print("=" * 60)
    print("3. Cria /opt/convex-viaturas/convex.json (raiz)")
    print("=" * 60)
    sftp = ssh.open_sftp()
    with sftp.file('/opt/convex-viaturas/convex.json', 'w') as f:
        f.write('{\n  "functions": "convex/"\n}\n')
    # Move .env.local pra raiz
    sftp.rename('/opt/convex-viaturas/convex/.env.local', '/opt/convex-viaturas/.env.local')
    # Move node_modules pra raiz
    sftp.rename('/opt/convex-viaturas/convex/node_modules', '/opt/convex-viaturas/node_modules')
    sftp.close()
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/ | head -20")
    print(out)
    out, _ = run(ssh, "cat /opt/convex-viaturas/convex.json")
    print(out)
    print()

    # 4. Remove convex.json de dentro do convex/ (era o antigo)
    print("=" * 60)
    print("4. Remove convex.json duplicado em convex/")
    print("=" * 60)
    out, _ = run(ssh, "rm -f /opt/convex-viaturas/convex/convex.json; ls -la /opt/convex-viaturas/convex/ | head -20")
    print(out)
    print()

    # 5. Cria CONVEX_TMPDIR
    print("=" * 60)
    print("5. Cria CONVEX_TMPDIR")
    print("=" * 60)
    out, _ = run(ssh, "mkdir -p /home/pm/.convex-tmp && chmod 700 /home/pm/.convex-tmp && ls -la /home/pm/.convex-tmp")
    print(out)
    print()

    # 6. Religa container
    print("=" * 60)
    print("6. Religa convex-backend-viaturas")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} docker start convex-backend-viaturas 2>&1")
    print(out)
    time.sleep(8)
    out, _ = run(ssh, "curl -s -o /dev/null -w '3212=%{http_code}\n' http://localhost:3212/version")
    print(out)
    print()

    # 7. Tenta deploy AGORA com --yes (igual Materiais)
    print("=" * 60)
    print("7. npx convex deploy --yes (igual Materiais)")
    print("=" * 60)
    # Limpa o _generated antigo
    out, _ = run(ssh, "rm -rf /opt/convex-viaturas/convex/_generated")
    print(f"Limpeza: {out or '(ok)'}")

    deploy_script = f"""#!/bin/bash
cd /opt/convex-viaturas
export CONVEX_TMPDIR=/home/pm/.convex-tmp
./node_modules/.bin/convex deploy --yes --typecheck disable --codegen enable 2>&1
"""
    sftp = ssh.open_sftp()
    with sftp.file('/tmp/deploy_v.sh', 'w') as f:
        f.write(deploy_script)
    sftp.chmod('/tmp/deploy_v.sh', 0o755)
    sftp.close()
    out, ec = run_capture(ssh, "bash /tmp/deploy_v.sh", timeout=240)
    print(out[-4000:])
    print(f"\nExit code: {ec}")
    print()

    # 8. function-spec
    print("=" * 60)
    print("8. convex function-spec")
    print("=" * 60)
    out, _ = run(ssh, "cd /opt/convex-viaturas && ./node_modules/.bin/convex function-spec 2>&1 | head -30")
    print(out)
    print()

    # 9. Testa API
    print("=" * 60)
    print("9. Testa units:list")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"units/list\",\"args\":{}}' 2>&1")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
