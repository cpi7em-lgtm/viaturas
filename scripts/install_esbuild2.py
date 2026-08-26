#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Diagnostico enp5s0 + Plano B (baixar esbuild no Windows)"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. DHCP lease - gateway real
    print("=" * 60)
    print("1. DHCP lease (gateway real)")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} cat /var/lib/dhcp/dhclient.enp5s0.leases 2>/dev/null | tail -30")
    print(out if out else "(vazio - DHCP não atribuiu)")
    out, _ = run(ssh, f"{SUDO} ls /var/lib/dhcp/ 2>&1")
    print(out)
    print()

    # 2. ARP table - tem algum host 192.168.0.x?
    print("=" * 60)
    print("2. ARP enp5s0")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} ip neigh show dev enp5s0 2>&1")
    print(out if out else "(vazio)")
    print()

    # 3. Tenta gateway comum (roteador)
    print("=" * 60)
    print("3. Testa gateway 192.168.0.1")
    print("=" * 60)
    out, _ = run(ssh, "ping -c 2 -W 2 192.168.0.1 2>&1 | tail -5")
    print(out)
    out, _ = run(ssh, "arping -c 2 -I enp5s0 192.168.0.1 2>&1 | tail -5")
    print(out)
    print()

    # 4. Estado do link enp5s0
    print("=" * 60)
    print("4. Estado do link enp5s0")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} ethtool enp5s0 2>&1 | head -20")
    print(out)

    # 5. Removo a rota que adicionei
    print("=" * 60)
    print("5. Remove rota que adicionei (cleanup)")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} ip route del default via 192.168.0.1 dev enp5s0 metric 200 2>&1")
    print(out or "(ok)")

    ssh.close()

if __name__ == "__main__":
    main()
