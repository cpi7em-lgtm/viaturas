import paramiko
import sys
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655', timeout=30)

def run(cmd, timeout=120, get_exit=False):
    print(f"\n[CMD] {cmd[:200]}{'...' if len(cmd) > 200 else ''}")
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    out = so.read().decode(errors='replace')
    err = se.read().decode(errors='replace')
    ec = so.channel.recv_exit_status() if hasattr(so.channel, 'recv_exit_status') else None
    if out: print(out, end='' if out.endswith('\n') else '\n')
    if err: print(f"STDERR: {err}", file=sys.stderr)
    if get_exit: print(f"[exit code: {ec}]")
    return out, err, ec

SUDO = 'SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A'

# 1. Instala npm/convex CLI se necessario
print("=" * 60)
print("STEP 1: Instalar Convex CLI")
print("=" * 60)
run(f"{SUDO} npm install -g convex 2>&1 | tail -5", timeout=180)
out, _, _ = run("which npx && npx convex --version 2>&1 | head -3", timeout=30)

# 2. Ajusta o docker-compose (adiciona porta 3212)
print("\n" + "=" * 60)
print("STEP 2: Ajustar docker-compose-viaturas.yml (adicionar porta 3212)")
print("=" * 60)

# Faz upload da versão corrigida
sftp = ssh.open_sftp()
local_dc = "D:/USER/DESKTOPP/excel/viaturas/server-config/docker-compose-viaturas.yml"
remote_dc = "/tmp/viaturas-setup/docker-compose-viaturas.yml"
sftp.put(local_dc, remote_dc)
print(f"Upload {local_dc} -> {remote_dc}")

# 3. Roda o setup-viaturas.sh
print("\n" + "=" * 60)
print("STEP 3: Rodar setup-viaturas.sh")
print("=" * 60)
out, _, ec = run("cd /tmp/viaturas-setup && chmod +x setup-viaturas.sh && ./setup-viaturas.sh 2>&1 | tail -50", timeout=300, get_exit=True)

# 4. Valida
print("\n" + "=" * 60)
print("STEP 4: Validar containers")
print("=" * 60)
out, _, _ = run(f"{SUDO} docker ps --format '{{{{.Names}}}}: {{{{.Status}}}} {{{{.Ports}}}}' | grep -E '(viaturas|convex)' || true")
out, _, _ = run("sleep 3 && curl -sS http://localhost:8081/health 2>&1 || echo FAIL_NGINX")
out, _, _ = run("curl -sS http://localhost:8002/api/health 2>&1 || echo FAIL_AUTH")

ssh.close()
print("\nDONE")
