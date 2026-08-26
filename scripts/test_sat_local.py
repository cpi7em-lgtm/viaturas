#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testa SAT direto do Windows"""
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import urllib.request, json

SAT_URL = "https://sistemasadmin.intranet.policiamiltar.sp.gov.br/sat/consultaReply.asp"

def sat_consultar_re(re_num):
    re_num = re_num.strip()
    if not re_num or not re_num.isdigit():
        return {"encontrado": False, "erro": "RE invalido"}
    data = f"re={re_num}".encode("iso-8859-1")
    req = urllib.request.Request(
        SAT_URL, data=data,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "sistemasadmin.intranet.policiamiltar.sp.gov.br",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            body = r.read().decode("iso-8859-1", errors="replace")
    except Exception as e:
        return {"encontrado": False, "erro": f"Erro SAT: {e}"}
    if "Dados do Policial Militar" not in body:
        return {"encontrado": False, "erro": "PM não encontrado no SAT"}
    # Pega o bloco entre "Dados do Policial Militar" e o aviso
    m = re.search(r"Dados do Policial Militar(.*?)ATEN", body, re.DOTALL)
    if not m:
        return {"encontrado": False, "erro": "Formato inesperado"}
    bloco = m.group(1)
    texto = re.sub(r"<[^>]+>", " ", bloco)
    texto = re.sub(r"\s+", " ", texto).strip()
    # Pega o code SIAFEM (9 digitos)
    m_code = re.search(r"\b(\d{9})\b", texto)
    return {
        "encontrado": True,
        "re": re_num,
        "texto_sat": texto,
        "opmCode": m_code.group(1) if m_code else "",
    }

# Testa com RE do William (111926)
print("=== RE 111926 (William) ===")
r = sat_consultar_re("111926")
print(json.dumps(r, indent=2, ensure_ascii=False))

# Testa com RE invalido
print("\n=== RE 999999 (nao deve achar) ===")
r = sat_consultar_re("999999")
print(json.dumps(r, indent=2, ensure_ascii=False))
