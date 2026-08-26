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

# 1. Help do convex deploy
print("=== convex deploy --help ===")
run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 ./node_modules/.bin/convex deploy --help 2>&1' | head -50", timeout=30)

# 2. Help do convex dev
print("\n=== convex dev --help ===")
run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 ./node_modules/.bin/convex dev --help 2>&1' | head -50", timeout=30)

# 3. Tentar passar input via stdin (yes pra "login?")
print("\n=== Convex dev com input redirecionado (yes) ===")
run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && echo -e \"n\\n\" | CONVEX_URL=http://localhost:3212 CONVEX_DEPLOY_KEY=viaturas-cpi7-2026-secret-key-32-chars-min-aaaa ./node_modules/.bin/convex dev --once 2>&1' | head -30", timeout=120)

# 4. Tentar com '2>&1' redirecionado
print("\n=== Convex dev com input via '2<' ===")
run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 CONVEX_DEPLOY_KEY=viaturas-cpi7-2026-secret-key-32-chars-min-aaaa ./node_modules/.bin/convex dev --once < /dev/null 2>&1' | head -20", timeout=60)

# 5. Tentar com 'Convex self hosted' direto
print("\n=== Procurar flag de self-hosted ===")
run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 ./node_modules/.bin/convex dev --help 2>&1' | grep -i 'self\\|hosted\\|local\\|skip' | head -10", timeout=30)

ssh.close()
