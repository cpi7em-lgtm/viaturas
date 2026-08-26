#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Atualiza nginx com rewrite /convex/query -> /api/query"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import json

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

NEW_NGINX = r"""server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    charset utf-8;

    # Health endpoint simples
    location = /health {
        return 200 '{"ok":true,"service":"viaturas-pmesp-auth"}\n';
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

    # Convex API - /convex/query/{path} -> POST /api/query (body tem {path,args})
    #              /convex/mutation/{path} -> POST /api/mutation
    # Usa prefix location + rewrite (regex não permite proxy_pass com URI)
    location /convex/query/ {
        rewrite ^/convex/query/.*$ /api/query break;
        proxy_pass http://convex-backend-viaturas:3210;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_buffering off;
    }
    location /convex/mutation/ {
        rewrite ^/convex/mutation/.*$ /api/mutation break;
        proxy_pass http://convex-backend-viaturas:3210;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_buffering off;
    }
    # Convex WebSocket / actions (futuro) - generico
    location /convex/ {
        proxy_pass http://convex-backend-viaturas:3210;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
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

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = so.read().decode(errors='replace').strip()
    err = se.read().decode(errors='replace').strip()
    return out, err

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)
    sftp = ssh.open_sftp()

    # 1. Salva novo nginx.conf
    with sftp.file('/opt/convex-viaturas/nginx.conf', 'w') as f:
        f.write(NEW_NGINX)
    sftp.close()
    print("nginx.conf atualizado")

    # 2. Testa config antes de restart
    out, _ = run(ssh, f"{SUDO} docker exec convex-nginx-viaturas nginx -t 2>&1")
    print(f"nginx -t: {out}")

    # 3. Restart
    out, _ = run(ssh, f"{SUDO} docker restart convex-nginx-viaturas 2>&1")
    print(f"restart: {out}")
    time.sleep(5)

    # 4. Testa convex via nginx
    print()
    print("=" * 60)
    print("[1] /convex/query/units:list via nginx (deve listar 10 units)")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:8081/convex/query/units:list -H 'Content-Type: application/json' -d '{\"args\":{}}'")
    print(out[:300])
    try:
        d = json.loads(out)
        if 'value' in d:
            print(f"OK: {len(d['value'])} units")
    except Exception as e:
        print(f"parse err: {e}")

    print()
    print("=" * 60)
    print("[2] /convex/query/units:getByCode (com arg)")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:8081/convex/query/units:getByCode -H 'Content-Type: application/json' -d '{\"args\":{\"code\":\"607000000\"}}'")
    print(out[:300])

    print()
    print("=" * 60)
    print("[3] /convex/query/dashboard:getHomeStats (precisa cpf)")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:8081/convex/query/dashboard:getHomeStats -H 'Content-Type: application/json' -d '{\"args\":{\"cpf\":\"26034202833\"}}'")
    print(out[:500])

    print()
    print("=" * 60)
    print("[4] /convex/query/pm_auth:listAll (com secret)")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:8081/convex/query/pm_auth:listAll -H 'Content-Type: application/json' -d '{\"args\":{\"secret\":\"pmesp-import-2026\"}}'")
    print(out[:500])

    ssh.close()

if __name__ == "__main__":
    main()
