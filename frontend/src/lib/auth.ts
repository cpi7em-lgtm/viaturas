// Auth + API client - Sistema de Viaturas CPI-7
import { useEffect, useState } from "react";

// FIX (William 2026-08-27): VITE_API_BASE aponta pro tunnel (Vercel) quando
// existir, senao cai pra /api relativo (nginx local faz proxy).
// Sem isso, Vercel bate em /api/auth/login na propria Vercel = 404.
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) || "/api";

// Salva JWT no localStorage
const TOKEN_KEY = "viaturas_token";
const USER_KEY = "viaturas_user";

export interface User {
  cpf: string;
  re?: string;
  digre?: string;
  name?: string;
  warName?: string;
  postoGraduacao?: string;
  codptgr?: string;
  opmCode?: string;
  unit?: string;  // ObjectId da unit
  email?: string;
  telefone?: string;
  // Role do app viaturas
  viaturasRole?: "viewer" | "editor" | "gestor" | "admin";
  unidadesGestor?: string[];
  unidadesEditor?: string[];
  // FIX (William 2026-08-18): escopo do filtro de unidade
  // "livre" = dropdowns livres, "restrito" = dropdowns travados
  escopo?: "livre" | "restrito";
  // FIX (William 2026-08-21): admin master (soh William)
  // Pode fazer acoes destrutivas (excluir agendamento, etc)
  // Admin normal ve tudo mas NAO pode excluir/deletar
  isMaster?: boolean;
  // UserId do Convex
  userId?: string;
  // Role do Materiais (legacy)
  role?: string;
  unitName?: string;
  unitId?: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // FIX (William 2026-08-24): dispara evento pra Sidebar rerendenderizar
  // sem precisar logout/login. Outros componentes escutam pra reagir.
  window.dispatchEvent(new CustomEvent("viaturas:user-updated", { detail: user }));
}

// Hook pra escutar mudancas no user (FIX William 2026-08-24)
// Usado pelo Sidebar pra re-render quando o refresh atualiza o localStorage
// (ex: admin promove user e o sidebar precisa mostrar Operacao imediatamente)
export function useUserSubscription(onUpdate: (u: User) => void): User | null {
  const [user, setUser] = useState<User | null>(() => getUser());
  useEffect(() => {
    function handler(e: Event) {
      const ce = e as CustomEvent<User>;
      if (ce.detail) {
        setUser(ce.detail);
        onUpdate(ce.detail);
      }
    }
    window.addEventListener("viaturas:user-updated", handler as EventListener);
    return () => window.removeEventListener("viaturas:user-updated", handler as EventListener);
  }, [onUpdate]);
  return user;
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function isAdmin(): boolean {
  const u = getUser();
  return u?.viaturasRole === "admin";
}

// FIX (William 2026-08-21): admin master (soh William por enquanto)
// Pode fazer acoes DESTRUTIVAS (excluir agendamento, deletar viatura, etc)
// Diferente de isAdmin() - admin normal (Peres/Jesus) eh admin mas nao master
export function isMaster(): boolean {
  const u = getUser();
  return u?.isMaster === true;
}

export function isGestor(): boolean {
  const u = getUser();
  return u?.viaturasRole === "gestor" || u?.viaturasRole === "admin";
}

export function isEditor(): boolean {
  const u = getUser();
  // FIX (William 2026-08-19): hierarquia admin > gestor > editor > viewer
  // Gestor tambem deve ter acesso de editor (CRUD de viatura)
  return u?.viaturasRole === "editor" || u?.viaturasRole === "gestor" || u?.viaturasRole === "admin";
}

export function isEditorOrGestor(): boolean {
  const u = getUser();
  return u?.viaturasRole === "editor" || u?.viaturasRole === "gestor" || u?.viaturasRole === "admin";
}

export async function login(cpf: string, senha: string): Promise<{ token: string; user: User }> {
  // FIX (William 2026-08-10): sub-path /viaturas/ via proxy reverso
  const res = await fetch(`/viaturas/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cpf, senha }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ erro: "Erro de login" }));
    throw new Error(err.erro || err.detail || "Erro de login");
  }
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.erro || "Login falhou");
  }
  setAuth(data.token, data.usuario);
  return { token: data.token, user: data.usuario };
}

export async function logout() {
  clearAuth();
  window.location.href = "/viaturas/login";
}

// FIX (William 2026-08-11): refresh do token sem precisar da senha do holerite.
// FIX (William 2026-08-18): busca direto do Convex pra pegar campos
// atualizados (escopo, unidadesEditor, etc) que o JWT inicial nao tem.
// (Removido /api/admin/refresh-token que nao existia no auth-api)
// FIX (William 2026-08-25): NAO envia Authorization pro convex (ele
// rejeita JWT sem auth provider). Tambem retorna o current (atualizado
// com o que veio do Convex) mesmo se o Convex falhar, pra que o caller
// sempre receba um user e possa chamar setUser().
export async function refreshUserFromServer(): Promise<User | null> {
  const current = getUser();
  const token = getToken();
  if (!current?.cpf) return null;
  let merged: User = { ...current };
  try {
    // Buscar dados atualizados do Convex (escopo, unidadesEditor, etc)
    // FIX (William 2026-08-21): body precisa ter { path, args } (formato convex HTTP)
    // FIX (William 2026-08-25): SEM Authorization (convex rejeita 401)
    const convexRes = await fetch(`/viaturas/convex/query/pm_auth:getByCpf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: "pm_auth:getByCpf", args: { cpf: current.cpf } }),
    });
    if (convexRes.ok) {
      const convexData = await convexRes.json();
      const fresh = convexData?.value || convexData;
      if (fresh) {
        // Merge:优先 usar dados do Convex (escopo, unidadesEditor, viaturasRole)
        // Fallback no payload do JWT (caso algum campo nao exista no Convex)
        merged = {
          ...current,
          viaturasRole: fresh.viaturasRole || current.viaturasRole,
          unidadesEditor: fresh.unidadesEditor || current.unidadesEditor,
          unidadesGestor: fresh.unidadesGestor || current.unidadesGestor,
          escopo: fresh.escopo || current.escopo,
          // FIX (William 2026-08-21): isMaster tambem
          isMaster: fresh.isMaster !== undefined ? fresh.isMaster : current.isMaster,
          userId: fresh._id || current.userId,
          // FIX (William 2026-08-25): copiando TODOS os campos do Convex
          // pra resolver bug do OPM (opmCode) que nao vinha no JWT
          opmCode: fresh.opmCode ?? current.opmCode,
          unit: fresh.unit ?? current.unit,
          unitName: fresh.unitName ?? current.unitName,
          name: fresh.name || current.name,
          warName: fresh.warName || current.warName,
          postoGraduacao: fresh.postoGraduacao || current.postoGraduacao,
        };
      } else {
        console.warn("[auth] refresh: Convex retornou value null");
      }
    } else {
      console.warn("[auth] refresh: Convex HTTP", convexRes.status, "(se 401, sem auth - isso é normal)");
    }
    if (token) {
      setAuth(token, merged);
    }
    return merged;
  } catch (e) {
    console.warn("[auth] refresh err", e);
    // Mesmo em caso de erro, salva o current pra garantir que o localStorage
    // tem os campos (e dispara o evento de atualizacao pros subscribers)
    if (token) {
      setAuth(token, merged);
    }
    return merged;
  }
}

// Fetcher com JWT automatico
// IMPORTANTE: só envia Authorization em chamadas pro /api/ (auth-api valida).
// Chamadas /convex/ vao SEM Authorization, porque o convex-backend self-hosted
// não tem auth provider configurado e rejeita Bearer JWT sem claim 'iss'.
// A seguranca das functions fica por conta da auth-api (gateway) + rede interna.
//
// FIX (William 2026-08-10): paths com prefixo /viaturas/ (sub-path via proxy
// reverso no nginx do Materiais 8080). Detecta /viaturas/api/ e /viaturas/convex/.
//
// Convex HTTP retorna { status: "success" | "error", value: ..., errorMessage?: ... }
// Aqui a gente extrai o .value automaticamente pra chamadas /convex/
export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  // Detecta tipo de path:
  //   /convex/* ou /viaturas/convex/* -> convex backend (NÃO manda Authorization)
  //   /api/* ou /viaturas/api/*       -> auth-api (manda Authorization)
  //   http*                          -> URL absoluta (NÃO prefixa)
  //   outros                         -> prefixa com API_BASE (/api)
  const isAbsolute = path.startsWith("http");
  const isConvex = path.startsWith("/convex/") || path.startsWith("/viaturas/convex/");
  const isApi = path.startsWith("/api/") || path.startsWith("/viaturas/api/");
  if (token && !isConvex && !isAbsolute) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  let url: string;
  if (isAbsolute || isConvex || isApi) {
    url = path;  // passa direto
  } else {
    url = `${API_BASE}${path}`;
  }
  const res = await fetch(url, {
    ...options,
    headers,
  });
  // Só redireciona pro /login em 401 do /api/ (auth-api sinalizou sessão expirada)
  // 401 do /convex/ pode ser problema de funcao, NÃO é sessão expirada
  if (res.status === 401 && (isApi || !isConvex)) {
    clearAuth();
    window.location.href = "/viaturas/login";
    throw new Error("Sessão expirada");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Erro" }));
    throw new Error(err.detail || err.erro || err.errorMessage || "Erro de requisicao");
  }
  // Resposta do Convex: { status: "success", value: T } ou { status: "error", errorMessage: ... }
  if (isConvex) {
    const data = await res.json();
    if (data && typeof data === "object" && "status" in data) {
      if (data.status === "error") {
        throw new Error(data.errorMessage || "Erro Convex");
      }
      return data.value as T;
    }
    return data as T;
  }
  return res.json();
}
