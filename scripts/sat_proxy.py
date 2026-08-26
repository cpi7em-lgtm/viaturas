#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SAT proxy local - roda no HOST e expõe http://localhost:8765/sat/consulta
   O container auth-api-viaturas chama isso via http://host.docker.internal:8765"""
import sys, io, re, json, urllib.request
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
from http.server import BaseHTTPRequestHandler, HTTPServer
import ssl

SAT_URL = "https://sistemasadmin.intranet.policiamiltar.sp.gov.br/sat/consultaReply.asp"

# Desabilita verificação SSL (intranet confiavel)
ssl._create_default_https_context = ssl._create_unverified_context


def sat_consultar(re_num):
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
    m = re.search(r"Dados do Policial Militar(.*?)ATEN", body, re.DOTALL)
    if not m:
        return {"encontrado": False, "erro": "Formato inesperado"}
    bloco = m.group(1)
    texto = re.sub(r"<[^>]+>", " ", bloco)
    texto = re.sub(r"\s+", " ", texto).strip()
    # Tenta extrair campos
    m_posto = re.search(r"^([A-Z][A-Z\s/]+PM)\s+(.+?)\s+([A-Z][^<]+?)\s*(?:\(|$)", texto)
    if not m_posto:
        m_posto = re.search(r"^(.+?PM)\s+([A-Z\u00c0-\u00da][^()]+?)\s+\(", texto)
    posto = nome = ""
    if m_posto:
        posto = m_posto.group(1).strip()
        nome = m_posto.group(2).strip() if len(m_posto.groups()) >= 2 else m_posto.group(1).strip()
    m_code = re.search(r"\b(\d{9})\b", texto)
    opm_code = m_code.group(1) if m_code else ""
    # Categoria CNH
    m_cat = re.search(r"\b([A-D]{1,2})\s+BOL", texto, re.IGNORECASE)
    cnh = m_cat.group(1) if m_cat else ""
    m_bol = re.search(r"BOL\.\s*([\w\-\.]+)", texto, re.IGNORECASE)
    boletim = m_bol.group(1) if m_bol else ""
    m_data = re.search(r"(\d{2}/\d{2}/\d{4})", texto)
    data_prova = m_data.group(1) if m_data else ""
    cassada = "sim" in texto.lower() and "nao" not in texto.lower().split("cassada")[-1][:50]
    return {
        "encontrado": True,
        "re": re_num,
        "postoGraduacao": posto,
        "nome": nome,
        "opm": "",
        "opmCode": opm_code,
        "cnhCategoria": cnh,
        "boletim": boletim,
        "dataProva": data_prova,
        "cassada": cassada,
        "texto_completo": texto,
    }


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        from urllib.parse import urlparse, parse_qs
        q = parse_qs(urlparse(self.path).query)
        re_num = q.get("re", [""])[0]
        result = sat_consultar(re_num)
        body = json.dumps(result, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
        print(f"[sat] RE={re_num} -> encontrado={result.get('encontrado')}", flush=True)

    def log_message(self, format, *args):
        return  # silencia


if __name__ == "__main__":
    port = 8765
    server = HTTPServer(("0.0.0.0", port), Handler)
    print(f"SAT proxy listening on :{port}", flush=True)
    server.serve_forever()
