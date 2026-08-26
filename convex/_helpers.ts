// Helpers compartilhados entre os modulos do Viaturas

import { QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Busca user por CPF
 */
export async function getUserFromCpf(
  ctx: QueryCtx | MutationCtx,
  cpf: string
) {
  // Limpa CPF
  const cpfClean = cpf.replace(/\D/g, "");
  return await ctx.db
    .query("users")
    .withIndex("by_cpf", (q) => q.eq("cpf", cpfClean))
    .first();
}

/**
 * Retorna lista de IDs (string) das unidades onde o user é gestor/editor,
 * incluindo recursao para sub-OPMs filhas.
 *
 * FIX (William 2026-08-21): alem da hierarquia tecnica (parentUnit),
 * agora tambem inclui unidades subordinadas via commandUnit
 * (hierarquia funcional PM - ex: 7BPMI tem commandUnit = CPI-7).
 */
export async function getUserUnidadesAutorizadas(
  ctx: QueryCtx | MutationCtx,
  unidadesDiretas: Id<"units">[]
): Promise<string[]> {
  if (!unidadesDiretas || unidadesDiretas.length === 0) return [];

  const resultado = new Set<string>();

  // Para cada unidade direta, adiciona ela + descendentes tecnicos
  // + subordinadas (commandUnit) + descendentes dessas
  for (const unidadeId of unidadesDiretas) {
    await adicionarArvoreCompleta(ctx, unidadeId, resultado);
  }

  return Array.from(resultado);
}

/**
 * FIX (William 2026-08-21): adiciona a unidade + descendentes tecnicos
 * (parentUnit) + subordinadas funcionais (commandUnit) + descendentes dessas.
 * Tudo recursivo, com protecao contra ciclos.
 */
async function adicionarArvoreCompleta(
  ctx: QueryCtx | MutationCtx,
  unidadeId: Id<"units">,
  resultado: Set<string>
) {
  if (resultado.has(unidadeId.toString())) return;
  resultado.add(unidadeId.toString());

  // 1) Descendentes tecnicos (parentUnit)
  const filhas = await ctx.db
    .query("units")
    .withIndex("by_parent", (q) => q.eq("parentUnit", unidadeId))
    .collect();
  for (const filha of filhas) {
    await adicionarArvoreCompleta(ctx, filha._id, resultado);
  }

  // 2) Subordinadas funcionais (commandUnit)
  const subordinadas = await ctx.db
    .query("units")
    .withIndex("by_commandUnit", (q) => q.eq("commandUnit", unidadeId))
    .collect();
  for (const sub of subordinadas) {
    await adicionarArvoreCompleta(ctx, sub._id, resultado);
  }
}

// Mantido por retrocompatibilidade - usa a nova logica completa
async function adicionarComFilhas(
  ctx: QueryCtx | MutationCtx,
  unidadeId: Id<"units">,
  resultado: Set<string>
) {
  await adicionarArvoreCompleta(ctx, unidadeId, resultado);
}

/**
 * Retorna a unidade + TODOS os descendentes recursivos (filhos, netos, etc).
 * Usado pra filtrar viaturas de uma matriz BPM e suas Cias/Pels/GPs filhas.
 * (William 2026-08-17)
 */
export async function getUnidadesDescendentes(
  ctx: QueryCtx | MutationCtx,
  unidadeId: Id<"units">
): Promise<string[]> {
  const resultado = new Set<string>();
  await adicionarComFilhas(ctx, unidadeId, resultado);
  return Array.from(resultado);
}

/**
 * Verifica se o user tem o role mínimo necessario.
 * Lanca erro se não tiver.
 */
export function requireViaturasRole(
  user: { viaturasRole?: string } | null,
  rolesPermitidos: string[]
) {
  if (!user) throw new Error("Usuário não autenticado");
  if (!user.viaturasRole) throw new Error("Usuário sem role no app viaturas");
  if (!rolesPermitidos.includes(user.viaturasRole)) {
    throw new Error(
      "Sem permissao. Requer: " + rolesPermitidos.join(" ou ") +
      ". Atual: " + user.viaturasRole
    );
  }
}

/**
 * FIX (William 2026-08-21): Admin master.
 * Apenas o user com isMaster=true (soh o William por enquanto) pode
 * fazer acoes DESTRUTIVAS: excluir agendamento, deletar viatura, etc.
 * Admin normal ve tudo mas nao mexe.
 */
export function isMasterUser(
  user: { isMaster?: boolean } | null | undefined
): boolean {
  return user?.isMaster === true;
}

/**
 * Lanca erro se o user nao for admin master.
 */
export function requireMaster(
  user: { isMaster?: boolean } | null | undefined
) {
  if (!user) throw new Error("Usuário não autenticado");
  if (!isMasterUser(user)) {
    throw new Error("Apenas admin master pode fazer essa ação");
  }
}

/**
 * Resolve a unidade de ORIGEM do PM (de onde ele é lotado).
 *
 * Ordem de resolução (William 2026-08-19):
 * 1. user.unit (FK direto, se preenchido)
 * 2. user.opmCode exato (busca unit por code SIAFEM)
 * 3. Matriz do prefixo SIAFEM (XXX XX 0000) - se user é de uma sub que
 *    não existe como unit, cai pra matriz (ex: 607002140 -> 607000000 CPI-7)
 * 4. Qualquer sub do mesmo prefixo (60700XXXXX) - se user é de uma
 *    sub que não existe, cai pra QUALQUER outra sub do mesmo prefixo
 * 5. undefined se nada bater
 *
 * Isso garante que mesmo PMs de sub-OPMs não cadastradas tenham
 * unidadeOrigem preenchida, caindo pra matriz ou outra sub.
 *
 * NOTA: também exportado como `getUserUnit` (alias) para compatibilidade
 * com dashboard.ts/viaturas.ts que já usam esse nome.
 */
export async function getUserUnit(
  ctx: QueryCtx | MutationCtx,
  user: { unit?: Id<"units">; opmCode?: string }
): Promise<Id<"units"> | undefined> {
  // 1) user.unit (FK direto)
  if (user.unit) {
    return user.unit;
  }

  if (!user.opmCode) return undefined;
  const opm = user.opmCode;

  // 2) Match exato por code SIAFEM
  const exata = await ctx.db
    .query("units")
    .withIndex("by_code", (q) => q.eq("code", opm))
    .first();
  if (exata) return exata._id;

  // 3) Matriz do prefixo (XXX XX 0000)
  // SIAFEM: 607 (PMESP) + XX (unidade) + YYYY (Cia/Pel)
  // Matriz = troca YYYY por 0000
  if (opm.length === 9) {
    const matrizCode = opm.substring(0, 5) + "0000";
    if (matrizCode !== opm) {
      const matriz = await ctx.db
        .query("units")
        .withIndex("by_code", (q) => q.eq("code", matrizCode))
        .first();
      if (matriz) return matriz._id;
    }

    // 4) Qualquer sub do mesmo prefixo (60700XXXXX = CPI-7 e filhas)
    const prefixo5 = opm.substring(0, 5);  // 60700 = CPI-7
    const subs = await ctx.db
      .query("units")
      .collect();
    const subMesmoPrefixo = subs.find(u =>
      u.code && u.code.startsWith(prefixo5)
    );
    if (subMesmoPrefixo) return subMesmoPrefixo._id;
  }

  return undefined;
}

// Alias deprecated: mantemos pra retrocompatibilidade
export const resolveUnidadeOrigem = getUserUnit;

/**
 * Valida que o user tem acesso a uma unidade específica (com recursao).
 */
export async function userPodeAcessarUnidade(
  ctx: QueryCtx | MutationCtx,
  user: { viaturasRole?: string; unidadesGestor?: Id<"units">[]; unidadesEditor?: Id<"units">[]; unit?: Id<"units"> },
  unidadeId: Id<"units">
): Promise<boolean> {
  if (!user.viaturasRole) return false;
  if (user.viaturasRole === "admin") return true;

  const unidadesDiretas =
    user.viaturasRole === "gestor" ? user.unidadesGestor :
    user.viaturasRole === "editor" ? user.unidadesEditor :
    user.unit ? [user.unit] : [];

  if (!unidadesDiretas || unidadesDiretas.length === 0) return false;

  const unidadesAutorizadas = await getUserUnidadesAutorizadas(ctx, unidadesDiretas);
  return unidadesAutorizadas.includes(unidadeId.toString());
}
