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

# 1. Verifica mirror HTTP do npm
print("=== Testa mirrors HTTP/HTTPS ===")
for url in [
    "https://registry.npmmirror.com/",
    "https://registry.npmjs.org/",
    "https://github.com/",
    "https://github.com/get-convex/convex-backend/releases/latest",
    "http://registry.npmmirror.com/",
]:
    out, _ = run(f"curl -sS -o /dev/null -w '{url}: %{{http_code}} (%{{time_total}}s)\\n' --max-time 8 '{url}' 2>&1", timeout=15)

# 2. Tentar via registry mirror
print("\n=== Tentar npm install via mirror ===")
run(f"{SUDO} bash -c 'cd /tmp && nohup npm install convex --no-audit --no-fund --registry=https://registry.npmmirror.com/ > /tmp/npm-mirror.log 2>&1 &' && sleep 2", timeout=15)
for i in range(12):
    time.sleep(10)
    out, _ = run("ps aux | grep 'npm install' | grep -v grep | wc -l", timeout=10)
    if int(out.strip()) == 0:
        print(f"  [{(i+1)*10}s] CONCLUIDO!")
        break
    if i % 3 == 0:
        print(f"  [{(i+1)*10}s] rodando...")
run("cat /tmp/npm-mirror.log 2>&1 | tail -15")
run("which convex 2>&1; npx convex --version 2>&1 | head -3", timeout=15)

# 3. Tentar baixar convex CLI standalone do GitHub
print("\n=== Baixar convex CLI standalone do GitHub ===")
# Releases do convex CLI standalone não existem (ele é npm)
# Mas podemos baixar o .tgz do convex CLI e instalar manual
# https://registry.npmjs.org/convex/-/convex-1.17.0.tgz
run("curl -sS -o /dev/null -w 'convex.tgz: %{http_code}\\n' --max-time 15 https://registry.npmjs.org/convex/-/convex-1.17.0.tgz 2>&1", timeout=30)
run("curl -sS -o /tmp/convex.tgz -w 'size: %{size_download} bytes\\n' --max-time 30 https://registry.npmjs.org/convex/-/convex-1.17.0.tgz 2>&1", timeout=60)
run("ls -la /tmp/convex.tgz 2>&1")

# 4. Tentar via github (github é mais acessivel)
print("\n=== Testa github.com ===")
run("curl -sS -o /dev/null -w 'github.com: %{http_code}\\n' --max-time 10 https://github.com/ 2>&1", timeout=15)

ssh.close()
