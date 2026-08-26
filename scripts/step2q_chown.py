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

# 1. Chown /opt/convex-viaturas pro pm
print("=== Chown ===")
run(f"{SUDO} chown -R pm:pm /opt/convex-viaturas && ls -la /opt/convex-viaturas/")

# 2. Upload
print("\n=== Upload arquivos ===")
sftp = ssh.open_sftp()

files_to_upload = [
    ("D:/USER/DESKTOPP/excel/viaturas/server-config/docker-compose-viaturas.yml",
     "/opt/convex-viaturas/docker-compose-viaturas.yml"),
    ("D:/USER/DESKTOPP/excel/viaturas/server-config/nginx-viaturas.conf",
     "/opt/convex-viaturas/nginx.conf"),
    ("D:/USER/DESKTOPP/excel/viaturas/server-config/auth-api/Dockerfile",
     "/opt/convex-viaturas/auth-api/Dockerfile"),
    ("D:/USER/DESKTOPP/excel/viaturas/server-config/auth-api/auth_api_viaturas.py",
     "/opt/convex-viaturas/auth-api/auth_api_viaturas.py"),
    ("D:/USER/DESKTOPP/excel/viaturas/scripts/seed_units.py",
     "/opt/convex-viaturas/seed_units.py"),
    # auth-api precisa da requirements (criar arquivo)
]

for local, remote in files_to_upload:
    try:
        sftp.put(local, remote)
        print(f"  OK: {os.path.basename(local)} -> {remote}")
    except Exception as e:
        print(f"  FAIL: {local}: {e}")

# 3. Criar requirements.txt pro auth-api
print("\n=== Cria requirements.txt ===")
reqs = """fastapi==0.110.0
uvicorn[standard]==0.27.1
pydantic==2.6.4
"""
with open("D:/tmp_requirements.txt", "w") as f:
    f.write(reqs)
sftp.put("D:/tmp_requirements.txt", "/opt/convex-viaturas/auth-api/requirements.txt")
os.remove("D:/tmp_requirements.txt")
print("  OK: requirements.txt criado")

# 4. Ajustar Dockerfile pra usar requirements.txt
dockerfile = """FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8082

CMD ["uvicorn", "auth_api_viaturas:app", "--host", "0.0.0.0", "--port", "8082"]
"""
with open("D:/tmp_dockerfile", "w") as f:
    f.write(dockerfile)
sftp.put("D:/tmp_dockerfile", "/opt/convex-viaturas/auth-api/Dockerfile")
os.remove("D:/tmp_dockerfile")
print("  OK: Dockerfile atualizado")

# 5. Subir containers
print("\n=== Subir containers ===")
out, _ = run(f"{SUDO} /usr/bin/docker compose -f /opt/convex-viaturas/docker-compose-viaturas.yml up -d 2>&1 | tail -30", timeout=300)

# 6. Esperar 30s
print("\nAguardando 30s...")
time.sleep(30)
out, _ = run(f"{SUDO} /usr/bin/docker ps --format '{{{{.Names}}}}: {{{{.Status}}}}' | grep viaturas || echo 'NAO HA'")

# 7. Validar
print("\n=== Health checks ===")
run("curl -sS -o /dev/null -w 'nginx :8081: %{http_code}\\n' --max-time 5 http://localhost:8081/health")
run("curl -sS -o /dev/null -w 'auth-api :8002: %{http_code}\\n' --max-time 5 http://localhost:8002/api/health")
run("curl -sS -o /dev/null -w 'convex :3212: %{http_code}\\n' --max-time 5 http://localhost:3212/version")

ssh.close()
