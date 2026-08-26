import paramiko
import sys
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655', timeout=30)

def run(cmd, timeout=30):
    print(f"\n>>> {cmd[:200]}")
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    out = so.read().decode(errors='replace')
    err = se.read().decode(errors='replace')
    print(out, end='' if out.endswith('\n') else '\n')
    if err: print(f"STDERR: {err}", file=sys.stderr)
    return out, err

SUDO = 'SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A'

# 1. Ver onde instalou
print("=== Onde instalou ===")
run(f"{SUDO} ls -la /usr/lib/node_modules/convex 2>&1 | head -5")
run(f"{SUDO} ls -la /usr/local/lib/node_modules/convex 2>&1 | head -5")

# 2. Esperar mais 2 min pro npm install
print("\n=== Aguardar 2min mais ===")
for i in range(12):
    time.sleep(10)
    out, _ = run("ps aux | grep 'npm install' | grep -v grep | wc -l", timeout=10)
    if int(out.strip()) == 0:
        print(f"\n[{(i+1)*10}s] CONCLUIDO!")
        break
    if i % 2 == 0:
        print(f"[{(i+1)*10}s] ainda rodando...")

# 3. Checar log
print("\n=== Log ===")
run("cat /tmp/convex-install.log 2>&1 | tail -30", timeout=15)

# 4. Verificar
run("ls -la /usr/lib/node_modules/ 2>&1 | grep convex")
run("which convex 2>&1")
run("ls /usr/local/bin/ | grep convex", timeout=15)

ssh.close()
