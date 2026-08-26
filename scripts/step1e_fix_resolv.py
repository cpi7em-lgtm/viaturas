import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655', timeout=30)

def run(cmd, timeout=60):
    print(f"\n>>> {cmd[:200]}")
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    out = so.read().decode(errors='replace')
    err = se.read().decode(errors='replace')
    print(out, end='' if out.endswith('\n') else '\n')
    if err: print(f"STDERR: {err}", file=sys.stderr)
    return out, err

SUDO = 'SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A'

# 1. Remove o symlink quebrado
print("=== Removendo symlink quebrado ===")
run(f"{SUDO} rm -f /etc/resolv.conf && echo 'removido' || echo 'falha'")
run(f"{SUDO} ls -la /etc/resolv.conf 2>&1 || echo 'nao existe mais (ok)'")

# 2. Cria arquivo real com DNS da PM
print("\n=== Criando /etc/resolv.conf com DNS da PM ===")
run(f"{SUDO} bash -c \"printf 'nameserver 10.61.255.62\\nnameserver 10.61.255.63\\nsearch .\\n' > /etc/resolv.conf\"")
run(f"{SUDO} cat /etc/resolv.conf")
run(f"{SUDO} ls -la /etc/resolv.conf")

# 3. Testa DNS
print("\n=== Testa DNS ===")
run("timeout 5 nslookup registry.npmjs.org 2>&1 | tail -5")
run("timeout 5 ping -c 2 registry.npmjs.org 2>&1 | tail -3")

# 4. Agora tenta instalar convex
print("\n=== npm install -g convex (3min) ===")
run(f"{SUDO} npm install -g convex --no-audit --no-fund 2>&1 | tail -10", timeout=180)

# 5. Verificar instalacao
print("\n=== Verificar ===")
run("which convex 2>&1")
run("npx convex --version 2>&1 | head -3", timeout=30)

ssh.close()
