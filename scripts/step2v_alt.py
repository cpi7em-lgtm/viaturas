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

# 1. Listar containers pra ver nome correto do nginx
print("=== Containers (nomes completos) ===")
out, _ = run(f"{SUDO} /usr/bin/docker ps --format '{{{{.Names}}}}: {{{{.Image}}}}'", timeout=15)

# 2. Restart nginx pelo nome correto
print("\n=== Restart nginx ===")
# Pega o nome do container nginx
out, _ = run(f"{SUDO} /usr/bin/docker ps --format '{{{{.Names}}}}' | grep nginx", timeout=15)
nginx_name = out.strip().split('\n')[0] if out.strip() else "convex-nginx-viaturas"
print(f"  nginx container: {nginx_name}")
run(f"{SUDO} /usr/bin/docker restart {nginx_name}", timeout=30)
time.sleep(5)
run(f"curl -sS -o /dev/null -w 'nginx :8081: %{{http_code}}\\n' http://localhost:8081/health", timeout=10)

# 3. Verificar opções do convex CLI
print("\n=== Convex CLI help ===")
run(f"{SUDO} /usr/bin/docker exec -i convex-backend-viaturas /app/dashboard 2>&1 | head -3", timeout=10)
# Tenta pegar help
run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 ./node_modules/.bin/convex --help 2>&1' | head -30", timeout=30)

# 4. Tentar deploy com admin key direto (skip login)
print("\n=== Tentar bypass login via env ===")
run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 CONVEX_DEPLOY_KEY=viaturas-cpi7-2026-secret-key-32-chars-min-aaaa ./node_modules/.bin/convex deploy --url http://localhost:3212 --admin-key viaturas-cpi7-2026-secret-key-32-chars-min-aaaa --yes 2>&1' | head -20", timeout=180)

# 5. Se não funcionar, tentar via HTTP direto (API do Convex)
print("\n=== Tentar via API HTTP direta ===")
# Convex backend tem endpoint /api/deploy2 que recebe arquivos TS
# Vou ver quais endpoints tem
run("curl -sS http://localhost:3212/api/version 2>&1 | head -3", timeout=10)

ssh.close()
