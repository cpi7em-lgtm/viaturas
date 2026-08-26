import paramiko
import sys
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655', timeout=30)

def run(cmd, timeout=60, get_exit=False):
    print(f"\n>>> {cmd[:200]}")
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    out = so.read().decode(errors='replace')
    err = se.read().decode(errors='replace')
    print(out, end='' if out.endswith('\n') else '\n')
    if err: print(f"STDERR: {err}", file=sys.stderr)
    if get_exit: print(f"[exit: {so.channel.recv_exit_status() if hasattr(so.channel, 'recv_exit_status') else None}]")
    return out, err

SUDO = 'SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A'

# 1. Tenta install convex em BACKGROUND (timeout grande)
print("=" * 60)
print("Instalar convex em background (5min timeout)")
print("=" * 60)

# Roda em background pra não travar
run(f"{SUDO} bash -c 'nohup npm install -g convex --no-audit --no-fund > /tmp/convex-install.log 2>&1 &' && sleep 2 && echo 'iniciado'", timeout=30)

# 2. Aguarda 30s e checa
print("\nAguardando 30s e checando...")
time.sleep(30)
out, _ = run("ps aux | grep 'npm install' | grep -v grep | head -3", timeout=15)
print(f"Processo npm: {out or '(nao esta mais rodando)'}")

# 3. Checar log
out, _ = run("cat /tmp/convex-install.log 2>&1 | tail -20", timeout=15)

# 4. Verificar se instalou
out, _ = run("which convex 2>&1; npx convex --version 2>&1 | head -3", timeout=30)

# 5. Se não instalou, tentar outro registry
if 'convex' not in (out or '').lower() or 'command not found' in (out or '').lower():
    print("\nNPM global não funcionou. Tentando com registry alternativo...")
    out, _ = run(f"{SUDO} npm config get registry 2>&1", timeout=15)
    print(f"Registry atual: {out}")
    run(f"{SUDO} bash -c 'nohup npm install -g convex --registry=https://registry.npmjs.org/ --no-audit --no-fund > /tmp/convex-install2.log 2>&1 &' && sleep 2", timeout=15)
    time.sleep(30)
    out, _ = run("cat /tmp/convex-install2.log 2>&1 | tail -10")
    out, _ = run("which convex 2>&1; npx convex --version 2>&1 | head -3", timeout=30)

ssh.close()
