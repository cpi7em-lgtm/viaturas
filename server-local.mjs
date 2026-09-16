// ============================================================
// server-local.mjs - Simula as Vercel Functions localmente
// Roda na porta 3001 e expõe /api/*
// Uso: npx tsx server-local.mjs
// (Vite faz proxy /api -> http://localhost:3001 via vite.config.ts)
// ============================================================

import { config } from "dotenv";
import { existsSync } from "node:fs";

// Carrega .env.local PRIMEIRO (tem prioridade), depois .env como fallback
if (existsSync(".env.local")) {
  config({ path: ".env.local" });
}
if (existsSync(".env")) {
  config({ path: ".env" });
}
import { createServer } from "node:http";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, normalize, sep } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_DIR = join(__dirname, "api");
const PORT = process.env.LOCAL_API_PORT || 3001;

console.log(`[server-local] API dir: ${API_DIR}`);
console.log(`[server-local] Listening on http://localhost:${PORT}`);

function resolveHandler(pathname) {
  const rel = pathname.replace(/^\/+/, "");
  if (!rel.startsWith("api/")) return null;
  const filePath = join(API_DIR, rel.replace(/^api\//, "") + ".ts");
  const norm = normalize(filePath);
  if (!norm.startsWith(normalize(API_DIR) + sep) && norm !== normalize(API_DIR)) {
    return null;
  }
  return filePath;
}

const importCache = new Map();

async function importHandler(filePath) {
  if (importCache.has(filePath)) return importCache.get(filePath);
  const url = new URL("file://" + filePath.replace(/\\/g, "/"));
  const mod = await import(url.href);
  importCache.set(filePath, mod);
  return mod;
}

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (!pathname.startsWith("/api/")) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Not found" }));
  }

  // DEBUG: endpoint pra limpar cache de imports (forçar re-import)
  if (pathname === "/api/_clear-cache" && req.method === "POST") {
    const n = importCache.size;
    importCache.clear();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ ok: true, cleared: n }));
  }

  const handlerPath = resolveHandler(pathname);
  if (!handlerPath) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Invalid path" }));
  }

  try {
    await stat(handlerPath);
  } catch {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Handler not found", path: pathname }));
  }

  let body = null;
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf-8");
    if (raw) {
      try {
        body = JSON.parse(raw);
      } catch {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ error: "Invalid JSON body" }));
      }
    }
  }

  let mod;
  try {
    mod = await importHandler(handlerPath);
  } catch (e) {
    console.error(`[server-local] Failed to import ${handlerPath}:`, e.message);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Handler import failed", detail: e.message }));
  }

  const mockReq = {
    method: req.method,
    headers: req.headers,
    url: req.url,
    query: Object.fromEntries(url.searchParams),
    body,
    ip: req.socket.remoteAddress,
  };
  const chunks = [];
  const mockRes = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; return this; },
    getHeader(k) { return this.headers[k]; },
    status(code) { this.statusCode = code; return this; },
    json(obj) {
      this.setHeader("Content-Type", "application/json");
      this.end(JSON.stringify(obj));
    },
    send(b) { this.end(b); },
    end(b) {
      // FIX (William 2026-09-08): se for Buffer (ex: PDF binario),
      // envia como raw bytes. Senao, faz JSON.stringify.
      if (Buffer.isBuffer(b)) {
        res.statusCode = this.statusCode;
        for (const [k, v] of Object.entries(this.headers)) res.setHeader(k, v);
        res.end(b);
        return;
      }
      chunks.push(typeof b === "string" ? b : (b ? JSON.stringify(b) : ""));
      res.statusCode = this.statusCode;
      for (const [k, v] of Object.entries(this.headers)) res.setHeader(k, v);
      res.end(chunks.join(""));
    },
  };

  try {
    await mod.default(mockReq, mockRes);
  } catch (e) {
    console.error(`[server-local] Handler error in ${pathname}:`, e);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Internal server error", detail: e.message, stack: e.stack?.split("\n").slice(0, 5).join("\n") }));
    }
  }
});

server.listen(PORT, () => {
  console.log(`[server-local] Ready on http://localhost:${PORT}`);
  console.log(`[server-local] Try: curl http://localhost:${PORT}/api/health`);
});
