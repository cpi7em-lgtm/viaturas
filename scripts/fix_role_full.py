#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SCP pm_auth.ts, redeploy, ajusta login/buscar-cpf pra usar user completo"""
import sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import paramiko, os, re

HOST = "10.36.177.138"
USER = "pm"
PASS = "11192655"
SUDO = "SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A"
CONVEX_BIN = "/opt/convex-viaturas/convex/node_modules/.bin/convex"
SECRET = "pmesp-import-2026"

def run(ssh, cmd, timeout=120, get_pty=False):
    si, so, se = ssh.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    return so.read().decode(errors='replace').strip()

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)
    sftp = ssh.open_sftp()

    # 1. SCP pm_auth.ts
    local = r"D:\USER\DESKTOPP\excel\viaturas\convex\pm_auth.ts"
    remote = "/opt/convex-viaturas/convex/pm_auth.ts"
    sftp.put(local, remote)
    sftp.close()
    print(f"SCP: {os.path.getsize(local)} bytes -> {remote}")

    # 2. Re-deploy Convex
    print("\n[2] convex deploy...")
    out = run(ssh, f"""bash -c 'cd /opt/convex-viaturas && export CONVEX_TMPDIR=/home/pm/.convex-tmp && {CONVEX_BIN} deploy --yes --typecheck disable --codegen enable 2>&1 | tail -20'""", timeout=180)
    print(out[-2000:])

    # 3. Edita login_soap: usa sync_res["value"]["user"] (ja completo)
    print("\n[3] Ajusta login_soap pra usar user do Convex")
    sftp = ssh.open_sftp()
    with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'r') as f:
        content = f.read().decode('utf-8', errors='replace')
    sftp.close()

    # Substitui o bloco do patch anterior (FIX busca user completo) por uma versao
    # que usa o user do sync_res direto (mais confiavel)
    old_block = '''    # FIX (William 2026-08-07): busca user COMPLETO do Convex (com viaturasRole)
    # pm_data do SOAP não tem viaturasRole/unidadesGestor/Editor - sem isso,
    # o frontend sempre ve "aguardando promocao" mesmo se já foi promovido.
    try:
        all_users_res = convex_query("pm_auth:listAll", {"secret": "pmesp-import-2026"})
        if isinstance(all_users_res, dict) and "value" in all_users_res:
            for u in all_users_res["value"]:
                if u.get("cpf") == cpf:
                    for k in ("viaturasRole", "unidadesGestor", "unidadesEditor", "unit", "opmCode"):
                        if k in u and u[k] is not None:
                            pm_data[k] = u[k]
                    if "_id" in u and not convex_user_id:
                        convex_user_id = u["_id"]
                    print(f"[viaturas-auth] user completo: viaturasRole={pm_data.get('viaturasRole')} unidGestor={pm_data.get('unidadesGestor')}")
                    break
    except Exception as e:
        print(f"[viaturas-auth] WARN: não conseguiu buscar user completo: {e}")

    # Garante que pm_data tem role correto
    pm_data["role"] = role
    if not pm_data.get("viaturasRole"):
        # Fallback: admin master se for ADMIN_CPFS, senao viewer
        pm_data["viaturasRole"] = "admin" if cpf in ADMIN_CPFS else "viewer"'''
    new_block = '''    # FIX (William 2026-08-07): usa user COMPLETO retornado pelo createOrUpdatePMUser
    # (pm_data do SOAP não tem viaturasRole, mas o Convex retorna o user com o role)
    if sync_res and isinstance(sync_res, dict) and sync_res.get("status") == "success":
        v = sync_res.get("value", {})
        if isinstance(v, dict) and "user" in v and isinstance(v["user"], dict):
            u = v["user"]
            # Sobrescreve campos de role (vindos do Convex, atualizados)
            if u.get("viaturasRole"):
                pm_data["viaturasRole"] = u["viaturasRole"]
            if u.get("role"):
                pm_data["role"] = u["role"]
            if u.get("unidadesGestor"):
                pm_data["unidadesGestor"] = u["unidadesGestor"]
            if u.get("unidadesEditor"):
                pm_data["unidadesEditor"] = u["unidadesEditor"]
            print(f"[viaturas-auth] user do Convex: viaturasRole={pm_data.get('viaturasRole')} role={pm_data.get('role')}")
        elif "user" in v and v["user"] is None:
            print(f"[viaturas-auth] WARN: Convex retornou user=None (esperado em user novo)")

    # Fallback se não tem viaturasRole
    if not pm_data.get("viaturasRole"):
        pm_data["viaturasRole"] = "admin" if cpf in ADMIN_CPFS else "viewer"'''

    if old_block in content:
        content = content.replace(old_block, new_block, 1)
        sftp = ssh.open_sftp()
        with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
            f.write(content)
        sftp.close()
        print("Login patch OK")
    else:
        print("Login patch NAO encontrado - já foi aplicado ou outro estado")

    # 4. Edita buscar-cpf pra usar user do Convex
    print("\n[4] Ajusta buscar-cpf pra retornar user completo")
    sftp = ssh.open_sftp()
    with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'r') as f:
        content = f.read().decode('utf-8', errors='replace')
    sftp.close()

    old_b = '''    sync_res = convex_mutation("pm_auth:createOrUpdatePMUser", {
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
    }'''
    new_b = '''    sync_res = convex_mutation("pm_auth:createOrUpdatePMUser", {
        "secret": "pmesp-import-2026",
        "pm": pm_filtered,
    })
    if sync_res.get("status") != "success":
        raise HTTPException(500, f"Convex sync: {sync_res.get('errorMessage', sync_res)}")

    v = sync_res.get("value", {})
    user_full = v.get("user") or {}
    # Retorna o user do CONVEX (com role/viaturasRole) NAO o pm_filtered (so SOAP)
    return {
        "ok": True,
        "pm": user_full if user_full else pm_filtered,
        "jaExiste": not v.get("created", False),
        "userId": v.get("userId"),
    }'''

    if old_b in content:
        content = content.replace(old_b, new_b, 1)
        sftp = ssh.open_sftp()
        with sftp.file('/opt/convex-viaturas/auth-api/auth_api_viaturas.py', 'w') as f:
            f.write(content)
        sftp.close()
        print("Buscar-cpf patch OK")
    else:
        print("Buscar-cpf patch NAO encontrado")

    # 5. Restart auth-api
    print("\n[5] Restart auth-api")
    out = run(ssh, f"{SUDO} docker restart auth-api-viaturas 2>&1")
    print(out)
    time.sleep(5)

    # 6. Testa
    print("\n[6] Testa /api/admin/buscar-cpf com William")
    out = run(ssh, 'curl -s -X POST http://localhost:8081/api/admin/buscar-cpf -H "Content-Type: application/json" -d \'{"secret":"pmesp-import-2026","cpf":"26034202833"}\' 2>&1')
    print(out[:600])

    ssh.close()

if __name__ == "__main__":
    main()
