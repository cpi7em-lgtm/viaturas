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

# 1. Backup do resolv.conf atual
print("=" * 50)
print("FIX DNS (igual SESHAT)")
print("=" * 50)
run(f"{SUDO} cp /etc/resolv.conf /etc/resolv.conf.bak.$(d até +%Y%m%d) 2>&1")
run(f"{SUDO} cat /etc/resolv.conf 2>&1")

# 2. Escreve DNS da PM
print("\n--- Escrevendo DNS da PM (10.61.255.62, 10.61.255.63) ---")
run(f"{SUDO} bash -c \"echo 'nameserver 10.61.255.62' > /etc/resolv.conf && echo 'nameserver 10.61.255.63' >> /etc/resolv.conf && echo 'search .' >> /etc/resolv.conf\"")
run(f"{SUDO} cat /etc/resolv.conf 2>&1")

# 3. Testa DNS
print("\n--- Testa DNS ---")
run(f"{SUDO} timeout 5 nslookup registry.npmjs.org 2>&1 | tail -3")
run(f"{SUDO} timeout 5 ping -c 2 registry.npmjs.org 2>&1 | tail -3")

# 4. Instala convex (agora deve funcionar)
print("\n--- npm install -g convex ---")
run(f"{SUDO} npm install -g convex --no-audit --no-fund 2>&1 | tail -5", timeout=120)
run("which convex 2>&1; npx convex --version 2>&1 | head -3")

ssh.close()
