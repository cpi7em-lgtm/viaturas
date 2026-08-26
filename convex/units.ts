// Units - Sistema de Viaturas CPI-7
// CRUD básico de unidades (mesma estrutura do Materiais mas schema separado)

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const SECRET = "pmesp-import-2026";

/**
 * Lista todas as unidades ativas.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("units").collect();
    return all.filter(u => u.active !== false);
  },
});

/**
 * Lista hierarquica (apenas matrizes + 1 nivel de filhos).
 */
export const listHierarchical = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("units").collect();
    const active = all.filter(u => u.active !== false);
    const matrizes = active.filter(u => !u.parentUnit);
    return matrizes.map(m => ({
      ...m,
      filhos: active.filter(u => u.parentUnit && u.parentUnit.toString() === m._id.toString()),
    }));
  },
});

/**
 * Cria ou atualiza uma unidade por code.
 * Usado pelo seed inicial.
 */
export const upsert = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    sigla: v.optional(v.string()),
    parentUnit: v.optional(v.id("units")),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("units")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    const data = {
      code: args.code,
      name: args.name,
      sigla: args.sigla,
      parentUnit: args.parentUnit,
      active: args.active !== false,
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }
    return await ctx.db.insert("units", data);
  },
});

/**
 * Busca unit por code.
 */
export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("units")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();
  },
});

/**
 * FIX (William 2026-08-18): Limpa o parentUnit de units que foram
 * incorretamente colocadas como filhas do CPI-7. Conceitualmente os
 * 9 BPMs (607070000, 607120000, etc) sao unidades-irmas do CPI-7
 * (todas sob uma raiz "PMESP" implicita), NAO filhas dele.
 * As Cias/Pels filhas dos BPMs permanecem (parentUnit = <BPM>).
 *
 * Apos executar: getUnidadesDescendentes(CPI-7) retorna SÓ [CPI-7],
 * e o filtro de unidade CPI-7 mostra apenas as 115 viaturas dele.
 */
export const clearCPI7Children = mutation({
  args: {
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.secret !== "pmesp-import-2026") {
      throw new Error("Bad secret");
    }

    // 1) Achar o CPI-7
    const cpi7 = await ctx.db
      .query("units")
      .withIndex("by_code", (q) => q.eq("code", "607000000"))
      .first();
    if (!cpi7) throw new Error("CPI-7 nao encontrado");

    // 2) Achar todas as units filhas diretas do CPI-7
    const filhosDiretos = await ctx.db
      .query("units")
      .withIndex("by_parent", (q) => q.eq("parentUnit", cpi7._id))
      .collect();

    // 3) Limpar parentUnit delas (viram raizes)
    let cleared = 0;
    const codesCleared: string[] = [];
    for (const f of filhosDiretos) {
      await ctx.db.patch(f._id, { parentUnit: undefined });
      codesCleared.push(f.code);
      cleared++;
    }

    return {
      ok: true,
      cpi7_id: cpi7._id,
      cleared,
      codesCleared,
    };
  },
});

