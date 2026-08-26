import paramiko
import sys

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

# 1. Chmod +x
print("=== chmod convex ===")
out, _ = run(f"{SUDO} chmod +x /opt/convex-viaturas/convex/node_modules/.bin/convex && ls -la /opt/convex-viaturas/convex/node_modules/.bin/convex", timeout=15)

# 2. Tentar de novo
out, _ = run(f"{SUDO} /opt/convex-viaturas/convex/node_modules/.bin/convex --version 2>&1 | head -3", timeout=15)

# 3. Tentar convex deploy
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && ./node_modules/.bin/convex deploy 2>&1 | head -10'", timeout=60)

# 4. Setup convex.json
print("\n=== Setup convex.json ===")
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && ./node_modules/.bin/convex dev --once --configure new --team viaturas --project viaturas --prod 2>&1 | head -20'", timeout=60)

# 5. Listar arquivos do convex/
out, _ = run(f"{SUDO} ls -la /opt/convex-viaturas/convex/ 2>&1")

ssh.close()
