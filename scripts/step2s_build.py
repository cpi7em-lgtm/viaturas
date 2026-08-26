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

# 1. Criar Dockerfile NOVO que usa convex-auth-api como base (cache)
print("=== Novo Dockerfile (base = convex-auth-api do cache) ===")
new_dockerfile = """# Usa a imagem do auth-api do MATERIAIS como base
# (ja tem Python 3.11 + FastAPI + uvicorn instalados)
FROM convex-auth-api:latest

# Copia o código específico do Viaturas
COPY auth_api_viaturas.py /app/auth_api_viaturas.py

EXPOSE 8082

CMD ["uvicorn", "auth_api_viaturas:app", "--host", "0.0.0.0", "--port", "8082"]
"""

with open("D:/tmp_dockerfile2", "w") as f:
    f.write(new_dockerfile)

sftp = ssh.open_sftp()
sftp.put("D:/tmp_dockerfile2", "/opt/convex-viaturas/auth-api/Dockerfile")
os.remove("D:/tmp_dockerfile2")
print("  OK: Dockerfile novo enviado")

# 2. Também enviar o auth_api_viaturas.py (vai estar faltando)
sftp.put("D:/USER/DESKTOPP/excel/viaturas/server-config/auth-api/auth_api_viaturas.py",
         "/opt/convex-viaturas/auth-api/auth_api_viaturas.py")
print("  OK: auth_api_viaturas.py enviado")

# 3. Build da imagem
print("\n=== Build imagem auth-api-viaturas ===")
out, _ = run(f"{SUDO} /usr/bin/docker build -t convex-auth-api-viaturas /opt/convex-viaturas/auth-api/ 2>&1 | tail -20", timeout=300)

# 4. Verificar
out, _ = run(f"{SUDO} /usr/bin/docker images | grep viaturas", timeout=15)

# 5. Subir containers
print("\n=== Subir containers ===")
out, _ = run(f"{SUDO} /usr/bin/docker compose -f /opt/convex-viaturas/docker-compose-viaturas.yml up -d 2>&1 | tail -20", timeout=120)

# 6. Esperar
print("\nAguardando 25s...")
time.sleep(25)
out, _ = run(f"{SUDO} /usr/bin/docker ps --format '{{{{.Names}}}}: {{{{.Status}}}}' | grep viaturas || echo 'NAO HA'")

# 7. Health
print("\n=== Health ===")
run("curl -sS -o /dev/null -w 'nginx :8081: %{http_code}\\n' --max-time 5 http://localhost:8081/health")
run("curl -sS -o /dev/null -w 'auth-api :8002: %{http_code}\\n' --max-time 5 http://localhost:8002/api/health")
run("curl -sS -o /dev/null -w 'convex :3212: %{http_code}\\n' --max-time 5 http://localhost:3212/version")

# 8. Logs
print("\n=== Logs (se houver erro) ===")
out, _ = run(f"{SUDO} /usr/bin/docker logs auth-api-viaturas --tail 20 2>&1", timeout=15)

ssh.close()
