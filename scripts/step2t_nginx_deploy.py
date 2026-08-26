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

# 1. Log do nginx
print("=== Log do nginx ===")
out, _ = run(f"{SUDO} /usr/bin/docker logs convex-nginx-viaturas --tail 30 2>&1", timeout=15)

# 2. Aguardar 1 min pro Convex inicializar
print("\n=== Aguardando 60s pro Convex inicializar ===")
for i in range(6):
    time.sleep(10)
    out, _ = run("curl -sS -o /dev/null -w 'convex: %{http_code}\\n' --max-time 3 http://localhost:3212/version", timeout=10)
    out2, _ = run("curl -sS -o /dev/null -w 'nginx :8081: %{http_code}\\n' --max-time 3 http://localhost:8081/health", timeout=10)
    if "200" in out or "200" in out2:
        print(f"  [{(i+1)*10}s] Convex/nginx prontos!")
        break

# 3. Convex deploy
print("\n=== Convex deploy (gera schema) ===")
# Primeiro teste sem CONVEX_DEPLOY_KEY (vai dar erro)
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 ./node_modules/.bin/convex dev --once --admin-key viaturas-cpi7-2026-secret-key-32-chars-min-aaaa 2>&1 | head -30'", timeout=180)

# 4. Verificar
print("\n=== Verificar _generated/ ===")
run(f"{SUDO} ls -la /opt/convex-viaturas/convex/ | head -25", timeout=15)
run(f"{SUDO} ls /opt/convex-viaturas/convex/_generated/ 2>&1 | head -10", timeout=15)

# 5. Logs
print("\n=== Logs nginx ===")
out, _ = run(f"{SUDO} /usr/bin/docker logs convex-nginx-viaturas --tail 10 2>&1", timeout=15)

ssh.close()
