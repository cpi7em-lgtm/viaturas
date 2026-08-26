#!/bin/bash
# ============================================================
# SETUP - Sistema de Viaturas CPI-7
# ============================================================
# Roda 1x no server pra subir a infra nova
# NAO TOCA no /opt/convex/ (Materiais)
# Cria /opt/convex-viaturas/ do zero
#
# Como rodar:
#   chmod +x setup-viaturas.sh
#   ./setup-viaturas.sh
# ============================================================

set -e

echo "============================================================"
echo "SETUP - Sistema de Viaturas CPI-7"
echo "============================================================"
echo ""
echo "ATENCAO: este script cria a infra em /opt/convex-viaturas/"
echo "          NAO mexe em /opt/convex/ (Materiais)"
echo ""

# Pede sudo via askpass
SUDO='SUDO_ASKPASS=/opt/askpass-sudo.sh sudo -A'

# 1. Cria estrutura de pastas
echo "[1/6] Criando /opt/convex-viaturas/ ..."
$SUDO mkdir -p /opt/convex-viaturas/{auth-api,dist,data,storage}
$SUDO chown -R pm:pm /opt/convex-viaturas

# 2. Copia arquivos de config (este script roda do diretorio onde os arquivos estao)
echo "[2/6] Copiando arquivos de config..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# auth-api: Dockerfile + auth_api_viaturas.py
$SUDO cp "$SCRIPT_DIR/auth-api/Dockerfile" /opt/convex-viaturas/auth-api/
$SUDO cp "$SCRIPT_DIR/auth-api/auth_api_viaturas.py" /opt/convex-viaturas/auth-api/

# docker-compose
$SUDO cp "$SCRIPT_DIR/docker-compose-viaturas.yml" /opt/convex-viaturas/docker-compose.yml

# nginx config
$SUDO cp "$SCRIPT_DIR/nginx-viaturas.conf" /opt/convex-viaturas/nginx.conf

# Permissoes
$SUDO chown -R pm:pm /opt/convex-viaturas
$SUDO chmod 755 /opt/convex-viaturas
$SUDO chmod 644 /opt/convex-viaturas/*.conf /opt/convex-viaturas/*.yml
$SUDO chmod 644 /opt/convex-viaturas/auth-api/*

# 3. Valida arquivos copiados
echo "[3/6] Validando arquivos..."
ls -la /opt/convex-viaturas/
echo "---"
ls -la /opt/convex-viaturas/auth-api/
echo "---"
[ -f /opt/convex-viaturas/docker-compose-viaturas.yml ] || { echo "ERRO: docker-compose-viaturas.yml nao encontrado"; exit 1; }
[ -f /opt/convex-viaturas/nginx-viaturas.conf ] || { echo "ERRO: nginx-viaturas.conf nao encontrado"; exit 1; }
[ -f /opt/convex-viaturas/auth-api/Dockerfile ] || { echo "ERRO: Dockerfile nao encontrado"; exit 1; }
[ -f /opt/convex-viaturas/auth-api/auth_api_viaturas.py ] || { echo "ERRO: auth_api_viaturas.py nao encontrado"; exit 1; }
echo "OK, todos os arquivos estao no lugar"

# 4. Build do auth-api
echo "[4/6] Building auth-api Docker image..."
cd /opt/convex-viaturas
$SUDO docker build -t convex-auth-api-viaturas ./auth-api/ 2>&1 | tail -20

# 5. Sobe os containers
echo "[5/6] Subindo containers (docker compose up -d)..."
$SUDO docker compose -f docker-compose-viaturas.yml up -d 2>&1 | tail -30

# 6. Valida que tá funcionando
echo "[6/6] Validando..."
sleep 5  # espera 5s pra containers inicializarem

echo "--- docker ps ---"
$SUDO docker ps | grep -E "(viaturas|convex-nginx-viaturas)"

echo ""
echo "--- curl localhost:8081/health ---"
curl -sS http://localhost:8081/health 2>&1 || echo "FAIL: nginx nao respondeu"

echo ""
echo "--- curl localhost:8002/api/health (auth-api direto) ---"
curl -sS http://localhost:8002/api/health 2>&1 || echo "FAIL: auth-api nao respondeu"

echo ""
echo "============================================================"
echo "SETUP COMPLETO!"
echo "============================================================"
echo ""
echo "Acesse: http://10.36.177.138:8081/"
echo "API:    http://10.36.177.138:8081/api/health"
echo ""
echo "Proximos passos:"
echo "  1. Deploy do bundle React: ver scripts/deploy.sh"
echo "  2. Deploy do Convex: cd /opt/convex-viaturas/convex && npx convex deploy"
echo ""
echo "Log do auth-api:"
echo "  $SUDO docker logs auth-api-viaturas -f"
echo "============================================================"
