#!/usr/bin/env python3
import sys, io, os, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import paramiko
HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

def run(ssh, cmd, t=30):
    si, so, se = ssh.exec_command(cmd, timeout=t)
    return so.read().decode(errors='replace').strip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

# 1. Clean
run(ssh, f"{SUDO} rm -rf /opt/convex-viaturas/dist /opt/convex-viaturas/dist/assets")
run(ssh, f"{SUDO} mkdir -p /opt/convex-viaturas/dist/assets")
run(ssh, f"{SUDO} chown -R pm:pm /opt/convex-viaturas/dist")

# 2. Upload novo bundle
sftp = ssh.open_sftp()
sftp.put(r'D:\USER\DESKTOPP\excel\viaturas\frontend\dist\index.html', '/opt/convex-viaturas/dist/index.html')
sftp.put(r'D:\USER\DESKTOPP\excel\viaturas\frontend\dist\assets\index-DABelzrf.css', '/opt/convex-viaturas/dist/assets/index-DABelzrf.css')
sftp.put(r'D:\USER\DESKTOPP\excel\viaturas\frontend\dist\assets\index-N0wzy2qH.js', '/opt/convex-viaturas/dist/assets/index-N0wzy2qH.js')
sftp.close()
print('upload OK')

# 3. Permissoes
run(ssh, f"{SUDO} chmod -R a+r /opt/convex-viaturas/dist")

# 4. Restart nginx
out = run(ssh, f"{SUDO} docker restart convex-nginx-viaturas")
print('restart:', out)
time.sleep(5)

# 5. Testa
print('GET /:', run(ssh, "curl -s -o /dev/null -w 'HTTP %{http_code} (%{size_download} bytes)' http://localhost:8081/"))
print('GET bundle:', run(ssh, "curl -s -o /dev/null -w 'HTTP %{http_code} (%{size_download} bytes)' http://localhost:8081/assets/index-N0wzy2qH.js"))
ssh.close()
