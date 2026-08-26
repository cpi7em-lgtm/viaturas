#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Adicionar rota enp5s0 e tentar npm install esbuild"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import re

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

def run(ssh, cmd, timeout=60, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)

    # 1. Estado das rotas
    print("=" * 60)
    print("1. Rotas atuais")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} ip route show")
    print(out)
    print()

    # 2. Adiciona rota default via enp5s0 (metric 200, enp4s0 continua principal com metric 0)
    # IMPORTANTE: NAO desliga enp4s0
    print("=" * 60)
    print("2. Adiciona rota enp5s0 metric 200 (fallback)")
    print("=" * 60)
    out, _ = run(ssh, f"{SUDO} ip route add default via 192.168.0.1 dev enp5s0 metric 200 2>&1")
    print(out or "(ok)")
    out, _ = run(ssh, f"{SUDO} ip route show")
    print(out)
    print()

    # 3. Testa internet via enp5s0
    print("=" * 60)
    print("3. Testa internet")
    print("=" * 60)
    out, _ = run(ssh, "ping -c 2 -I enp5s0 8.8.8.8 2>&1 | tail -5")
    print(out)
    print()

    # 4. Testa DNS via enp5s0
    print("=" * 60)
    print("4. Testa DNS (registry.npmjs.org)")
    print("=" * 60)
    out, _ = run(ssh, "nslookup registry.npmjs.org 2>&1 | head -5")
    print(out)
    out, _ = run(ssh, "curl -sI https://registry.npmjs.org/ 2>&1 | head -5")
    print(out)
    print()

    # 5. Tenta npm install (deve usar rota enp5s0)
    print("=" * 60)
    print("5. Tenta instalar esbuild-linux-x64")
    print("=" * 60)
    out, _ = run(ssh, f"cd /opt/convex-viaturas/convex && timeout 60 npm install --no-save --no-audit --no-fund @esbuild/linux-x64@0.21.5 2>&1 | tail -30", timeout=120)
    print(out)

    # 6. Verifica
    print("=" * 60)
    print("6. esbuild-linux-x64 instalado?")
    print("=" * 60)
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/convex/node_modules/@esbuild/ 2>&1")
    print(out)

    # 7. Se instalou, tenta rebuild do esbuild
    print("=" * 60)
    print("7. esbuild agora funciona?")
    print("=" * 60)
    out, _ = run(ssh, "cd /opt/convex-viaturas/convex && node -e \"const e = require('esbuild'); e.build({entryPoints:['/tmp/test.js'],bundle:true,write:false,platform:'node'}).then(r=>console.log('OK',r.outputFiles.length)).catch(e=>console.error('ERR',e.message))\" 2>&1")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
