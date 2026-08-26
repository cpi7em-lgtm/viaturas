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

# 1. Garantir que containers do Viaturas estao rodando
print("=== Containers Viaturas ===")
out, _ = run(f"{SUDO} docker ps --format '{{{{.Names}}}}: {{{{.Status}}}} {{{{.Ports}}}}' | grep viaturas || echo 'NAO HA CONTAINERS'")
if "NAO HA" in out:
    print("\nSubindo containers...")
    run(f"{SUDO} cd /opt/convex-viaturas && /usr/local/bin/docker compose -f docker-compose-viaturas.yml up -d 2>&1 | tail -20", timeout=120)
    time.sleep(10)

# 2. Esperar containers
print("\nAguardando 15s...")
time.sleep(15)
out, _ = run(f"{SUDO} docker ps --format '{{{{.Names}}}}: {{{{.Status}}}}' | grep viaturas", timeout=15)

# 3. Verificar conectividade
out, _ = run(f"curl -sS -o /dev/null -w 'convex :3212: %{{http_code}}\\n' http://localhost:3212/version", timeout=15)
out, _ = run(f"curl -sS -o /dev/null -w 'nginx :8081: %{{http_code}}\\n' http://localhost:8081/health", timeout=15)
out, _ = run(f"curl -sS -o /dev/null -w 'auth-api :8002: %{{http_code}}\\n' http://localhost:8002/api/health", timeout=15)

# 4. Convex deploy com URL local
print("\n=== Convex deploy (self-hosted) ===")
run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 ./node_modules/.bin/convex deploy --yes 2>&1' | head -30", timeout=120)

# 5. Verificar
print("\n=== Arquivos gerados ===")
run(f"{SUDO} ls -la /opt/convex-viaturas/convex/ 2>&1 | head -15")
run(f"{SUDO} cat /opt/convex-viaturas/convex/convex.json 2>&1 | head -10", timeout=15)

ssh.close()
