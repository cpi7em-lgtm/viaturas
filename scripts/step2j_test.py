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

# 1. Validar node_modules
print("=== node_modules ===")
out, _ = run(f"{SUDO} ls /opt/convex-viaturas/convex/node_modules/ 2>&1 | head -10")
out, _ = run(f"{SUDO} ls /opt/convex-viaturas/convex/node_modules/.bin/ 2>&1 | grep convex")

# 2. Testar convex CLI
print("\n=== convex --version ===")
out, _ = run(f"{SUDO} /opt/convex-viaturas/convex/node_modules/.bin/convex --version 2>&1 | head -3", timeout=30)

# 3. Tentar convex deploy (vai falhar pq não tem convex.json ainda, mas a gente ve)
print("\n=== convex deploy (teste inicial) ===")
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && ./node_modules/.bin/convex deploy 2>&1 | head -10'", timeout=60)

# 4. Setup convex.json (pra self-hosted)
print("\n=== Setup convex.json pra self-hosted ===")
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && ./node_modules/.bin/convex dev --once --configure new --team viaturas --project viaturas --prod 2>&1 | head -20'", timeout=60)

ssh.close()
