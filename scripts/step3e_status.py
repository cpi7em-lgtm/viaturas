"""
Tenta abordagem via API HTTP do convex backend
Endpoint correto: POST /api/push com auth
"""
import sys
import json
import urllib.request

if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Convex backend (varios IPs pra testar)
for url in ["http://10.36.177.138:3212", "http://localhost:3212"]:
    print(f"\n=== Testando {url} ===")
    try:
        with urllib.request.urlopen(f"{url}/version", timeout=5) as resp:
            print(f"  /version: {resp.status} - {resp.read().decode()[:100]}")
    except Exception as e:
        print(f"  /version: {e}")

    # Tentar /api/push com instanceSecret no body
    body = {
        "instanceSecret": "viaturas-cpi7-2026-secret-key-32-chars-min-aaaa",
        "modules": [
            {"path": "convex/schema.ts", "source": "module.exports = { type: 'inline', code: 'export default defineSchema({users: defineTable({})})' }"}
        ],
        "definitionDiff": {
            "tables": {},
            "componentDefinitions": []
        }
    }
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        f"{url}/api/push",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"  /api/push: {resp.status} - {resp.read().decode()[:200]}")
    except urllib.error.HTTPError as e:
        body_resp = e.read().decode(errors='replace')[:500]
        print(f"  /api/push: {e.code} - {body_resp}")
    except Exception as e:
        print(f"  /api/push: {e}")

# Tentar /api/import (pode ser que aceita código TS)
print("\n=== Tentar /api/import ===")
url = "http://10.36.177.138:3212"
try:
    body = {"path": "schema.ts", "code": "export default 'ok'"}
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        f"{url}/api/import",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        print(f"  /api/import: {resp.status} - {resp.read().decode()[:200]}")
except urllib.error.HTTPError as e:
    print(f"  /api/import: {e.code} - {e.read().decode()[:200]}")
except Exception as e:
    print(f"  /api/import: {e}")

# Tentar /api/codegen
print("\n=== /api/codegen ===")
try:
    with urllib.request.urlopen(f"{url}/api/codegen", timeout=5) as resp:
        print(f"  /api/codegen: {resp.status} - {resp.read().decode()[:200]}")
except Exception as e:
    print(f"  /api/codegen: {e}")

# Tentar /api/functions
print("\n=== /api/functions ===")
try:
    with urllib.request.urlopen(f"{url}/api/functions", timeout=5) as resp:
        print(f"  /api/functions: {resp.status} - {resp.read().decode()[:200]}")
except Exception as e:
    print(f"  /api/functions: {e}")
