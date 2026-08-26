#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Adiciona endpoint /api/sat/consulta na auth-api"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

NEW_ENDPOINT = '''

# URL do SAT (sistema de habilitacao de motoristas da PMESP)
SAT_URL = "https://sistemasadmin.intranet.policiamiltar.sp.gov.br/sat/consultaReply.asp"
SAT_HOST = "sistemasadmin.intranet.policiamiltar.sp.gov.br"


def sat_consultar_re(re: str) -> dict:
    """Consulta dados de habilitacao do PM pelo RE (sem digito verificador).
    Retorna dict com: encontrado, postoGraduacao, nome, opm, opmCode,
    cnhCategoria, boletim, dataProva, cassada.
    """
    import re as _re
    import urllib.request
    re = re.strip()
    if not re or not re.isdigit():
        return {"encontrado": False, "erro": "RE invalido"}

    data = f"re={re}".encode("iso-8859-1")
    req = urllib.request.Request(
        SAT_URL,
        data=data,
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
        return {"encontrado": False, "erro": f"Erro ao consultar SAT: {e}"}

    # Parse HTML: procura "Dados do Policial Militar" e extrai campos
    if "Dados do Policial Militar" not in body:
        return {"encontrado": False, "erro": "PM não encontrado no SAT"}

    # Extrai nome/pm (linha  após "Posto / Gradua\u00e7\u00e3o - Nome")
    m_nome = _re.search(r"Posto\s*/\s*Gradua\u00e7\u00e3o\s*-\s*Nome.*?>([^<]+)</td><td>([^<]+)</td>", body, _re.DOTALL)
    # Fallback: pega direto
    if not m_nome:
        # Tenta padrao alternativo
        m_posto = _re.search(r"<td[^>]*>([A-Z\u00c0-\u00da][A-Z\s/]+PM)\s+([A-Z\u00c0-\u00da][^<]+)</td>", body)
        m_opm = _re.search(r"\(([0-9]{9})\)", body)
        if m_posto:
            posto = m_posto.group(1).strip()
            nome = m_posto.group(2).strip()
            opm = m_opm.group(1) if m_opm else ""
        else:
            return {"encontrado": False, "erro": "Formato inesperado do SAT"}
    else:
        # O nome pode estar junto: "CABO PM NOME COMPLETO"
        # E opm tem o code entre parenteses
        full = m_nome.group(1).strip()
        opm_full = m_nome.group(2).strip()
        # Pega o code SIAFEM (9 digitos entre parenteses)
        m_code = _re.search(r"\(([0-9]{9})\)", opm_full)
        opm_code = m_code.group(1) if m_code else ""
        # Pega o nome da OPM (texto antes do code)
        opm_nome = _re.sub(r"\s*\([0-9]{9}\)\s*", "", opm_full).strip()
        # Separa posto do nome
        m_split = _re.match(r"^([A-Z][A-Z\s/]+PM)\s+(.+)$", full)
        if m_split:
            posto = m_split.group(1).strip()
            nome = m_split.group(2).strip()
        else:
            posto = ""
            nome = full

    # CNH
    m_cat = _re.search(r"Categoria</td><td[^>]*>([^<]+)</td>", body, _re.IGNORECASE)
    m_boletim = _re.search(r"N[u00fa]mero do Boletim</td><td[^>]*>([^<]+)</td>", body, _re.IGNORECASE)
    m_data = _re.search(r"Data da prova</td><td[^>]*>([^<]+)</td>", body, _re.IGNORECASE)
    m_cassada = _re.search(r"Cassada</td><td[^>]*>([^<]+)</td>", body, _re.IGNORECASE)

    return {
        "encontrado": True,
        "re": re,
        "postoGraduacao": posto,
        "nome": nome,
        "opm": opm_nome,
        "opmCode": opm_code,
        "cnhCategoria": m_cat.group(1).strip() if m_cat else "",
        "boletim": m_boletim.group(1).strip() if m_boletim else "",
        "dataProva": m_data.group(1).strip() if m_data else "",
        "cassada": (m_cassada.group(1).strip() if m_cassada else "").lower().startswith("sim"),
    }


@app.get("/api/sat/consulta")
async def sat_consulta(re: str = "", authorization: Optional[str] = Header(None)):
    """Consulta dados de habilitacao do PM pelo RE (SAT).
    Requer Bearer token (qualquer user logado).
    """
    token = bearer(authorization)
    if not token:
        raise HTTPException(401, "Token ausente")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(401, "Token invalido ou expirado")
    return sat_consultar_re(re)


'''

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)
    sftp = ssh.open_sftp()

    with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'r') as f:
        content = f.read().decode('utf-8', errors='replace')
    sftp.close()

    if 'sat_consultar_re' in content:
        print("Endpoint SAT já existe")
    else:
        marker = 'if __name__ == "__main__":'
        new_content = content.replace(marker, NEW_ENDPOINT + '\n\n' + marker, 1)
        sftp = ssh.open_sftp()
        with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
            f.write(new_content)
        sftp.close()
        print("Endpoint SAT adicionado")

    # Restart
    out = run(ssh, f"{SUDO} docker restart auth-api-viaturas 2>&1")
    print(f"restart: {out}")
    time.sleep(5)

    # Testa
    print("\n[1] health")
    print("  " + run(ssh, "curl -s http://localhost:8081/api/health 2>&1"))

    # Gera token valido pra teste
    print("\n[2] /api/sat/consulta?re=111926 (William)")
    out = run(ssh, "python3 -c \"\nimport sys\nsys.path.insert(0, '/opt/convex-viaturas/auth-api')\nimport os\nos.environ.setdefault('JWT_SECRET','viaturas-pmesp-cpi7-2026-secret')\nfrom auth_api_viaturas import make_token, sat_consultar_re\nimport time\ntok = make_token({'sub':'26034202833','iat':int(time.time()),'exp':int(time.time())+60,'pm':{'cpf':'26034202833'},'aud':'viaturas','app':'viaturas'})\nprint(tok)\n\" 2>&1")
    print(f"  token gerado: {out[:80]}...")

    ssh.close()

if __name__ == "__main__":
    main()
