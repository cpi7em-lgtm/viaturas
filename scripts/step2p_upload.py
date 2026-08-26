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

# 1. Upload todos os arquivos
print("=" * 60)
print("STEP 1: Upload arquivos de config")
print("=" * 60)
sftp = ssh.open_sftp()

# Estrutura local -> remoto
files_to_upload = [
    # server-config/
    ("D:/USER/DESKTOPP/excel/viaturas/server-config/docker-compose-viaturas.yml",
     "/opt/convex-viaturas/docker-compose-viaturas.yml"),
    ("D:/USER/DESKTOPP/excel/viaturas/server-config/nginx-viaturas.conf",
     "/opt/convex-viaturas/nginx.conf"),
    ("D:/USER/DESKTOPP/excel/viaturas/server-config/auth-api/Dockerfile",
     "/opt/convex-viaturas/auth-api/Dockerfile"),
    ("D:/USER/DESKTOPP/excel/viaturas/server-config/auth-api/auth_api_viaturas.py",
     "/opt/convex-viaturas/auth-api/auth_api_viaturas.py"),
    # scripts/
    ("D:/USER/DESKTOPP/excel/viaturas/scripts/seed_units.py",
     "/opt/convex-viaturas/seed_units.py"),
]

# Criar diretorios primeiro
run(f"{SUDO} mkdir -p /opt/convex-viaturas/auth-api /opt/convex-viaturas/data /opt/convex-viaturas/storage /opt/convex-viaturas/dist/assets", timeout=15)

for local, remote in files_to_upload:
    try:
        sftp.put(local, remote)
        print(f"  OK: {os.path.basename(local)} -> {remote}")
    except Exception as e:
        print(f"  FAIL: {local}: {e}")

# 2. Criar convex.json correto (sem aspas escapadas)
print("\n=== convex.json correto ===")
convex_json = '{\n  "functions": "convex/",\n  "authInfo": [],\n  "clientQueryPaths": [],\n  "generatedCodeCommonDirectory": "convex-generated",\n  "node": {\n    "module": "convex/_generated/server.js"\n  }\n}\n'
# Sobe via sftp
with open("D:/USER/DESKTOPP/excel/viaturas/convex/convex.json", "w", encoding='utf-8') as f:
    f.write(convex_json)
sftp.put("D:/USER/DESKTOPP/excel/viaturas/convex/convex.json",
         "/opt/convex-viaturas/convex/convex.json")
run(f"{SUDO} cat /opt/convex-viaturas/convex/convex.json", timeout=15)

# 3. Subir containers
print("\n" + "=" * 60)
print("STEP 2: Subir containers Viaturas")
print("=" * 60)
out, _ = run(f"{SUDO} /usr/bin/docker compose -f /opt/convex-viaturas/docker-compose-viaturas.yml up -d 2>&1 | tail -30", timeout=300)

# 4. Esperar inicializar
print("\nAguardando 30s pros containers...")
time.sleep(30)
out, _ = run(f"{SUDO} /usr/bin/docker ps --format '{{{{.Names}}}}: {{{{.Status}}}} {{{{.Ports}}}}' | grep viaturas || echo 'NAO HA'")

# 5. Validar
print("\n=== Health checks ===")
run("curl -sS -o /dev/null -w 'nginx :8081: %{http_code}\\n' --max-time 5 http://localhost:8081/health")
run("curl -sS -o /dev/null -w 'auth-api :8002: %{http_code}\\n' --max-time 5 http://localhost:8002/api/health")
run("curl -sS -o /dev/null -w 'convex :3212: %{http_code}\\n' --max-time 5 http://localhost:3212/version")

# 6. Logs do convex
print("\n=== Logs convex-backend-viaturas ===")
out, _ = run(f"{SUDO} /usr/bin/docker logs convex-backend-viaturas 2>&1 | tail -20", timeout=15)

ssh.close()
