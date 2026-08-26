#!/usr/bin/env python3
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import urllib.request, json
# Testa dashboard:getTotaisPorUnidade + lista algumas viaturas
url = "http://10.36.177.138:3212/api/query"
def query(path, args):
    body = json.dumps({"path": path, "args": args}).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type":"application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())

print("=== Totais por Unidade ===")
d = query("dashboard:getTotaisPorUnidade", {"cpf": "26034202833"})
print(json.dumps(d, indent=2, ensure_ascii=False)[:2000])

print()
print("=== 5 primeiras viaturas ===")
d = query("viaturas:list", {"cpf": "26034202833"})
for v in d.get("value", [])[:5]:
    print(f"  {v.get('prefixo'):<10} {v.get('tipo'):<3} {v.get('categoria'):<12} {v.get('marcaModelo'):<25} ativo={v.get('ativo')}")
print(f"  ... total: {len(d.get('value', []))} viaturas")
