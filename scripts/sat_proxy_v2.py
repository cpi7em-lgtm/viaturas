#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SAT proxy v2 - corrige hostname"""
import sys, io, re, json, urllib.request
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
from http.server import BaseHTTPRequestHandler, HTTPServer
import ssl

SAT_URL = "https://sistemasadmin.intranet.policiamilitar.sp.gov.br/sat/consultaReply.asp"
SAT_HOST = "sistemasadmin.intranet.policiamilitar.sp.gov.br"

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
            "Host": SAT_HOST,
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
    # Pega o trecho entre "OPM Atual" e "Dados da Habilita\u00e7\u00e3o"
    m_bloco = re.search(r"OPM Atual\s+(.*?)\s+Dados da Habilita", texto)
    if not m_bloco:
        return {"encontrado": False, "erro": "Bloco não encontrado", "texto_completo": texto}
    pm_opm = m_bloco.group(1).strip()
    # pm_opm = "CABO PM MICHEL WILLIAM DE MORAES CPI-7 (607002140)"
    # Pega code SIAFEM (9 digitos)
    m_code = re.search(r"\((\d{9})\)", pm_opm)
    opm_code = m_code.group(1) if m_code else ""
    # Remove o code SIAFEM pra separar posto/nome/opm
    sem_code = re.sub(r"\s*\(\d{9}\)\s*", " ", pm_opm).strip()
    # sem_code = "CABO PM MICHEL WILLIAM DE MORAES CPI-7"
    # Pega posto (terminado em PM)
    m_posto = re.match(r"^([A-Z][A-Z\s/]+?PM)\s+(.+)$", sem_code)
    posto = ""
    nome = sem_code
    opm = ""
    if m_posto:
        posto = m_posto.group(1).strip()
        resto = m_posto.group(2).strip()
        # resto = "MICHEL WILLIAM DE MORAES CPI-7" (ou só nome se não tiver opm)
        # OPM é o ULTIMO token (geralmente CPI-X, BPM/I, BAEP)
        m_opm = re.search(r"\s+([A-Z][A-Z0-9/\u00ba\u00aa\-]+)$", resto)
        if m_opm:
            opm = m_opm.group(1).strip()
            nome = resto[:m_opm.start()].strip()
        else:
            nome = resto
    m_cat = re.search(r"\b([A-D]{1,2})\s+BOL", texto, re.IGNORECASE)
    cnh = m_cat.group(1) if m_cat else ""
    m_bol = re.search(r"BOL\.\s*([\w\-\.]+)", texto, re.IGNORECASE)
    boletim = m_bol.group(1) if m_bol else ""
    m_data = re.search(r"(\d{2}/\d{2}/\d{4})", texto)
    data_prova = m_data.group(1) if m_data else ""
    # cassada: depois do campo "Cassada", "Sim" = true, "N\u00e3o" = false
    m_cassada = re.search(r"Cassada\s*(Sim|N\u00e3o|N\u00c3o)", texto, re.IGNORECASE)
    cassada = bool(m_cassada and m_cassada.group(1).lower().startswith("sim"))
    return {
        "encontrado": True,
        "re": re_num,
        "postoGraduacao": posto,
        "nome": nome,
        "opm": opm,
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
    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    port = 8765
    server = HTTPServer(("0.0.0.0", port), Handler)
    print(f"SAT proxy on :{port}", flush=True)
    server.serve_forever()
