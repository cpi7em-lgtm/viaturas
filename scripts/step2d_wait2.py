import paramiko
import sys
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655', timeout=30)

def run(cmd, timeout=30):
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    out = so.read().decode(errors='replace')
    err = se.read().decode(errors='replace')
    print(out, end='' if out.endswith('\n') else '\n')
    if err: print(f"STDERR: {err}", file=sys.stderr)
    return out, err

# Esperar  até 3min (npm install do convex é pesado)
print("Aguardando  até 3min pro npm install convex terminar...")
for i in range(18):
    time.sleep(10)
    out, _ = run("ps aux | grep 'npm install' | grep -v grep | wc -l", timeout=10)
    if int(out.strip()) == 0:
        print(f"\n[{(i+1)*10}s] npm install CONCLUIDO!")
        break
    if i % 3 == 0:  # mostra status a cada 30s
        print(f"[{(i+1)*10}s] ainda rodando...")

# Log final
print("\n=== Log final ===")
run("cat /tmp/convex-install.log 2>&1 | tail -20", timeout=15)
run("which convex 2>&1; npx convex --version 2>&1 | head -3", timeout=30)

ssh.close()
