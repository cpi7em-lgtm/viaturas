#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Popula a tabela units do Convex Viaturas com as unidades do CPI-7.

 Após rodar o npx convex deploy, as tabelas existem mas estao vazias.
Este script faz um seed inicial das unidades conhecidas.

Roda 1x no SERVER (10.36.177.138):
  cd /tmp/viaturas-setup
  python3 seed_units.py
"""
import urllib.request
import urllib.error
import json
import sys

# Convex URL (host porta 3212 -> container 3210)
CONVEX_URL = "http://10.36.177.138:3212"

# Unidades a popular (raizes + sub-OPMs principais)
# code SIAFEM (9 digitos) + sigla + nome
UNIDADES = [
    # Matrizes principais
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
    # Primeiro, popula as matrizes (sem parent)
    matrix_ids = {}
    print("[1/2] Populando matrizes...")
    for u in UNIDADES:
        if u["parentCode"] is not None:
            continue
        args = {
            "code": u["code"],
            "name": u["name"],
            "sigla": u["sigla"],
            "active": True,
        }
        # OMITIR parentUnit quando None (v.optional só aceita undefined)
        res = call_mutation("units:upsert", args)
        if "value" in res:
            matrix_ids[u["code"]] = res["value"]
            print(f"  OK: {u['sigla']} ({u['code']}) -> {res['value']}")
        else:
            print(f"  ERRO: {u['sigla']} - {res}")

    # Segundo, popula os filhos (com parentId)
    print("\n[2/2] Populando filhos...")
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

    print("\nDONE!")


if __name__ == "__main__":
    main()
