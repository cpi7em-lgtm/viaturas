# Dockerfile do auth-api Viaturas CPI-7
# Mesmo padrao do auth-api Materiais, porem apontando pro Convex Viaturas

FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir \
    fastapi==0.110.0 \
    uvicorn[standard]==0.27.1 \
    pydantic==2.6.4

EXPOSE 8082

CMD ["uvicorn", "auth_api_viaturas:app", "--host", "0.0.0.0", "--port", "8082"]
