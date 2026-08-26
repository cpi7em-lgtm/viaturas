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

# Tentar com --headless
print("=== Convex deploy --headless ===")
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 CONVEX_DEPLOY_KEY=viaturas-cpi7-2026-secret-key-32-chars-min-aaaa ./node_modules/.bin/convex deploy --headless 2>&1' | head -30", timeout=120)

# Tentar com "expect" - resposta automatica pro prompt
print("\n=== Convex com input yes + enter ===")
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && yes | CONVEX_URL=http://localhost:3212 CONVEX_DEPLOY_KEY=viaturas-cpi7-2026-secret-key-32-chars-min-aaaa ./node_modules/.bin/convex dev --once 2>&1' | head -30", timeout=60)

# Tentar passando key via flag
print("\n=== Tentar com --admin-key ===")
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 ./node_modules/.bin/convex deploy --admin-key viaturas-cpi7-2026-secret-key-32-chars-min-aaaa --yes 2>&1' | head -20", timeout=60)

# Tentar usar ssh com tty
print("\n=== Tentar com ssh -t (TTY) ===")
run(f"{SUDO} ssh -t pm@localhost 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 CONVEX_DEPLOY_KEY=viaturas-cpi7-2026-secret-key-32-chars-min-aaaa ./node_modules/.bin/convex dev --once 2>&1' | head -30", timeout=120)

ssh.close()
