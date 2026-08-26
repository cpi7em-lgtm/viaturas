import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655', timeout=30)

def run(cmd, timeout=30):
    print(f"\n>>> {cmd[:200]}")
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    out = so.read().decode(errors='replace')
    err = se.read().decode(errors='replace')
    print(out, end='' if out.endswith('\n') else '\n')
    if err: print(f"STDERR: {err}", file=sys.stderr)
    return out, err

SUDO = 'SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A'

# 1. Compacta node_modules no Windows
import subprocess
print("=== Compactando node_modules do convex ===")
zip_path = "D:/USER/DESKTOPP/excel/viaturas/convex/convex-node_modules.tar.gz"
result = subprocess.run(
    ['tar', '-czf', zip_path,
     '-C', 'D:/USER/DESKTOPP/excel/viaturas/convex',
     'node_modules', 'package.json', 'package-lock.json'],
    capture_output=True, text=True
)
print(f"  returncode: {result.returncode}")
print(f"  stdout: {result.stdout}")
print(f"  stderr: {result.stderr[:500]}")
import os
if os.path.exists(zip_path):
    print(f"  ZIP criado: {os.path.getsize(zip_path)} bytes")
else:
    print("  ERRO: ZIP não criado")
    sys.exit(1)

# 2. Upload pro server
print("\n=== Upload pro /tmp ===")
sftp = ssh.open_sftp()
remote_zip = "/tmp/convex-node_modules.tar.gz"
sftp.put(zip_path, remote_zip)
print(f"  OK: {zip_path} -> {remote_zip}")

# 3. Descompacta no /opt/convex-viaturas/convex
print("\n=== Descompactar no /opt/convex-viaturas/convex ===")
run(f"{SUDO} mkdir -p /opt/convex-viaturas/convex", timeout=15)
out, err, ec = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && tar -xzf /tmp/convex-node_modules.tar.gz && echo OK'", timeout=60)
print(f"  exit: {ec}")

# 4. Validar
print("\n=== Validar ===")
run(f"{SUDO} ls /opt/convex-viaturas/convex/node_modules/ 2>&1 | head -10", timeout=15)
run(f"{SUDO} ls /opt/convex-viaturas/convex/node_modules/.bin/ 2>&1 | grep convex", timeout=15)
run(f"{SUDO} /opt/convex-viaturas/convex/node_modules/.bin/convex --version 2>&1 | head -3", timeout=30)

ssh.close()
