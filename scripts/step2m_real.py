import paramiko
import sys
import time

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

# 1. Verificar se arquivos de config estao no /opt
print("=== /opt/convex-viaturas/ ===")
out, _ = run(f"{SUDO} ls -la /opt/convex-viaturas/", timeout=15)
print(out)

# 2. Subir containers via docker compose (sem cd)
print("\n=== Subir containers ===")
out, _ = run(f"{SUDO} /usr/local/bin/docker compose -f /opt/convex-viaturas/docker-compose-viaturas.yml up -d 2>&1 | tail -20", timeout=120)
print(out)

# 3. Esperar 15s
print("\nAguardando 20s...")
time.sleep(20)
out, _ = run(f"{SUDO} /usr/local/bin/docker ps --format '{{{{.Names}}}}: {{{{.Status}}}} {{{{.Ports}}}}' | grep viaturas || echo 'NAO HA'")

# 4. Testar conectividade
print("\n--- Health checks ---")
run("curl -sS -o /dev/null -w 'nginx :8081: %{http_code}\\n' http://localhost:8081/health")
run("curl -sS -o /dev/null -w 'auth-api :8002: %{http_code}\\n' http://localhost:8002/api/health")
run("curl -sS -o /dev/null -w 'convex :3212: %{http_code}\\n' http://localhost:3212/version")

# 5. Convex dev --once (gera schema, não deploy cloud)
print("\n=== Convex dev --once ===")
run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 ./node_modules/.bin/convex dev --once 2>&1'", timeout=180)

# 6. Verificar
print("\n=== Resultado ===")
run(f"{SUDO} ls -la /opt/convex-viaturas/convex/ | head -20")
run(f"{SUDO} cat /opt/convex-viaturas/convex/convex.json 2>&1 | head -20")

ssh.close()
