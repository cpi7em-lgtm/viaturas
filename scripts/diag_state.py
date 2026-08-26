#!/usr/bin/env python3
"""Diagnostico: estado atual do servidor viaturas"""
import paramiko
import sys

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)
    print("=== SSH OK ===\n")

    cmds = [
        ("Containers", 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}" 2>&1'),
        ("Health checks",
            'curl -s -o /dev/null -w "8081=%{http_code} " http://localhost:8081/health; '
            'curl -s -o /dev/null -w "8002=%{http_code} " http://localhost:8002/api/health; '
            'curl -s -o /dev/null -w "3212=%{http_code}\n" http://localhost:3212/version; '
            'curl -s http://localhost:3212/version'),
        ("/opt/convex-viaturas/convex/", 'ls -la /opt/convex-viaturas/convex/ 2>&1'),
        ("convex.json", 'cat /opt/convex-viaturas/convex/convex.json 2>&1'),
        ("Networks", 'ip -4 addr show enp4s0 2>&1 | grep -E "inet|state UP"; ip -4 addr show enp5s0 2>&1 | grep -E "inet|state"'),
        ("Materiais convex (pra comparar)", 'ls -la /opt/convex/ 2>&1 | head -20; echo "---"; ls -la /opt/convex/convex/ 2>&1 | head -20'),
        ("Materiais: como fez deploy?", 'ls -la /opt/convex/convex/ 2>&1; echo "---DEPLOY SCRIPTS---"; find /opt/convex -maxdepth 2 -name "*.sh" -o -name "deploy*" 2>/dev/null | head -20'),
        ("Materiais: _generated existe?", 'ls -la /opt/convex/dist/convex/ 2>&1 | head; find / -name "api.d.ts" 2>/dev/null | head -5'),
    ]

    for title, cmd in cmds:
        print(f"--- {title} ---")
        print(f"$ {cmd}")
        si, so, se = ssh.exec_command(cmd, timeout=20)
        out = so.read().decode(errors='replace').strip()
        err = se.read().decode(errors='replace').strip()
        if out: print(out)
        if err: print(f"[STDERR] {err}")
        print()

    ssh.close()

if __name__ == "__main__":
    main()
