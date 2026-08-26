import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655', timeout=30)

def run(cmd):
    si, so, se = ssh.exec_command(cmd, timeout=30)
    return so.read().decode(errors='replace'), se.read().decode(errors='replace')

SUDO = 'SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A'

print('=== containers rodando ===')
out, _ = run(f"{SUDO} docker ps --format '{{{{.Names}}}}: {{{{.Status}}}} {{{{.Ports}}}}'")
print(out or '(nenhum)')

print('--- testes ---')
out, _ = run('curl -sS -o /dev/null -w "nginx-host: %{http_code}\n" http://localhost:8081/ 2>&1')
print(out, end='')
out, _ = run('curl -sS -o /dev/null -w "auth-api: %{http_code}\n" http://localhost:8002/api/health 2>&1')
print(out, end='')
out, _ = run('curl -sS -o /dev/null -w "convex-internal: %{http_code}\n" http://convex-backend-viaturas:3210/version 2>&1')
print(out, end='')
out, _ = run('curl -sS -o /dev/null -w "convex-host (3212): %{http_code}\n" http://localhost:3212/version 2>&1')
print(out, end='')

print()
print('=== /opt/convex-viaturas/ ===')
out, _ = run(f"{SUDO} ls -la /opt/convex-viaturas/")
print(out)

print('=== /tmp/viaturas-setup/ ===')
out, _ = run(f"{SUDO} ls -la /tmp/viaturas-setup/ 2>&1 | head -20")
print(out)

# Verificar se convex CLI ta instalado
print('=== npx convex ===')
out, _ = run('which npx 2>&1; npx convex --version 2>&1 | head -3')
print(out)

ssh.close()
