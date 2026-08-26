import paramiko
import sys
import time

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

# 1. Matar processos travados
print("=== Matando processos npm travados ===")
run(f"{SUDO} pkill -9 -f 'npm install' 2>&1; pkill -9 node 2>&1; sleep 2; ps aux | grep -E '(npm|node)' | grep -v grep | wc -l")

# 2. Verificar conectividade (sanity check)
print("\n=== Conectividade ===")
run("timeout 5 ping -c 2 registry.npmjs.org 2>&1 | tail -3")
run("curl -sS -o /dev/null -w 'registry.npmjs.org: %{http_code}\\n' --max-time 5 https://registry.npmjs.org/ 2>&1")

# 3. Instalar LOCALMENTE no projeto convex (mais leve)
print("\n=== Instalar convex LOCALMENTE no projeto ===")
# Primeiro garantir que o /opt/convex-viaturas/convex/ tem o package.json
run(f"{SUDO} ls -la /opt/convex-viaturas/convex/ 2>&1 | head -10")

# Upload do package.json
sftp = ssh.open_sftp()
sftp.put("D:/USER/DESKTOPP/excel/viaturas/convex/package.json",
         "/opt/convex-viaturas/convex/package.json")
print("  Upload package.json OK")
sftp.close()

# npm install local (sem -g)
print("\n  Rodando npm install local (mais leve)...")
run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && nohup npm install --no-audit --no-fund > /tmp/npm-local.log 2>&1 &' && sleep 2", timeout=15)

# 4. Aguardar  até 4 min
print("\n  Aguardando  até 4min...")
for i in range(24):
    time.sleep(10)
    out, _ = run("ps aux | grep 'npm install' | grep -v grep | wc -l", timeout=10)
    if int(out.strip()) == 0:
        print(f"\n  [{(i+1)*10}s] CONCLUIDO!")
        break
    if i % 3 == 0:
        print(f"  [{(i+1)*10}s] rodando...")

# 5. Verificar
print("\n=== Verificar ===")
run("cat /tmp/npm-local.log 2>&1 | tail -20")
run(f"{SUDO} ls /opt/convex-viaturas/convex/node_modules/convex 2>&1 | head -5")
run("cd /opt/convex-viaturas/convex && ls node_modules/.bin/ 2>&1 | grep convex")

ssh.close()
