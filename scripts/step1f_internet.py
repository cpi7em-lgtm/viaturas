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

# 1. Estado do /etc/resolv.conf
print("=== /etc/resolv.conf ===")
run(f"{SUDO} ls -la /etc/resolv.conf 2>&1")
run(f"{SUDO} cat /etc/resolv.conf 2>&1 || echo NAO_EXISTE")

# 2. Estado da enp5s0
print("\n=== enp5s0 ===")
run(f"{SUDO} ip addr show enp5s0 2>&1")
run(f"{SUDO} ip route 2>&1 | head -15")

# 3. Tentar DHCP na enp5s0
print("\n=== DHCP renew enp5s0 ===")
run(f"{SUDO} dhclient -r enp5s0 2>&1; sleep 2; {SUDO} dhclient enp5s0 2>&1", timeout=60)
run(f"{SUDO} ip addr show enp5s0 2>&1")

# 4. Testar DNS depois do DHCP
print("\n=== Testa DNS (deve funcionar se DHCP renovou) ===")
run("timeout 5 nslookup registry.npmjs.org 2>&1 | tail -5")

# 5. Se não funcionar, setar DNS manual
print("\n=== Fallback: setar DNS da PM ===")
run(f"{SUDO} rm -f /etc/resolv.conf 2>&1")
run(f"{SUDO} bash -c \"printf 'nameserver 10.61.255.62\\nnameserver 10.61.255.63\\nsearch .\\n' > /etc/resolv.conf && cat /etc/resolv.conf\"")
run("timeout 5 nslookup registry.npmjs.org 2>&1 | tail -5")

ssh.close()
