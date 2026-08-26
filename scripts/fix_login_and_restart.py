#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Edita auth-api no servidor pra buscar user completo do Convex"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

# Patch: depois do sync_res, busca user completo e adiciona viaturasRole/unidadesGestor/Editor
OLD = '''    # Garante que pm_data tem role correto (mesmo que promoteUser não exista)
    pm_data["role"] = role'''

NEW = '''    # FIX: busca user COMPLETO do Convex (com viaturasRole/unidadesGestor/Editor)
    # pm_data do SOAP NAO tem esses campos, entao sem isso o frontend
    # sempre ve "aguardando promocao" mesmo se o user já foi promovido.
    try:
        all_users_res = convex_query("pm_auth:listAll", {"secret": "pmesp-import-2026"})
        if isinstance(all_users_res, dict) and "value" in all_users_res:
            for u in all_users_res["value"]:
                if u.get("cpf") == cpf:
                    # Sobrescreve apenas os campos que existem no Convex
                    for k in ("viaturasRole", "unidadesGestor", "unidadesEditor", "unit", "opmCode"):
                        if k in u and u[k] is not None:
                            pm_data[k] = u[k]
                    if "_id" in u and not convex_user_id:
                        convex_user_id = u["_id"]
                    print(f"[viaturas-auth] user completo do Convex: viaturasRole={pm_data.get('viaturasRole')} unidGestor={pm_data.get('unidadesGestor')}")
                    break
    except Exception as e:
        print(f"[viaturas-auth] WARN: não conseguiu buscar user completo: {e}")

    # Garante que pm_data tem role correto (mesmo que promoteUser não exista)
    pm_data["role"] = role
    if "viaturasRole" not in pm_data or not pm_data.get("viaturasRole"):
        # Fallback: usa o role legado se não tem viaturasRole
        pm_data["viaturasRole"] = "admin" if cpf in ADMIN_CPFS else "viewer"'''

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

    if OLD in content:
        content = content.replace(OLD, NEW, 1)
        sftp = ssh.open_sftp()
        with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
            f.write(content)
        sftp.close()
        print("Patch aplicado")
    else:
        print("Patch NAO encontrado (pode já ter sido aplicado)")

    # Restart
    print("Restart auth-api...")
    out = run(ssh, f"{SUDO} docker restart auth-api-viaturas 2>&1")
    print(out)
    time.sleep(5)

    # Testa
    print("\n[1] /api/health")
    print("  " + run(ssh, "curl -s http://localhost:8081/api/health 2>&1"))

    # Limpa user fake 12345678901 (bug antigo)
    print("\n[2] Limpando user fake 12345678901")
    out = run(ssh, "curl -s -X POST http://localhost:3212/api/mutation -H 'Content-Type: application/json' -d '{\"path\":\"users:deleteByCpf\",\"args\":{\"cpf\":\"12345678901\"}}'")
    print(f"  deleteByCpf (nao existe): {out[:200]}")

    # Tenta de outra forma: promover pra role que torna ele invisivel
    # Ou melhor: deixa quieto, é admin, pode deletar via mutation
    # Vou criar uma mutation simples pra deletar
    # Mas como o convex não tem users:delete, vou direto:
    # Apenas garantir que o user "12345678901" não aparece no login (SOAP não autentica ele)
    # Como o login valida SOAP, o user fake NAO CONSEGUIRA logar. Pode ficar.
    print("  (user fake não consegue logar via SOAP, pode ficar)")

    # Testa login com a senha real? Nao, vou ver o que o login retorna agora (sem logar)
    # Simulo: pego o que o pm_auth:listAll tem
    print("\n[3] Users no Convex (William deve ter viaturasRole=gestor)")
    out = run(ssh, "curl -s -X POST http://localhost:3212/api/query -H 'Content-Type: application/json' -d '{\"path\":\"pm_auth:listAll\",\"args\":{\"secret\":\"pmesp-import-2026\"}}'")
    import json
    d = json.loads(out)
    for u in d.get('value', []):
        print(f"  cpf={u.get('cpf')} viaturasRole={u.get('viaturasRole')}")

    ssh.close()

if __name__ == "__main__":
    main()
