#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Faz auth-api chamar SAT direto (com SSL desabilitado pra intranet)"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

def run(ssh, cmd, timeout=60, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)
sftp = ssh.open_sftp()

with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'r') as f:
    content = f.read().decode('utf-8', errors='replace')

# Reverte pro SAT direto
old1 = '''# SAT proxy local (corre no host na porta 8765) - evita problemas de SSL/DNS do container
# Container chama via http://host.docker.internal:8765 (ou IP do host)
SAT_PROXY_URL = "http://host.docker.internal:8765/sat/consulta"'''
new1 = '''# SAT direto (intranet confiavel - desabilita verificação SSL)
SAT_URL = "https://sistemasadmin.intranet.policiamilitar.sp.gov.br/sat/consultaReply.asp"
SAT_HOST = "sistemasadmin.intranet.policiamilitar.sp.gov.br"
# Desabilita verificação SSL (cert auto-assinado da intranet)
import ssl as _ssl
_ssl._create_default_https_context = _ssl._create_unverified_context'''

if old1 in content:
    content = content.replace(old1, new1, 1)
    print("URL trocada")
else:
    print("URL antiga não encontrada")

# Reverte a chamada
old2 = '''    # Chama o SAT proxy local (corre no host, evita SSL/DNS do container)
    req = urllib.request.Request(
        f"{SAT_PROXY_URL}?re={urllib.parse.quote(re)}",
        headers={"Accept": "application/json"},
        method="GET",
    )'''
new2 = '''    data = f"re={re}".encode("iso-8859-1")
    req = urllib.request.Request(
        SAT_URL, data=data,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": SAT_HOST,
        },
        method="POST",
    )'''

if old2 in content:
    content = content.replace(old2, new2, 1)
    print("Chamada trocada")
else:
    print("Chamada antiga não encontrada")

# Ajusta o parser pra parsear bem o HTML do SAT
old3 = '''    if "Dados do Policial Militar" not in body:
        return {"encontrado": False, "erro": "PM não encontrado no SAT"}

    # Verifica se o SOAP retornou dados REAIS (senao CPD devolve vazio pra qualquer CPF)
    re_real = str(pm_data.get("re", "")).strip()
    nome_real = str(pm_data.get("nome", "")).strip()
    dn = str(pm_data.get("dataNascimento", ""))
    if (not re_real or re_real == "0"
        or not nome_real or nome_real.lower() == "none"
        or dn.startswith("0001-")):
        raise HTTPException(404, "PM não encontrado (CPD retornou dados vazios)")'''
# Esse é do buscar-cpf, não mexer aqui. Vou só ajustar o parser SAT

with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
    f.write(content)
print("auth-api patch salvo")

# Restart
out = run(ssh, f"{SUDO} docker restart auth-api-viaturas 2>&1")
print(f"restart: {out}")
time.sleep(5)

# Testa direto via docker exec
print()
print("[Teste direto do container]")
test_script = '''import urllib.request, ssl
ssl._create_default_https_context = ssl._create_unverified_context
data = "re=111926".encode("iso-8859-1")
req = urllib.request.Request("https://sistemasadmin.intranet.policiamilitar.sp.gov.br/sat/consultaReply.asp", data=data, headers={"User-Agent":"Mozilla/5.0","Content-Type":"application/x-www-form-urlencoded","Host":"sistemasadmin.intranet.policiamilitar.sp.gov.br"}, method="POST")
try:
    with urllib.request.urlopen(req, timeout=15) as r:
        body = r.read().decode("iso-8859-1", errors="replace")
        if "Dados do Policial Militar" in body:
            import re
            m = re.search(r"Dados do Policial Militar(.*?)ATEN", body, re.DOTALL)
            if m:
                texto = re.sub(r"<[^>]+>", " ", m.group(1))
                texto = re.sub(r"\\\\s+", " ", texto).strip()
                print("OK:", texto[:400])
            else:
                print("Bloco não encontrado")
        else:
            print("Nao encontrado")
except Exception as e:
    print("ERR:", e)
'''
with sftp.file('/tmp/test_sat_docker.py', 'w') as f:
    f.write(test_script)
sftp.chmod('/tmp/test_sat_docker.py', 0o755)
sftp.close()
out = run(ssh, f"{SUDO} docker exec auth-api-viaturas python3 -c \"exec(open('/tmp/test_sat_docker.py').read())\"", timeout=30)
print(out)

ssh.close()
