#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Reescreve o endpoint /api/admin/buscar-cpf corrigido"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko
import re

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

NEW_ENDPOINT = '''

# Whitelist dos campos aceitos pelo validator do Convex pm_auth:createOrUpdatePMUser
PM_FIELDS = {"cpf", "re", "digre", "nome", "guerra", "ptgr", "codptgr",
             "unidade", "opm", "sexo", "dataNascimento", "email", "telefone", "role"}


@app.post("/api/admin/buscar-cpf")
async def admin_buscar_cpf(body: dict):
    """Admin busca PM por CPF via SOAP CPD e cria/atualiza no Convex.
    Body: { secret: str, cpf: str }
    Retorna: { ok, pm: {...}, jaExiste: bool, userId?: str }
    """
    if body.get("secret", "") != "pmesp-import-2026":
        raise HTTPException(403, "Bad secret")
    cpf = str(body.get("cpf", "")).replace(".", "").replace("-", "").strip()
    if not cpf or len(cpf) != 11 or not cpf.isdigit():
        raise HTTPException(400, "CPF invalido")

    pm_elem = busca_pm_por_cpf(cpf)
    if pm_elem is None:
        raise HTTPException(404, "PM não encontrado no CPD")
    pm_data = extract_pm_data(pm_elem, cpf=cpf)
    if not pm_data:
        raise HTTPException(500, "Erro ao extrair dados do PM")

    # Valida que o SOAP retornou dados REAIS (senao CPD devolve vazio pra qualquer CPF)
    re_real = str(pm_data.get("re", "")).strip()
    nome_real = str(pm_data.get("nome", "")).strip()
    dn = str(pm_data.get("dataNascimento", ""))
    if (not re_real or re_real == "0"
        or not nome_real or nome_real.lower() == "none"
        or dn.startswith("0001-")):
        raise HTTPException(404, "PM não encontrado (CPD retornou dados vazios)")

    # Filtra apenas campos aceitos pelo Convex (drop extras tipo ptgr_descricao)
    pm_filtered = {k: v for k, v in pm_data.items() if k in PM_FIELDS}

    sync_res = convex_mutation("pm_auth:createOrUpdatePMUser", {
        "secret": "pmesp-import-2026",
        "pm": pm_filtered,
    })
    if sync_res.get("status") != "success":
        raise HTTPException(500, f"Convex sync: {sync_res.get('errorMessage', sync_res)}")

    return {
        "ok": True,
        "pm": pm_filtered,
        "jaExiste": not sync_res["value"].get("created", False),
        "userId": sync_res["value"].get("userId"),
    }


'''

def run(ssh, cmd, timeout=30, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)
    sftp = ssh.open_sftp()

    # Le arquivo
    with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'r') as f:
        content = f.read().decode('utf-8', errors='replace')
    sftp.close()

    # Remove QUALQUER versão antiga do endpoint (do add_buscar_cpf.py anterior)
    # Marca: "/api/admin/buscar-cpf"  até "if __name__"
    pattern = re.compile(r'# Whitelist dos campos.*?if __name__ == "__main__":', re.DOTALL)
    if pattern.search(content):
        new_content = pattern.sub('if __name__ == "__main__":', content)
        print("Versao antiga removida")
    else:
        # Tenta remover a versão errada (sem whitelist)
        pattern2 = re.compile(r'@app\.post\("/api/admin/buscar-cpf"\).*?if __name__ == "__main__":', re.DOTALL)
        if pattern2.search(content):
            new_content = pattern2.sub('if __name__ == "__main__":', content)
            print("Versao antiga (sem whitelist) removida")
        else:
            new_content = content
            print("Nenhuma versão antiga encontrada (talvez já foi limpa)")

    # Adiciona o novo antes do if __name__
    marker = 'if __name__ == "__main__":'
    if marker in new_content:
        new_content = new_content.replace(marker, NEW_ENDPOINT + '\n\n' + marker, 1)
    else:
        new_content = new_content + '\n' + NEW_ENDPOINT

    sftp = ssh.open_sftp()
    with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
        f.write(new_content)
    sftp.close()
    print("Endpoint corrigido escrito")

    # Restart
    print("Restart auth-api-viaturas...")
    out = run(ssh, f"{SUDO} docker restart auth-api-viaturas 2>&1")
    print(out)
    time.sleep(5)

    # Testes
    print("\n[1] health")
    print("  " + run(ssh, "curl -s http://localhost:8081/api/health 2>&1"))

    print("\n[2] William (CPF 26034202833) - deve trazer dados REAIS")
    out = run(ssh, "curl -s -X POST http://localhost:8081/api/admin/buscar-cpf -H 'Content-Type: application/json' -d '{\"secret\":\"pmesp-import-2026\",\"cpf\":\"26034202833\"}'")
    print(f"  {out[:600]}")

    print("\n[3] CPF fake (12345678901) - deve 404")
    out = run(ssh, "curl -s -X POST http://localhost:8081/api/admin/buscar-cpf -H 'Content-Type: application/json' -d '{\"secret\":\"pmesp-import-2026\",\"cpf\":\"12345678901\"}'")
    print(f"  {out[:300]}")

    print("\n[4] outro CPF real de PM (11111111111) - pode 404 se não existir")
    out = run(ssh, "curl -s -X POST http://localhost:8081/api/admin/buscar-cpf -H 'Content-Type: application/json' -d '{\"secret\":\"pmesp-import-2026\",\"cpf\":\"11111111111\"}'")
    print(f"  {out[:300]}")

    print("\n[5] Sem secret - 403")
    out = run(ssh, "curl -s -X POST http://localhost:8081/api/admin/buscar-cpf -H 'Content-Type: application/json' -d '{\"secret\":\"errado\",\"cpf\":\"26034202833\"}'")
    print(f"  {out[:300]}")

    ssh.close()

if __name__ == "__main__":
    main()
