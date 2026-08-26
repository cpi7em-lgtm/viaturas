import paramiko
import sys
import time
import os

# Set stdout encoding to UTF-8 to handle special chars
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
    if err and 'X' in err[:50]: pass  # skip common errors
    if err and 'cp1252' not in err: print(f"STDERR: {err}", file=sys.stderr)
    return out, err

SUDO = 'SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A'

# 1. Subir containers do Viaturas (docker esta em /usr/bin/docker)
print("=" * 60)
print("STEP 1: Subir containers Viaturas")
print("=" * 60)
run(f"{SUDO} /usr/bin/docker compose -f /opt/convex-viaturas/docker-compose-viaturas.yml up -d 2>&1 | tail -20", timeout=120)

print("\nAguardando 20s...")
time.sleep(20)
run(f"{SUDO} /usr/bin/docker ps --format '{{{{.Names}}}}: {{{{.Status}}}} {{{{.Ports}}}}' | grep viaturas || echo 'NAO HA'")

# 2. Health checks
print("\n=== Health checks ===")
run("curl -sS -o /dev/null -w 'nginx :8081: %{http_code}\\n' http://localhost:8081/health")
run("curl -sS -o /dev/null -w 'auth-api :8002: %{http_code}\\n' http://localhost:8002/api/health")
run("curl -sS -o /dev/null -w 'convex :3212: %{http_code}\\n' http://localhost:3212/version")

# 3. Configurar convex.json corretamente
print("\n=== Setup convex.json (corrigido) ===")
convex_json = '{"functions": "convex/", "authInfo": [], "clientQueryPaths": [], "generatedCodeCommonDirectory": "convex-generated", "node": {"module": "convex/_generated/server.js"}}'
run(f"{SUDO} bash -c \"echo '{convex_json}' > /opt/convex-viaturas/convex/convex.json && cat /opt/convex-viaturas/convex/convex.json\"")

# 4. Rodar convex dev --once
print("\n=== Convex dev --once (gera schema) ===")
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 CONVEX_DEPLOY_KEY=viaturas-cpi7-2026-secret-key-32-chars-min-aaaa ./node_modules/.bin/convex dev --once 2>&1 | head -30'", timeout=180)

# 5. Verificar arquivos gerados
print("\n=== Verificar ===")
run(f"{SUDO} ls -la /opt/convex-viaturas/convex/ | head -25")
run(f"{SUDO} ls /opt/convex-viaturas/convex/_generated/ 2>&1 | head -5")

ssh.close()
