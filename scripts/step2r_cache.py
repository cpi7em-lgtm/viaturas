import paramiko
import sys
import time
import os

if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655', timeout=30)

def run(cmd, timeout=30):
    print(f"\n>>> {cmd[:200]}")
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    out = so.read().decode(errors='replace')
    err = se.read().decode(errors='replace')
    if out: print(out)
    if err and 'cp1252' not in err: print(f"STDERR: {err}", file=sys.stderr)
    return out, err

SUDO = 'SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A'

# 1. Listar imagens Docker
print("=== Imagens Docker ===")
out, _ = run(f"{SUDO} /usr/bin/docker images", timeout=15)

# 2. Imagens python
print("\n=== Imagens python disponiveis ===")
out, _ = run(f"{SUDO} /usr/bin/docker images | grep python", timeout=15)

# 3. Convex
out, _ = run(f"{SUDO} /usr/bin/docker images | grep convex", timeout=15)

# 4. Nginx
out, _ = run(f"{SUDO} /usr/bin/docker images | grep nginx", timeout=15)

ssh.close()
