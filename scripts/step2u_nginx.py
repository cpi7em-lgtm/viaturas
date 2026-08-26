import paramiko
import sys
import time
import os

if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.36.177.138', username='pm', password='11192655', timeout=30)

def run(cmd, timeout=30):
    print(f"\n>>> {cmd[:200]}")
    si, so, se = ssh.exec_command(cmd, timeout=timeout)
    out = so.read().decode(errors='replace')
    err = se.read().decode(errors='replace')
    if out: print(out)
    if err and 'cp1252' not in err: print(f"STDERR: {err}", file=sys.stderr)
    return out, err

SUDO = 'SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A'

# 1. Verificar a config atual do nginx
print("=== Nginx config atual ===")
out, _ = run(f"{SUDO} cat /opt/convex-viaturas/nginx.conf | head -50", timeout=15)

# 2. Refazer nginx SEM o loop de rewrite
print("\n=== Substituir nginx config (sem rewrite cycle) ===")
new_nginx = """server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    charset utf-8;

    # Health endpoint simples
    location = /health {
        return 200 '{"ok":true,"service":"viaturas-pmesp-auth"}\\n';
        add_header Content-Type application/json;
    }

    # Auth API (FastAPI) - /api/ vai pro auth-api
    location /api/ {
        proxy_pass http://auth-api-viaturas:8082/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 180s;
    }

    # Convex API (WebSocket) - rotas convex
    location /convex/ {
        rewrite ^/convex/(.*)$ /$1 break;
        proxy_pass http://convex-backend-viaturas:3210;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_buffering off;
    }

    # Static assets
    location /assets/ {
        add_header Cache-Control "no-store, no-cache, must-revalidate, max-age=0" always;
        try_files $uri =404;
    }

    # Root: serve o index.html (SPA React)
    location / {
        try_files $uri /index.html;
    }
}
"""

with open("D:/tmp_nginx", "w") as f:
    f.write(new_nginx)

sftp = ssh.open_sftp()
sftp.put("D:/tmp_nginx", "/opt/convex-viaturas/nginx.conf")
os.remove("D:/tmp_nginx")
print("  OK: nginx.conf enviado")

# 3. Restart nginx
run(f"{SUDO} /usr/bin/docker compose -f /opt/convex-viaturas/docker-compose-viaturas.yml restart convex-nginx-viaturas 2>&1 | tail -10", timeout=60)

# 4. Esperar
time.sleep(5)
run("curl -sS -o /dev/null -w 'nginx :8081: %{http_code}\\n' http://localhost:8081/health", timeout=10)

# 5. Tentar convex deploy com --no-prompt
print("\n=== Convex dev --once (no prompt) ===")
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_URL=http://localhost:3212 ./node_modules/.bin/convex dev --once --admin-key viaturas-cpi7-2026-secret-key-32-chars-min-aaaa --no-prompt 2>&1' | head -30", timeout=180)

# 6. Se der erro, tentar com CONVEX_SELF_HOSTED_URL env
print("\n=== Tentar com CONVEX_SELF_HOSTED_URL ===")
out, _ = run(f"{SUDO} bash -c 'cd /opt/convex-viaturas/convex && CONVEX_SELF_HOSTED_URL=http://localhost:3212 ./node_modules/.bin/convex dev --once --no-prompt 2>&1' | head -20", timeout=120)

# 7. Ver
run(f"{SUDO} ls /opt/convex-viaturas/convex/_generated/ 2>&1 | head -5", timeout=15)

ssh.close()
