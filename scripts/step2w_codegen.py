import paramiko
import sys
import time
import os
import urllib.request
import json

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

# 1. Tentar convex codegen (so gera types, sem deploy)
print("=== convex codegen ===")
run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 ./node_modules/.bin/convex codegen 2>&1' | head -20", timeout=60)

# 2. Tentar com stdin vazio (evita prompt)
print("\n=== Convex dev com stdin redirecionado ===")
run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 CONVEX_DEPLOY_KEY=viaturas-cpi7-2026-secret-key-32-chars-min-aaaa echo | ./node_modules/.bin/convex dev --once --admin-key viaturas-cpi7-2026-secret-key-32-chars-min-aaaa 2>&1' | head -30", timeout=180)

# 3. Verificar
print("\n=== _generated/ ===")
run(f"{SUDO} ls /opt/convex-viaturas/convex/_generated/ 2>&1 | head -5", timeout=15)
run(f"{SUDO} ls -la /opt/convex-viaturas/convex/ 2>&1 | head -20", timeout=15)

# 4. Tentar via curl direto
print("\n=== API direta do Convex ===")
out, _ = run("curl -sS -o /dev/null -w 'version: %{http_code}\\n' http://localhost:3212/api/version", timeout=10)
out, _ = run("curl -sS http://localhost:3212/api/version 2>&1 | head -5", timeout=10)

# 5. Ver dashboard do Convex
out, _ = run("curl -sS -o /dev/null -w 'dashboard: %{http_code}\\n' http://localhost:3212/dashboard", timeout=10)

# 6. Ver logs do convex-backend
print("\n=== Logs convex-backend ===")
run(f"{SUDO} /usr/bin/docker logs convex-backend-viaturas --tail 30 2>&1", timeout=15)

ssh.close()
