"""
Deploy Convex via HTTP API direta - v2 (com IP real)
"""
import sys
import json
import urllib.request

if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Convex self-hosted URL via IP do server
CONVEX_URL = "http://10.36.177.138:3212"
ADMIN_KEY = "viaturas-cpi7-2026-secret-key-32-chars-min-aaaa"

CONVEX_DIR = "D:/USER/DESKTOPP/excel/viaturas/convex"

def post(endpoint, body, auth_header=None):
    url = f"{CONVEX_URL}{endpoint}"
    data = json.dumps(body).encode()
    headers = {"Content-Type": "application/json"}
    if auth_header:
        headers["Authorization"] = auth_header
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status, resp.read().decode(errors='replace')[:1000]
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode(errors='replace')[:1000]
    except Exception as e:
        return 0, str(e)

def get(endpoint):
    try:
        with urllib.request.urlopen(f"{CONVEX_URL}{endpoint}", timeout=5) as resp:
            return resp.status, resp.read().decode(errors='replace')[:1000]
    except Exception as e:
        return 0, str(e)

# 1. Testar
print("=== Conectividade ===")
print(f"URL: {CONVEX_URL}")
status, body = get("/api/version")
print(f"  /api/version: {status}")
print(f"  Body: {body[:300]}")

# 2. Ver dashboard e endpoints
print("\n=== Endpoints ===")
for ep in ["/api/version", "/api/whoami", "/api/health", "/version", "/health", "/dashboard"]:
    status, body = get(ep)
    print(f"  {ep}: {status} - {body[:100]}")

# 3. Tentar /api/push (endpoint de push)
print("\n=== /api/push ===")
with open(f"{CONVEX_DIR}/schema.ts", "r", encoding="utf-8") as f:
    schema = f.read()

body = {
    "instanceSecret": ADMIN_KEY,
    "modules": [{"path": "convex/schema.ts", "source": schema}],
    "definitionDiff": None,
    "format": "ts"
}
status, body_resp = post("/api/push", body, auth_header=f"Convex {ADMIN_KEY}")
print(f"  /api/push: {status}")
print(f"  Response: {body_resp[:500]}")

# 4. Tentar /api/deploy2
print("\n=== /api/deploy2 ===")
body2 = {
    "instanceSecret": ADMIN_KEY,
    "modules": [{"path": "convex/schema.ts", "source": schema}],
}
status, body_resp = post("/api/deploy2", body2)
print(f"  /api/deploy2: {status}")
print(f"  Response: {body_resp[:500]}")

# 5. Tentar com Authorization
print("\n=== /api/deploy2 (com auth) ===")
status, body_resp = post("/api/deploy2", body2, auth_header=f"Bearer {ADMIN_KEY}")
print(f"  /api/deploy2: {status}")
print(f"  Response: {body_resp[:500]}")

# 6. Listar tabelas existentes
print("\n=== /api/list_tables ===")
for ep in ["/api/list_tables", "/api/tables", "/api/get_schema"]:
    status, body = get(ep)
    print(f"  {ep}: {status} - {body[:200]}")
