import paramiko
import sys
import os
import time

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

# 1. Limpar tentativa anterior de login
print("=== Limpar tentativas anteriores ===")
# Remove o convex.json que pode ter info de login
sftp = ssh.open_sftp()
convex_json_correct = '''{
  "functions": "convex/",
  "authInfo": [],
  "clientQueryPaths": [],
  "generatedCodeCommonDirectory": "convex-generated",
  "node": {
    "module": "convex/_generated/server.js"
  }
}
'''
with open("D:/tmp_convex.json", "w") as f:
    f.write(convex_json_correct)
sftp.put("D:/tmp_convex.json", "/opt/convex-viaturas/convex/convex.json")
os.remove("D:/tmp_convex.json")

# Remove o .convex (cache de login)
run(f"{SUDO} rm -rf /opt/convex-viaturas/convex/.convex 2>&1")
run(f"{SUDO} rm -rf /opt/convex-viaturas/convex/_generated 2>&1")

# 2. Adicionar flag "firstDeploy" pra pular o question
print("\n=== Configurar convex.json (sem auth) ===")
print("OK")

# 3. Iniciar convex dev em background e capturar output
print("\n=== Iniciar convex dev (background) ===")
run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && nohup ./node_modules/.bin/convex dev --once --admin-key viaturas-cpi7-2026-secret-key-32-chars-min-aaaa > /tmp/convex-dev.log 2>&1 &' && sleep 2", timeout=15)
time.sleep(5)

# 4. Esperar e checar log
for i in range(18):
    time.sleep(10)
    out, _ = run("ps aux | grep 'convex dev' | grep -v grep | wc -l", timeout=10)
    if int(out.strip()) == 0:
        print(f"\n[{(i+1)*10}s] CONVEX DEV CONCLUIDO!")
        break
    if i % 2 == 0:
        print(f"[{(i+1)*10}s] rodando...")

# 5. Ver log
print("\n=== Log final ===")
run("cat /tmp/convex-dev.log 2>&1 | tail -30", timeout=15)

# 6. Verificar
print("\n=== _generated/ ===")
run(f"{SUDO} ls -la /opt/convex-viaturas/convex/_generated/ 2>&1 | head -10", timeout=15)
run(f"{SUDO} ls -la /opt/convex-viaturas/convex/ | head -25", timeout=15)

ssh.close()
