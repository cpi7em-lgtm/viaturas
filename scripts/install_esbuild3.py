#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SCP esbuild-linux-x64 e extrai no node_modules"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import os

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"

LOCAL_TGZ = r"D:\USER\DESKTOPP\excel\viaturas\convex\esbuild-linux-x64-0.27.0.tgz"

def run(ssh, cmd, timeout=60, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)
    sftp = ssh.open_sftp()

    # 1. SCP
    print("=" * 60)
    print("1. SCP do tgz")
    print("=" * 60)
    print(f"Local: {LOCAL_TGZ} ({os.path.getsize(LOCAL_TGZ)} bytes)")
    sftp.put(LOCAL_TGZ, '/tmp/esbuild-linux-x64.tgz')
    print("Uploaded to /tmp/esbuild-linux-x64.tgz")
    sftp.close()

    # 2. Cria dir e extrai
    print("=" * 60)
    print("2. Cria dir e extrai")
    print("=" * 60)
    out, _ = run(ssh, "mkdir -p /opt/convex-viaturas/convex/node_modules/@esbuild/linux-x64")
    print(out or "(ok)")
    out, _ = run(ssh, "cd /opt/convex-viaturas/convex/node_modules/@esbuild/linux-x64 && tar xzf /tmp/esbuild-linux-x64.tgz --strip-components=1 2>&1 | head -5")
    print(out or "(ok)")
    out, _ = run(ssh, "ls -la /opt/convex-viaturas/convex/node_modules/@esbuild/linux-x64/ 2>&1")
    print(out)
    print()

    # 3. Verifica binario
    print("=" * 60)
    print("3. Binario esbuild funciona?")
    print("=" * 60)
    out, _ = run(ssh, "/opt/convex-viaturas/convex/node_modules/@esbuild/linux-x64/bin/esbuild --version 2>&1")
    print(out)
    print()

    # 4. Verifica via require
    print("=" * 60)
    print("4. require('esbuild') funciona?")
    print("=" * 60)
    out, _ = run(ssh, "cd /opt/convex-viaturas/convex && node -e \"const e = require('esbuild'); console.log('platform:', e.build.toString().slice(0,80)); e.build({entryPoints:['/tmp/test.js'],bundle:true,write:false,platform:'node'}).then(r=>console.log('OK len=',r.outputFiles[0].text.length)).catch(e=>console.error('ERR',e.message))\" 2>&1")
    print(out)

    # 5. Tenta o deploy de novo
    print("=" * 60)
    print("5. convex deploy (de novo)")
    print("=" * 60)
    out, _ = run(ssh, "bash /tmp/deploy_viaturas.sh", timeout=180)
    print(out[-3000:])  # tail 3000 chars

    ssh.close()

if __name__ == "__main__":
    main()
