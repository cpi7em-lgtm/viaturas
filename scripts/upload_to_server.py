#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Upload inicial: empacota todos os arquivos necessarios pro server num ZIP
e faz upload via SCP (paramiko).
"""
import paramiko
import sys
import io
import zipfile
import tempfile
import os
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

BASE = Path("D:/USER/DESKTOPP/excel/viaturas")

# O que empacotar (relativo a BASE)
ARQUIVOS = [
    # server-config
    ("server-config/auth-api/Dockerfile", "auth-api/Dockerfile"),
    ("server-config/auth-api/auth_api_viaturas.py", "auth-api/auth_api_viaturas.py"),
    ("server-config/docker-compose-viaturas.yml", "docker-compose-viaturas.yml"),
    ("server-config/nginx-viaturas.conf", "nginx-viaturas.conf"),
    ("server-config/setup-viaturas.sh", "setup-viaturas.sh"),

    # convex
    ("convex/schema.ts", "convex/schema.ts"),
    ("convex/_helpers.ts", "convex/_helpers.ts"),
    ("convex/pm_auth.ts", "convex/pm_auth.ts"),
    ("convex/agendamentos.ts", "convex/agendamentos.ts"),
    ("convex/viaturas.ts", "convex/viaturas.ts"),
    ("convex/dashboard.ts", "convex/dashboard.ts"),
    ("convex/units.ts", "convex/units.ts"),
    ("convex/package.json", "convex/package.json"),
    ("convex/tsconfig.json", "convex/tsconfig.json"),

    # scripts
    ("scripts/seed_units.py", "seed_units.py"),

    # docs
    ("docs/SETUP-SERVER.md", "docs/SETUP-SERVER.md"),
]


def main():
    print("Empacotando arquivos...")
    with tempfile.NamedTemporaryFile(suffix=".zip", delete=False) as tmp:
        zip_path = tmp.name

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for local_rel, zip_rel in ARQUIVOS:
            local = BASE / local_rel
            if not local.exists():
                print(f"  WARN: {local_rel} não existe, pulando")
                continue
            zf.write(local, zip_rel)
            print(f"  + {zip_rel}")

    size = os.path.getsize(zip_path)
    print(f"\nZIP criado: {zip_path} ({size} bytes)")

    print("\nConectando SSH...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)
    sftp = ssh.open_sftp()
    print("OK conectado")

    # Upload ZIP pro /tmp do server
    remote_zip = "/tmp/viaturas-setup.zip"
    print(f"\nUpload {zip_path} -> {remote_zip}...")
    sftp.put(zip_path, remote_zip)
    print("OK uploaded")

    # Descompacta no server
    print("\nDescompactando no /tmp/viaturas-setup/ ...")
    sftp = ssh.open_sftp()
    try:
        sftp.stat("/tmp/viaturas-setup")
        # Já existe, limpa
        sftp_execute(ssh, f"rm -rf /tmp/viaturas-setup")
    except IOError:
        pass
    sftp_execute(ssh, f"mkdir -p /tmp/viaturas-setup")
    sftp_execute(ssh, f"cd /tmp/viaturas-setup && unzip -o /tmp/viaturas-setup.zip")
    out, _, _ = sftp_execute(ssh, f"ls -la /tmp/viaturas-setup/ /tmp/viaturas-setup/auth-api/ /tmp/viaturas-setup/convex/")
    print(out)

    # Limpa /tmp
    sftp.remove(remote_zip)
    sftp.close()
    ssh.close()

    # Limpa local
    os.unlink(zip_path)

    print("\nUPLOAD CONCLUIDO!")
    print("Proximos passos:")
    print("  1. SSH no server: ssh pm@10.36.177.138")
    print("  2. Rode: cd /tmp/viaturas-setup && ./setup-viaturas.sh")
    print("  3. Veja docs/SETUP-SERVER.md pra instrucoes completas")


def sftp_execute(ssh, cmd, timeout=60):
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    return so.read().decode(errors='replace'), se.read().decode(errors='replace'), so.channel.recv_exit_status()


if __name__ == "__main__":
    sys.exit(main() or 0)
