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

# 1. Verificar se convex já ta instalado em algum lugar
print("=== Procurar convex CLI ===")
run("which convex 2>&1")
run("find / -name 'convex' -type f 2>/dev/null | grep -v proc | head -10")
run(f"{SUDO} find / -name 'convex' -type f 2>/dev/null | grep -v proc | head -10")

# 2. Verificar se tem npm cache (install previa)
print("\n=== npm cache ===")
run("ls -la ~/.npm/ 2>&1 | head -5")
run(f"{SUDO} ls -la ~/.npm/ 2>&1 | head -5")

# 3. Tentar ativar enp5s0 pra ter internet
print("\n=== Verificar enp5s0 ===")
run(f"{SUDO} ip link show enp5s0 2>&1 | head -5")
run("ip route 2>&1 | head -10")

# 4. Verificar ping pra registry.npmjs.org
print("\n=== Teste de internet ===")
run(f"{SUDO} timeout 5 ping -c 2 8.8.8.8 2>&1 | tail -3")
run(f"{SUDO} timeout 5 ping -c 2 registry.npmjs.org 2>&1 | tail -3")
run(f"{SUDO} timeout 5 nslookup registry.npmjs.org 2>&1 | tail -3")

# 5. Tentar npm install com timeout maior
print("\n=== Tentando npm install convex (1min) ===")
run(f"{SUDO} timeout 60 npm install -g convex --no-audit --no-fund --silent 2>&1 | tail -10", timeout=90)

# 6. Verificar se instalou
run("which convex 2>&1; npx convex --version 2>&1 | head -3")

ssh.close()
