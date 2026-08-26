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

# 1. Encontrar docker
print("=== Procurar docker ===")
run("which docker 2>&1")
run("which docker-compose 2>&1")
run("ls -la /usr/bin/docker* 2>&1")
run("ls -la /usr/local/bin/docker* 2>&1")
run("ls -la /var/lib/docker/ 2>&1 | head -5")
run(f"{SUDO} find / -name 'docker' -type f 2>/dev/null | head -10")

# 2. Setup convex.json na mao (ja que convex deploy não funciona)
print("\n=== Setup convex.json manual ===")
convex_json_content = '''{
  "functions": "convex/",
  "authInfo": [],
  "clientQueryPaths": [],
  "generatedCodeCommonDirectory": "convex-generated",
  "node": {
    "module": "convex/convex.config.js"
  }
}
'''
run(f"{SUDO} bash -c \"echo '{convex_json_content}' > /opt/convex-viaturas/convex/convex.json\"", timeout=15)
run(f"{SUDO} cat /opt/convex-viaturas/convex/convex.json 2>&1", timeout=15)

# 3. Tentar convex dev --once
print("\n=== Convex dev --once ===")
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 ./node_modules/.bin/convex dev --once --admin-key viaturas-cpi7-2026-secret-key-32-chars-min-aaaa 2>&1 | head -30'", timeout=120)

# 4. Verificar
run(f"{SUDO} ls -la /opt/convex-viaturas/convex/ | head -20", timeout=15)
run(f"{SUDO} ls -la /opt/convex-viaturas/convex/_generated/ 2>&1 | head -5", timeout=15)

ssh.close()
