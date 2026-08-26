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

# 1. Descobrir o que e /etc/resolv.conf
print("=== /etc/resolv.conf ===")
run(f"{SUDO} ls -la /etc/resolv.conf 2>&1")
run(f"{SUDO} file /etc/resolv.conf 2>&1")
run(f"{SUDO} readlink -f /etc/resolv.conf 2>&1")
run(f"{SUDO} ls -la /run/systemd/resolve/ 2>&1 | head -5")
run(f"{SUDO} cat /run/systemd/resolve/stub-resolv.conf 2>&1")
run(f"{SUDO} cat /run/systemd/resolve/resolv.conf 2>&1")
run(f"{SUDO} ls -la /etc/resolvconf 2>&1 || true")

# 2. systemd-resolved
print("\n=== systemd-resolved status ===")
run(f"{SUDO} systemctl status systemd-resolved 2>&1 | head -20")

# 3. Testar com DHCP na enp5s0
print("\n=== enp5s0 status ===")
run(f"{SUDO} ip addr show enp5s0 2>&1 | head -10")
run(f"{SUDO} cat /etc/resolv.conf 2>&1; echo '---'; ls -la /etc/resolv.conf 2>&1")

# 4. Tentar com NetworkManager
print("\n=== NetworkManager ===")
run(f"{SUDO} nmcli device show enp5s0 2>&1 | head -10")

# 5. Ping pra DNS PM
print("\n=== Testa DNS PM (10.61.255.62) ===")
run(f"{SUDO} timeout 5 ping -c 2 10.61.255.62 2>&1 | tail -3")

ssh.close()
