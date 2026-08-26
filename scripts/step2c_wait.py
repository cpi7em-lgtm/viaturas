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

# Esperar mais tempo pro npm install terminar
print("Aguardando 60s pro npm install convex...")
for i in range(6):
    time.sleep(10)
    print(f"\n--- {(i+1)*10}s ---")
    out, _ = run("ps aux | grep 'npm install' | grep -v grep | wc -l")
    print(f"Processos npm rodando: {out.strip()}")
    if out.strip() == "0":
        break

# Checar log final
print("\n=== Log final ===")
run("cat /tmp/convex-install.log 2>&1 | tail -20")
run("which convex 2>&1; npx convex --version 2>&1 | head -3", timeout=15)

ssh.close()
