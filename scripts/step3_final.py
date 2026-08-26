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

# 1. Upload docker-compose corrigido
print("=== Upload docker-compose corrigido (DISABLE_BEACON) ===")
sftp = ssh.open_sftp()
sftp.put("D:/USER/DESKTOPP/excel/viaturas/server-config/docker-compose-viaturas.yml",
         "/opt/convex-viaturas/docker-compose-viaturas.yml")
print("  OK")

# 2. Reiniciar container
print("\n=== Recriar container com DISABLE_BEACON ===")
run(f"{SUDO} /usr/bin/docker compose -f /opt/convex-viaturas/docker-compose-viaturas.yml up -d 2>&1 | tail -10", timeout=120)
time.sleep(10)

# 3. Limpar _generated e tentar de novo
print("\n=== Limpar e tentar deploy ===")
run(f"{SUDO} rm -rf /opt/convex-viaturas/convex/_generated", timeout=15)

# 4. Tentar convex dev --once (com input redirecionado pra evitar prompt)
print("\n=== Convex dev --once (com input yes) ===")
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && (echo \"\"; sleep 2) | ./node_modules/.bin/convex dev --once --configure new --team local --project viaturas --env-file .env.local 2>&1' | head -30", timeout=180)

# 5. Verificar
print("\n=== _generated/ ===")
run(f"{SUDO} ls -la /opt/convex-viaturas/convex/_generated/ 2>&1 | head -10", timeout=15)
run(f"{SUDO} ls -la /opt/convex-viaturas/convex/ 2>&1 | head -25", timeout=15)

# 6. Logs
print("\n=== Logs backend (verificar se beacon parou) ===")
out, _ = run(f"{SUDO} /usr/bin/docker logs convex-backend-viaturas --tail 10 2>&1", timeout=15)

# 7. Health checks finais
print("\n=== Health checks ===")
run("curl -sS -o /dev/null -w 'nginx :8081: %{http_code}\\n' --max-time 5 http://localhost:8081/health")
run("curl -sS -o /dev/null -w 'auth-api :8002: %{http_code}\\n' --max-time 5 http://localhost:8002/api/health")
run("curl -sS -o /dev/null -w 'convex :3212: %{http_code}\\n' --max-time 5 http://localhost:3212/version")

ssh.close()
