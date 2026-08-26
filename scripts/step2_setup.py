import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655', timeout=30)

def run(cmd, timeout=60):
    print(f"\n>>> {cmd[:200]}")
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    out = so.read().decode(errors='replace')
    err = se.read().decode(errors='replace')
    print(out, end='' if out.endswith('\n') else '\n')
    if err: print(f"STDERR: {err}", file=sys.stderr)
    return out, err

SUDO = 'SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A'

# 1. Instalar Convex CLI
print("=" * 60)
print("STEP 2.1: Instalar Convex CLI")
print("=" * 60)
run(f"{SUDO} npm install -g convex --no-audit --no-fund 2>&1 | tail -10", timeout=180)
run("which convex 2>&1; npx convex --version 2>&1 | head -3", timeout=30)

# 2. Upload dos arquivos corrigidos
print("\n" + "=" * 60)
print("STEP 2.2: Upload dos arquivos corrigidos")
print("=" * 60)
sftp = ssh.open_sftp()

# Upload docker-compose corrigido
sftp.put("D:/USER/DESKTOPP/excel/viaturas/server-config/docker-compose-viaturas.yml",
         "/tmp/viaturas-setup/docker-compose-viaturas.yml")
print("  OK: docker-compose-viaturas.yml (com porta 3212)")

# Upload seed_units.py corrigido
sftp.put("D:/USER/DESKTOPP/excel/viaturas/scripts/seed_units.py",
         "/tmp/viaturas-setup/seed_units.py")
print("  OK: seed_units.py (porta 3212)")

sftp.close()

# 3. Rodar setup-viaturas.sh
print("\n" + "=" * 60)
print("STEP 2.3: setup-viaturas.sh")
print("=" * 60)
out, err, ec = run("cd /tmp/viaturas-setup && chmod +x setup-viaturas.sh && ./setup-viaturas.sh 2>&1 | tail -40", timeout=600, get_exit=True)

# 4. Validar
print("\n" + "=" * 60)
print("STEP 2.4: Validar")
print("=" * 60)
out, _, _ = run(f"{SUDO} docker ps --format '{{{{.Names}}}}: {{{{.Status}}}} {{{{.Ports}}}}' | grep -E '(viaturas|nginx-viaturas)' || true")

# Esperar 5s pro container inicializar
import time
time.sleep(5)

print("\n--- Health checks ---")
run("curl -sS -o /dev/null -w 'nginx :8081: %{http_code}\\n' http://localhost:8081/health 2>&1")
run("curl -sS -o /dev/null -w 'auth-api :8002: %{http_code}\\n' http://localhost:8002/api/health 2>&1")
run("curl -sS -o /dev/null -w 'convex :3212: %{http_code}\\n' http://localhost:3212/version 2>&1")

ssh.close()
print("\nDONE STEP 2")
