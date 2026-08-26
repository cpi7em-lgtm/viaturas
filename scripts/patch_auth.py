#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Patch certo no auth-api"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"

# Patch exato (8 espacos de indent)
OLD = '    # Garante que pm_data tem role correto (mesmo que promoteUser não exista)\r\n    pm_data["role"] = role'
NEW = '''    # FIX (William 2026-08-07): busca user COMPLETO do Convex (com viaturasRole)\r\n    # pm_data do SOAP não tem viaturasRole/unidadesGestor/Editor - sem isso,\r\n    # o frontend sempre ve "aguardando promocao" mesmo se já foi promovido.\r\n    try:\r\n        all_users_res = convex_query("pm_auth:listAll", {"secret": "pmesp-import-2026"})\r\n        if isinstance(all_users_res, dict) and "value" in all_users_res:\r\n            for u in all_users_res["value"]:\r\n                if u.get("cpf") == cpf:\r\n                    for k in ("viaturasRole", "unidadesGestor", "unidadesEditor", "unit", "opmCode"):\r\n                        if k in u and u[k] is not None:\r\n                            pm_data[k] = u[k]\r\n                    if "_id" in u and not convex_user_id:\r\n                        convex_user_id = u["_id"]\r\n                    print(f"[viaturas-auth] user completo: viaturasRole={pm_data.get('viaturasRole')} unidGestor={pm_data.get('unidadesGestor')}")\r\n                    break\r\n    except Exception as e:\r\n        print(f"[viaturas-auth] WARN: não conseguiu buscar user completo: {e}")\r\n\r\n    # Garante que pm_data tem role correto\r\n    pm_data["role"] = role\r\n    if not pm_data.get("viaturasRole"):\r\n        # Fallback: admin master se for ADMIN_CPFS, senao viewer\r\n        pm_data["viaturasRole"] = "admin" if cpf in ADMIN_CPFS else "viewer"'''

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

    if OLD in content:
        content = content.replace(OLD, NEW, 1)
        sftp = ssh.open_sftp()
        with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
            f.write(content)
        sftp.close()
        print("OK: patch aplicado")
    else:
        # Mostra o trecho pra debug
        idx = content.find('# Garante que pm_data tem role')
        if idx >= 0:
            print("Trecho real no arquivo:")
            print(repr(content[idx:idx+200]))
        else:
            print("NAO ENCONTREI o trecho")

    # Restart
    print("Restart auth-api...")
    out = run(ssh, f"{SUDO} docker restart auth-api-viaturas 2>&1")
    print(out)
    time.sleep(5)

    print("\n[1] /api/health")
    print("  " + run(ssh, "curl -s http://localhost:8081/api/health 2>&1"))

    ssh.close()

if __name__ == "__main__":
    main()
