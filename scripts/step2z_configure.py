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

# 1. Criar arquivo .env com CONVEX_SELF_HOSTED_URL
print("=== Criar .env file ===")
env_content = """CONVEX_SELF_HOSTED_URL=http://localhost:3212
CONVEX_DEPLOY_KEY=viaturas-cpi7-2026-secret-key-32-chars-min-aaaa
"""
with open("D:/tmp_env", "w") as f:
    f.write(env_content)
sftp = ssh.open_sftp()
sftp.put("D:/tmp_env", "/opt/convex-viaturas/convex/.env.local")
os.remove("D:/tmp_env")
run(f"{SUDO} cat /opt/convex-viaturas/convex/.env.local", timeout=15)

# 2. Tentar com --configure local --env-file
print("\n=== Convex dev --configure local --env-file ===")
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && ./node_modules/.bin/convex dev --once --configure local --env-file .env.local 2>&1' | head -30", timeout=180)

# 3. Verificar
print("\n=== _generated/ ===")
run(f"{SUDO} ls /opt/convex-viaturas/convex/_generated/ 2>&1 | head -10", timeout=15)
run(f"{SUDO} ls -la /opt/convex-viaturas/convex/ | head -25", timeout=15)

# 4. Tentar novamente com --team --project
print("\n=== Tentar com --team/--project ===")
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && ./node_modules/.bin/convex dev --once --configure new --team local-viaturas --project viaturas --dev-deployment local --env-file .env.local 2>&1' | head -30", timeout=120)

# 5. Ver logs convex-backend
print("\n=== Logs convex-backend ===")
run(f"{SUDO} /usr/bin/docker logs convex-backend-viaturas --tail 15 2>&1", timeout=15)

ssh.close()
