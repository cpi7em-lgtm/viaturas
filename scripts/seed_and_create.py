#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Consertar seed e criar William"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SECRET = "pmesp-import-2026"

# Script seed CONSERTADO (omit parentUnit quando null)
SEED_SCRIPT = '''#!/usr/bin/env python3
import urllib.request
import urllib.error
import json
import sys

CONVEX_URL = "http://localhost:3212"

UNIDADES = [
    {"code": "607000000", "sigla": "CPI-7",   "name": "CPI-7",                      "parentCode": None},
    {"code": "607070000", "sigla": "7BPMI",   "name": "7o BPM/I",                   "parentCode": "607000000"},
    {"code": "607120000", "sigla": "12BPMI",  "name": "12o BPM/I",                  "parentCode": "607000000"},
    {"code": "607140000", "sigla": "14BAEP",  "name": "14o BAEP",                   "parentCode": "607000000"},
    {"code": "607220000", "sigla": "22BPMI",  "name": "22o BPM/I",                  "parentCode": "607000000"},
    {"code": "607400000", "sigla": "40BPMI",  "name": "40o BPM/I",                  "parentCode": "607000000"},
    {"code": "607500000", "sigla": "50BPMI",  "name": "50o BPM/I",                  "parentCode": "607000000"},
    {"code": "607530000", "sigla": "53BPMI",  "name": "53o BPM/I",                  "parentCode": "607000000"},
    {"code": "607540000", "sigla": "54BPMI",  "name": "54o BPM/I",                  "parentCode": "607000000"},
    {"code": "607550000", "sigla": "55BPMI",  "name": "55o BPM/I",                  "parentCode": "607000000"},
]


def call_mutation(name, args):
    url = f"{CONVEX_URL}/api/mutation"
    body = json.dumps({"path": name, "args": args}).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read())
    except urllib.error.URLError as e:
        return {"error": str(e)}


def main():
    matrix_ids = {}
    print("[1/2] Populando matrizes...")
    for u in UNIDADES:
        if u["parentCode"] is not None:
            continue
        # OMITIR parentUnit quando null (v.optional não aceita null, só undefined)
        args = {
            "code": u["code"],
            "name": u["name"],
            "sigla": u["sigla"],
            "active": True,
        }
        res = call_mutation("units:upsert", args)
        if "value" in res:
            matrix_ids[u["code"]] = res["value"]
            print(f"  OK: {u['sigla']} ({u['code']}) -> {res['value']}")
        else:
            print(f"  ERRO: {u['sigla']} - {res}")

    print("\\n[2/2] Populando filhos...")
    for u in UNIDADES:
        if u["parentCode"] is None:
            continue
        parent_id = matrix_ids.get(u["parentCode"])
        if not parent_id:
            print(f"  ERRO: parent não encontrado para {u['sigla']}")
            continue
        res = call_mutation("units:upsert", {
            "code": u["code"],
            "name": u["name"],
            "sigla": u["sigla"],
            "parentUnit": parent_id,
            "active": True,
        })
        if "value" in res:
            print(f"  OK: {u['sigla']} ({u['code']}) -> {res['value']} (parent: {u['parentCode']})")
        else:
            print(f"  ERRO: {u['sigla']} - {res}")

    print("\\nDONE!")


if __name__ == "__main__":
    main()
'''

# Script pra criar William
CREATE_WILLIAM = '''#!/usr/bin/env python3
import urllib.request
import json

CONVEX_URL = "http://localhost:3212"
SECRET = "pmesp-import-2026"

def call_mut(name, args):
    url = f"{CONVEX_URL}/api/mutation"
    body = json.dumps({"path": name, "args": args}).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())

# 1. Cria William via pm_auth:createOrUpdatePMUser
print("[1/2] Criando William...")
res = call_mut("pm_auth:createOrUpdatePMUser", {
    "secret": SECRET,
    "pm": {
        "cpf": "26034202833",
        "re": "1119265",
        "digre": "5",
        "nome": "WILLIAM MICHEL",
        "guerra": "WILLIAM",
        "ptgr": "CB PM",
        "codptgr": "3",
        "opm": "607000140",  # CPI-7 (codigo SIAFEM)
        "sexo": "M",
        "email": "william@policiamilitar.sp.gov.br",
        "role": "admin",
    }
})
print(f"Resultado: {res}")

# 2. Garante viaturasRole = admin + unidadesGestor todas (cobre tudo)
print("\\n[2/2] Promovendo William a admin no Viaturas...")
res = call_mut("pm_auth:setViaturasRole", {
    "secret": SECRET,
    "cpf": "26034202833",
    "viaturasRole": "admin",
    "unidadesGestor": [],
    "unidadesEditor": [],
})
print(f"Resultado: {res}")
'''

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

    # 1. Sobe o seed consertado
    print("=" * 60)
    print("1. Sobe seed_units_v2.py (consertado)")
    print("=" * 60)
    with sftp.file('/tmp/seed_units_v2.py', 'w') as f:
        f.write(SEED_SCRIPT)
    sftp.chmod('/tmp/seed_units_v2.py', 0o755)
    sftp.close()
    out, _ = run(ssh, "python3 /tmp/seed_units_v2.py 2>&1", timeout=60)
    print(out)
    print()

    # 2. Verifica units
    print("=" * 60)
    print("2. Verifica units:list")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"units:list\",\"args\":{}}' 2>&1 | python3 -m json.tool 2>&1 | head -80")
    print(out)
    print()

    # 3. Cria William
    print("=" * 60)
    print("3. Cria William")
    print("=" * 60)
    sftp = ssh.open_sftp()
    with sftp.file('/tmp/create_william.py', 'w') as f:
        f.write(CREATE_WILLIAM)
    sftp.chmod('/tmp/create_william.py', 0o755)
    sftp.close()
    out, _ = run(ssh, "python3 /tmp/create_william.py 2>&1", timeout=30)
    print(out)
    print()

    # 4. Lista users
    print("=" * 60)
    print("4. Lista users")
    print("=" * 60)
    out, _ = run(ssh, "curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"pm_auth:listAll\",\"args\":{\"secret\":\"pmesp-import-2026\"}}' 2>&1 | python3 -m json.tool 2>&1 | head -50")
    print(out)

    ssh.close()

if __name__ == "__main__":
    main()
