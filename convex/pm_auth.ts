// Convex Auth Module - Sistema de Viaturas CPI-7
// Chamado pelo auth-api-viaturas.py pra criar/atualizar user quando faz login

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const SECRET = "pmesp-import-2026"; // mesmo secret do auth-api (legacy)

// ============================================================
// MUTATIONS
// ============================================================

/**
 * Cria ou atualiza um usuário baseado nos dados do SOAP CPD.
 * Chamado pelo auth-api após login bem-sucedido.
 */
export const createOrUpdatePMUser = mutation({
  args: {
    secret: v.string(),
    pm: v.object({
      cpf: v.string(),
      re: v.optional(v.string()),
      digre: v.optional(v.string()),
      nome: v.optional(v.string()),
      guerra: v.optional(v.string()),
      ptgr: v.optional(v.string()),
      codptgr: v.optional(v.string()),
      unidade: v.optional(v.string()),
      opm: v.optional(v.string()),
      sexo: v.optional(v.string()),
      dataNascimento: v.optional(v.string()),
      email: v.optional(v.string()),
      telefone: v.optional(v.string()),
      role: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    if (args.secret !== SECRET) {
      throw new Error("Bad secret");
    }

    const pm = args.pm;
    const cpf = pm.cpf;
    const email = pm.email || `pm:${cpf}`;

    // Verifica se user já existe (por cpf)
    const existing = await ctx.db
      .query("users")
      .withIndex("by_cpf", (q) => q.eq("cpf", cpf))
      .first();

    // Resolve unit: se OPM foi passada, busca a unit por code
    let unitId: any = undefined;
    if (pm.opm) {
      const opmCode = pm.opm;
      const unit = await ctx.db
        .query("units")
        .withIndex("by_code", (q) => q.eq("code", opmCode))
        .first();
      if (unit) {
        unitId = unit._id;
      }
    }

    const now = Date.now();
    // FIX (William 2026-08-21): admin master (soh William pode excluir/deletar)
    const isMaster = cpf === "26034202833";
    const baseData = {
      email,
      cpf,
      re: pm.re || undefined,
      digre: pm.digre || undefined,
      name: pm.nome || `PM ${cpf}`,
      warName: pm.guerra || undefined,
      postoGraduacao: pm.ptgr || undefined,
      codptgr: pm.codptgr || undefined,
      opmCode: pm.opm || undefined,
      unit: unitId,
      sexo: pm.sexo || undefined,
      dataNascimento: pm.dataNascimento || undefined,
      telefone: pm.telefone || undefined,
      active: true,
      lastLogin: now,
      loginCount: existing ? (existing.loginCount || 0) + 1 : 1,
      isMaster: existing?.isMaster || isMaster,  // master nao pode ser removido por aqui
    };

    if (existing) {
      // Atualiza dados + lastLogin
      await ctx.db.patch(existing._id, baseData);
      // FIX: retorna o user COMPLETO (com viaturasRole) - frontend precisa pra saber o role
      const updated = await ctx.db.get(existing._id);
      return {
        userId: existing._id,
        unitId: unitId || existing.unit,
        created: false,
        user: updated,
      };
    }

    // Cria novo user (primeiro acesso)
    // Determina role inicial:
    // - ADMIN_CPFS (William) -> admin
    // - outros -> "user" (depois admin promove pra viewer/editor/gestor)
    const isAdmin = cpf === "26034202833"; // William
    const initialRole = isAdmin ? "admin" : "user";

    // Inicializa viaturasRole:
    // - admin -> "admin"
    // - outros -> "viewer" (padrao)
    const viaturasRole = isAdmin ? "admin" : "viewer";

    const userId = await ctx.db.insert("users", {
      ...baseData,
      role: initialRole,
      viaturasRole,
      createdAt: now,
    });

    const created = await ctx.db.get(userId);
    return {
      userId,
      unitId,
      created: true,
      user: created,
    };
  },
});

/**
 * Promove um usuário a um role específico no app viaturas.
 * Só admin pode chamar.
 * FIX (William 2026-08-18): aceita `escopo` ("livre" | "restrito") pra
 * controlar se os dropdowns de unidade ficam livres ou travados.
 * FIX (William 2026-08-21): tambem aceita `isMaster` (apenas admin master pode setar/unsetar)
 */
export const setIsMaster = mutation({
  args: {
    secret: v.string(),
    cpf: v.string(),
    isMaster: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (args.secret !== "pmesp-import-2026") {
      throw new Error("Bad secret");
    }
    const u = await ctx.db
      .query("users")
      .withIndex("by_cpf", (q) => q.eq("cpf", args.cpf))
      .first();
    if (!u) throw new Error("Usuario nao encontrado: " + args.cpf);
    await ctx.db.patch(u._id, { isMaster: args.isMaster });
    return { ok: true, cpf: args.cpf, isMaster: args.isMaster };
  },
});

export const setViaturasRole = mutation({
  args: {
    secret: v.string(),
    cpf: v.string(),
    viaturasRole: v.union(
      v.literal("viewer"),
      v.literal("editor"),
      v.literal("gestor"),
      v.literal("admin")
    ),
    unidadesGestor: v.optional(v.array(v.id("units"))),
    unidadesEditor: v.optional(v.array(v.id("units"))),
    // FIX (William 2026-08-18): controla travamento dos dropdowns
    // - "livre": admin master OU editor do CPI-7 raiz (ve tudo, dropdowns livres)
    // - "restrito": editor de matriz/filha (dropdowns travados)
    escopo: v.optional(v.union(
      v.literal("livre"),
      v.literal("restrito"),
    )),
  },
  handler: async (ctx, args) => {
    if (args.secret !== SECRET) {
      throw new Error("Bad secret");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_cpf", (q) => q.eq("cpf", args.cpf))
      .first();
    if (!user) {
      throw new Error("User não encontrado: " + args.cpf);
    }
    await ctx.db.patch(user._id, {
      viaturasRole: args.viaturasRole,
      unidadesGestor: args.unidadesGestor,
      unidadesEditor: args.unidadesEditor,
      escopo: args.escopo,
      promotedAt: Date.now(),
    });
    return { ok: true };
  },
});

/**
 * Lista todos os usuários do app viaturas.
 * Usado na pagina de Gestao de Usuarios (admin).
 */
export const listAll = query({
  args: { secret: v.string() },
  handler: async (ctx, args) => {
    if (args.secret !== SECRET) {
      throw new Error("Bad secret");
    }
    return await ctx.db.query("users").collect();
  },
});

/**
 * FIX (William 2026-08-18): Busca UM usuario por cpf.
 * Usado pelo frontend no refreshUserFromServer() pra pegar campos
 * atualizados do Convex (viaturasRole, unidadesEditor, escopo, etc)
 * que nao vem no JWT inicial.
 */
export const getByCpf = query({
  args: { cpf: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_cpf", (q) => q.eq("cpf", args.cpf))
      .first();
  },
});
