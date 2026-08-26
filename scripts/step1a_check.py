import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655', timeout=30)

def run(cmd, timeout=60):
    print(f"\n>>> {cmd}")
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    out = so.read().decode(errors='replace')
    err = se.read().decode(errors='replace')
    print(out, end='' if out.endswith('\n') else '\n')
    if err: print(f"STDERR: {err}", file=sys.stderr)
    return out, err

SUDO = 'SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A'

# 1. Verificar node/npm
print("=" * 50)
print("VERIFICAR NODE/NPM")
print("=" * 50)
run("which node npm npx 2>&1")
run("node --version 2>&1")
run("npm --version 2>&1")
run(f"{SUDO} npx --version 2>&1 | head -3")
run("ls -la /usr/lib/node_modules/ 2>&1 | head -10")

ssh.close()
