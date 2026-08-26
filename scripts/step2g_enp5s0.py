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

# 1. Ver DHCP disponível na rede da enp5s0
print("=== Estado enp5s0 ===")
run(f"{SUDO} ip link show enp5s0 2>&1 | head -5")
run(f"{SUDO} ip route 2>&1 | head -5")

# 2. Tentar descobrir gateway via ARP/router
print("\n=== Procurar gateway ===")
run(f"{SUDO} timeout 5 arp-scan --interface=enp5s0 --localnet 2>&1 | head -10 || echo 'arp-scan não tem'")
run(f"{SUDO} timeout 5 nmap -sn 192.168.0.0/24 2>&1 | head -15 || echo 'nmap não tem'")
run(f"{SUDO} timeout 5 ping -c 1 192.168.0.1 2>&1 | tail -3")
run(f"{SUDO} timeout 5 ping -c 1 192.168.1.1 2>&1 | tail -3")

# 3. Tentar configurar IP estatico (mais simples)
print("\n=== Configurar IP estatico enp5s0 ===")
run(f"{SUDO} ip addr add 192.168.0.42/24 dev enp5s0 2>&1")
run(f"{SUDO} ip link set enp5s0 up 2>&1")
run(f"{SUDO} ip addr show enp5s0 2>&1")

# 4. Adicionar rota para npmjs via enp5s0
print("\n=== Adicionar rota para 146.112.61.106 via enp5s0 ===")
# IP do registry.npmjs.org (pegar via nslookup)
out, _ = run("nslookup registry.npmjs.org 2>&1 | grep Address | head -1 | awk '{print $2}'", timeout=15)
npm_ip = out.strip() if out.strip() else "146.112.61.106"
print(f"  IP do npm: {npm_ip}")

# Tenta descobrir gateway da enp5s0 (192.168.0.1 padrao)
print("\n  Tentando gateway 192.168.0.1...")
out, _ = run(f"{SUDO} timeout 3 ping -c 1 192.168.0.1 2>&1 | tail -3", timeout=15)
if "1 received" in out:
    print("  Gateway 192.168.0.1 respondendo!")
    # Adiciona rota via enp5s0
    run(f"{SUDO} ip route add {npm_ip}/32 via 192.168.0.1 dev enp5s0 2>&1")
    # Testa HTTPS
    run("curl -sS -o /dev/null -w 'HTTPS: %{http_code}\\n' --max-time 5 https://registry.npmjs.org/ 2>&1")
else:
    print("  Gateway 192.168.0.1 NAO responde, tentando 192.168.1.1...")
    out, _ = run(f"{SUDO} timeout 3 ping -c 1 192.168.1.1 2>&1 | tail -3", timeout=15)
    if "1 received" in out:
        print("  Gateway 192.168.1.1 respondendo!")
        run(f"{SUDO} ip route add {npm_ip}/32 via 192.168.1.1 dev enp5s0 2>&1")
        run("curl -sS -o /dev/null -w 'HTTPS: %{http_code}\\n' --max-time 5 https://registry.npmjs.org/ 2>&1")

ssh.close()
