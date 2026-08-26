#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera token + chama SAT direto do Windows"""
import sys, io, json, urllib.request, hmac, hashlib, base64, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Gera token JWT igual ao auth-api faria
SECRET = "viaturas-pmesp-cpi7-2026-secret"
def b64(x): return base64.urlsafe_b64encode(x).decode().rstrip('=')
header = b64(json.dumps({"alg":"HS256","typ":"JWT"}, separators=(",",":")).encode())
payload = b64(json.dumps({
    "sub": "26034202833",
    "iat": int(time.time()),
    "exp": int(time.time()) + 3600,
    "pm": {"cpf": "26034202833"},
    "aud": "viaturas",
    "app": "viaturas",
}, separators=(",",":")).encode())
sig = b64(hmac.new(SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
token = f"{header}.{payload}.{sig}"
print(f"Token: {token[:60]}...")

# Chama /api/sat/consulta direto
url = "http://10.36.177.138:8081/api/sat/consulta?re=111926"
req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
try:
    with urllib.request.urlopen(req, timeout=20) as r:
        body = r.read().decode(errors='replace')
        print(f"\nSAT William (RE 111926):")
        try:
            d = json.loads(body)
            print(json.dumps(d, indent=2, ensure_ascii=False))
        except:
            print(body[:2000])
except urllib.error.HTTPError as e:
    body = e.read().decode(errors='replace')
    print(f"\nHTTP {e.code}: {body[:1000]}")

# RE invalido
print()
url = "http://10.36.177.138:8081/api/sat/consulta?re=999999"
req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
try:
    with urllib.request.urlopen(req, timeout=20) as r:
        body = r.read().decode(errors='replace')
        print(f"SAT invalido (RE 999999):")
        try:
            d = json.loads(body)
            print(json.dumps(d, indent=2, ensure_ascii=False))
        except:
            print(body[:500])
except urllib.error.HTTPError as e:
    body = e.read().decode(errors='replace')
    print(f"HTTP {e.code}: {body[:500]}")
