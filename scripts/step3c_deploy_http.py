"""
Deploy Convex via HTTP API direta (sem CLI)
Baseado na doc do Convex self-hosted: https://docs.convex.dev/self-hosted/intro
"""
import paramiko
import sys
import time
import os
import json
import urllib.request

if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Convex self-hosted URL
CONVEX_URL = "http://localhost:3212"
ADMIN_KEY = "viaturas-cpi7-2026-secret-key-32-chars-min-aaaa"

# Caminho do código Convex
CONVEX_DIR = "D:/USER/DESKTOPP/excel/viaturas/convex"

def post(endpoint, body):
    url = f"{CONVEX_URL}{endpoint}"
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        url, data=data,
        headers={
            "Content-Type": "application/json",
            "Convex-Client": "npm-cli-convex-1.31.6",
            "Authorization": f"Convex {ADMIN_KEY}",
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode(errors='replace')[:500]
    except Exception as e:
        return 0, str(e)

def get(endpoint):
    try:
        with urllib.request.urlopen(f"{CONVEX_URL}{endpoint}", timeout=5) as resp:
            return resp.status, resp.read().decode(errors='replace')[:500]
    except Exception as e:
        return 0, str(e)

# 1. Testar conectividade
print("=== Conectividade ===")
status, body = get("/api/version")
print(f"  /api/version: {status} - {body[:200]}")
status, body = get("/api/whoami")
print(f"  /api/whoami: {status} - {body[:200]}")

# 2. Listar endpoints
print("\n=== Endpoints disponiveis ===")
for ep in ["/api/version", "/api/whoami", "/api/health", "/version", "/health", "/dashboard", "/api/deploy2"]:
    status, _ = get(ep)
    print(f"  {ep}: {status}")

# 3. Tentar push do schema via /api/deploy2/push
print("\n=== Tentando /api/deploy2/push ===")
# Le o schema
schema_path = os.path.join(CONVEX_DIR, "schema.ts")
with open(schema_path, "r", encoding="utf-8") as f:
    schema_content = f.read()

# Body pro deploy
body = {
    "instanceSecret": ADMIN_KEY,
    "modules": [
        {
            "path": "schema.js",
            "source": "// Generated\nmodule.exports = " + schema_content
        }
    ],
    "functions": []
}

status, body_resp = post("/api/deploy2/push", body)
print(f"  /api/deploy2/push: {status}")
print(f"  Response: {body_resp[:500]}")

# 4. Tentar /api/push
print("\n=== Tentando /api/push ===")
body = {
    "instanceSecret": ADMIN_KEY,
    "modules": [
        {
            "path": "schema.js",
            "source": schema_content
        }
    ]
}
status, body_resp = post("/api/push", body)
print(f"  /api/push: {status}")
print(f"  Response: {body_resp[:500]}")

# 5. Tentar GET /api/schema pra ver o que já tem
print("\n=== Schema atual ===")
status, body = get("/api/schema")
print(f"  /api/schema: {status}")
if status == 200:
    data = json.loads(body) if body else {}
    print(f"  Tables: {list(data.get('tables', {}).keys())}")
