#!/bin/bash
# build-vercel-output.sh
# Cria a estrutura `.vercel/output/` exigida pelo Build Output API v3
# apos o Vite build gerar frontend/dist
set -e

echo "[build-vercel-output] Criando .vercel/output/static/..."
mkdir -p .vercel/output/static

echo "[build-vercel-output] Copiando frontend/dist/* -> .vercel/output/static/"
# copia todo conteudo de frontend/dist/ (incluindo .) pra .vercel/output/static/
cp -R frontend/dist/. .vercel/output/static/

echo "[build-vercel-output] OK. Conteudo:"
ls -la .vercel/output/static/
