// CRUD de Viaturas - Sistema Viaturas CPI-7
// Editor/Admin pode criar/editar. Todos podem ler.

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromCpf, getUserUnidadesAutorizadas, userPodeAcessarUnidade, getUnidadesDescendentes } from "./_helpers";

// ============================================================
// QUERIES
// ============================================================

/**
 * Lista viaturas com filtros. RLS por role.
 */
export const list = query({
  args: {
    cpf: v.string(),
    opm: v.optional(v.id("units")),
    ativo: v.optional(v.boolean()),
    tipo: v.optional(v.union(v.literal("MT"), v.literal("CR"))),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) return [];

    let unidadesAutorizadas: string[] = [];
    if (user.viaturasRole === "admin") {
      // Sem filtro - ve todas
    } else if (user.viaturasRole === "gestor" || user.viaturasRole === "editor") {
      const unidades = user.viaturasRole === "gestor" ? user.unidadesGestor : user.unidadesEditor;
      if (unidades && unidades.length > 0) {
        unidadesAutorizadas = await getUserUnidadesAutorizadas(ctx, unidades);
      }
    } else {
      // Viewer: s� da SUA unidade
      if (user.unit) unidadesAutorizadas = [user.unit.toString()];
    }

    let q = ctx.db.query("viaturas");
    const todas = await q.collect();

    let filtered = todas;
    // FIX (William 2026-08-17): Excluir viaturas em DESCARTE da aba Viaturas
    // Conceito: emDescarga eh status definitivo (fim de vida util)
    // Aparece SOMENTE na aba Processo de Descarga (via listByDescarga)
    filtered = filtered.filter(v => v.emDescarga !== true);
    if (unidadesAutorizadas.length > 0) {
      filtered = filtered.filter(v => unidadesAutorizadas.includes(v.opm.toString()));
    }
    if (args.opm) {
      // Filtro recursivo: pega a unidade + TODOS descendentes (Cias/Pels/GPs)
      const descendentes = await getUnidadesDescendentes(ctx, args.opm);
      filtered = filtered.filter(v => descendentes.includes(v.opm.toString()));
    }
    if (args.ativo !== undefined) {
      filtered = filtered.filter(v => v.ativo === args.ativo);
    }
    // FIX (William 2026-08-17): Filtro de tipo (CR=carro, MT=moto)
    if (args.tipo !== undefined) {
      filtered = filtered.filter(v => v.tipo === args.tipo);
    }
    return filtered;
  },
});

/**
 * Detalhe de uma viatura
 */
export const get = query({
  args: { id: v.id("viaturas") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ============================================================
// MUTATIONS
// ============================================================

/**
 * Cria ou atualiza uma viatura (upsert por prefixo).
 * S� editor/admin pode.
 */
export const upsert = mutation({
  args: {
    cpf: v.string(),
    opm: v.id("units"),
    prefixo: v.string(),
    tipo: v.union(v.literal("MT"), v.literal("CR")),
    categoria: v.union(v.literal("OPERACIONAL"), v.literal("ADM")),
    marcaModelo: v.string(),
    ativo: v.boolean(),
    dataBaixa: v.optional(v.number()),
    motivo: v.optional(v.string()),
    situacao: v.optional(v.string()),
    observacao: v.optional(v.string()),
    // Campos do LCM (William 2026-08-17)
    placa: v.optional(v.string()),
    patrimonio: v.optional(v.string()),
    cadConv: v.optional(v.string()),
    anoFab: v.optional(v.number()),
    valor: v.optional(v.number()),
    nl: v.optional(v.string()),
    contaPatrimonial: v.optional(v.string()),
    local: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) throw new Error("Usu�rio n�o encontrado");
    if (user.viaturasRole !== "editor" && user.viaturasRole !== "admin") {
      throw new Error("Sem permiss�o para editar viatura");
    }

    // Verifica se user pode acessar essa unidade
    if (user.viaturasRole !== "admin") {
      const temAcesso = await userPodeAcessarUnidade(ctx, user, args.opm);
      if (!temAcesso) {
        throw new Error("Sem permiss�o pra editar viatura dessa unidade");
      }
    }

    // FIX (William 2026-08-17): Validacao de unicidade de PLACA
    // Chave alternativa de match - nao pode duplicar
    if (args.placa) {
      const placaNorm = args.placa.trim().toUpperCase();
      if (placaNorm) {
        const placaExistente = await ctx.db
          .query("viaturas")
          .withIndex("by_placa", (q) => q.eq("placa", placaNorm))
          .first();
        if (placaExistente) {
          throw new Error(
            `Placa '${placaNorm}' j� cadastrada na viatura ${placaExistente.prefixo} (${placaExistente.marcaModelo || 'sem modelo'})`
          );
        }
      }
    }

    // Verifica se j� existe viatura com esse prefixo
    const existing = await ctx.db
      .query("viaturas")
      .withIndex("by_prefixo", (q) => q.eq("prefixo", args.prefixo))
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        opm: args.opm,
        tipo: args.tipo,
        categoria: args.categoria,
        marcaModelo: args.marcaModelo,
        ativo: args.ativo,
        dataBaixa: args.dataBaixa,
        motivo: args.motivo,
        situacao: args.situacao,
        observacao: args.observacao,
        placa: args.placa,
        patrimonio: args.patrimonio,
        cadConv: args.cadConv,
        anoFab: args.anoFab,
        valor: args.valor,
        nl: args.nl,
        contaPatrimonial: args.contaPatrimonial,
        local: args.local,
        atualizadoEm: now,
        atualizadoPor: user._id,
      });
      return { id: existing._id, created: false };
    } else {
      const id = await ctx.db.insert("viaturas", {
        opm: args.opm,
        prefixo: args.prefixo,
        tipo: args.tipo,
        categoria: args.categoria,
        marcaModelo: args.marcaModelo,
        ativo: args.ativo,
        dataBaixa: args.dataBaixa,
        motivo: args.motivo,
        situacao: args.situacao,
        observacao: args.observacao,
        placa: args.placa,
        patrimonio: args.patrimonio,
        cadConv: args.cadConv,
        anoFab: args.anoFab,
        valor: args.valor,
        nl: args.nl,
        contaPatrimonial: args.contaPatrimonial,
        local: args.local,
        criadoEm: now,
        criadoPor: user._id,
      });
      return { id, created: true };
    }
  },
});

/**
 * Deleta uma viatura. S� admin.
 */
export const remove = mutation({
  args: {
    cpf: v.string(),
    id: v.id("viaturas"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user || user.viaturasRole !== "admin") {
      throw new Error("Sem permiss�o (apenas admin)");
    }
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});


// ============================================================
// ADMIN: importa viatura do LCM (idempotente por prefixo + patrimonio)
// FIX (William 2026-08-13): usado pelo script de import do LCM.
// Regra: se viatura existe por prefixo OU patrimonio e ativo=false,
// NAO mexer no status (so completar campos vazios).
// Se existe e ativo=true, atualizar tudo.
// Se nao existe, criar com ativo baseado na situacao.
export const upsertFromLcm = mutation({
  args: {
    cpf: v.string(),                     // CPF do usuario que esta importando
    opmCode: v.string(),                 // codigo SIAFEM da unit
    prefixo: v.string(),                 // prefixo da viatura
    placa: v.optional(v.string()),
    patrimonio: v.optional(v.string()),
    cadConv: v.optional(v.string()),
    marcaModelo: v.optional(v.string()),
    anoFab: v.optional(v.number()),
    valor: v.optional(v.number()),
    nl: v.optional(v.string()),
    contaPatrimonial: v.optional(v.string()),
    situacao: v.optional(v.string()),
    ativo: v.boolean(),                  // true=operante (OPERACAO), false=baixada (DESCARGA)
  },
  handler: async (ctx, args) => {
    // 1) Buscar unit pelo codigo
    const unit = await ctx.db
      .query("units")
      .withIndex("by_code", (q) => q.eq("code", args.opmCode))
      .first();
    if (!unit) throw new Error(`Unit nao encontrada: ${args.opmCode}`);

    // 2) Buscar user pelo CPF (pra validacao)
    const user = await ctx.db
      .query("users")
      .withIndex("by_cpf", (q) => q.eq("cpf", args.cpf))
      .first();
    if (!user) throw new Error("Usuario nao encontrado");
    if (user.viaturasRole !== "admin" && user.viaturasRole !== "editor") {
      throw new Error("Sem permissao");
    }

    // 3) Tentar match por prefixo OU patrimonio
    let existing = null;
    if (args.prefixo) {
      existing = await ctx.db
        .query("viaturas")
        .withIndex("by_prefixo", (q) => q.eq("prefixo", args.prefixo))
        .first();
    }
    if (!existing && args.patrimonio) {
      existing = await ctx.db
        .query("viaturas")
        .withIndex("by_patrimonio", (q) => q.eq("patrimonio", args.patrimonio))
        .first();
    }

    const now = Date.now();
    if (existing) {
      // SKIP_UPDATE se ja eh baixada (nao mexer no status)
      if (existing.ativo === false && args.ativo === true) {
        // Tentando "reativar" viatura existente - skip
        await ctx.db.patch(existing._id, {
          // completar campos faltantes
          placa: args.placa ?? existing.placa,
          patrimonio: args.patrimonio ?? existing.patrimonio,
          cadConv: args.cadConv ?? existing.cadConv,
          marcaModelo: args.marcaModelo ?? existing.marcaModelo,
          anoFab: args.anoFab ?? existing.anoFab,
          valor: args.valor ?? existing.valor,
          nl: args.nl ?? existing.nl,
          contaPatrimonial: args.contaPatrimonial ?? existing.contaPatrimonial,
          opm: unit._id,
          atualizadoEm: now,
          atualizadoPor: user._id,
        });
        return { id: existing._id, created: false, skipped: true, action: "preserved_baixada" };
      }
      // UPDATE: viatura ativa (ou baixada -> baixada) - atualizar tudo
      await ctx.db.patch(existing._id, {
        opm: unit._id,
        prefixo: args.prefixo,
        placa: args.placa ?? existing.placa,
        patrimonio: args.patrimonio ?? existing.patrimonio,
        cadConv: args.cadConv ?? existing.cadConv,
        marcaModelo: args.marcaModelo ?? existing.marcaModelo,
        anoFab: args.anoFab ?? existing.anoFab,
        valor: args.valor ?? existing.valor,
        nl: args.nl ?? existing.nl,
        contaPatrimonial: args.contaPatrimonial ?? existing.contaPatrimonial,
        situacao: args.situacao ?? existing.situacao,
        ativo: args.ativo,
        atualizadoEm: now,
        atualizadoPor: user._id,
      });
      return { id: existing._id, created: false, action: "updated" };
    } else {
      // CREATE
      const id = await ctx.db.insert("viaturas", {
        opm: unit._id,
        prefixo: args.prefixo,
        tipo: "CR",  // FIX: default CR, ajustar depois se for moto
        categoria: "OPERACIONAL",
        marcaModelo: args.marcaModelo || "DESCONHECIDO",
        ativo: args.ativo,
        motivo: args.situacao,
        situacao: args.situacao,
        placa: args.placa,
        patrimonio: args.patrimonio,
        cadConv: args.cadConv,
        anoFab: args.anoFab,
        valor: args.valor,
        nl: args.nl,
        contaPatrimonial: args.contaPatrimonial,
        criadoEm: now,
        criadoPor: user._id,
      });
      return { id, created: true, action: "created" };
    }
  },
});


// ============================================================
// ADMIN: reclassifica viaturas importadas do LCM com DESCARGA
// FIX (William 2026-08-13): as 462 viaturas com situacao="DESCARGA" no LCM
// foram importadas como ativo=false, mas na verdade estao em PROCESSO
// de descarga (estado intermediario). Devem ter:
//   - ativo = true (ainda existem na frota)
//   - emDescarga = true (em saida)
// As 203 ANTIGAS (criadoEm < 1786500000000, com motivo="SISTEMA DE FREIO" etc)
// NAO sao tocadas - ja sao baixadas legitimas.
export const reclassificarEmDescarga = mutation({
  args: {
    cpf: v.string(),
    dryRun: v.optional(v.boolean()),  // se true, so conta quantas seriam afetadas
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").withIndex("by_cpf", (q) => q.eq("cpf", args.cpf)).first();
    if (!user || user.viaturasRole !== "admin") {
      throw new Error("Apenas admin pode reclassificar");
    }
    // Data do nosso import: 2026-08-13 ~07:43 UTC
    const DATA_IMPORT = 1786560000000;
    const todas = await ctx.db.query("viaturas").collect();
    let reclassificadas = 0;
    let skipped = 0;
    for (const v of todas) {
      // Filtra: ativo=false + situacao="DESCARGA" + criadoEm >= DATA_IMPORT
      if (v.ativo !== true && v.situacao && v.situacao.toUpperCase().includes("DESCARGA") && v.criadoEm >= DATA_IMPORT) {
        if (!args.dryRun) {
          await ctx.db.patch(v._id, {
            ativo: true,
            emDescarga: true,
          });
        }
        reclassificadas++;
      } else {
        skipped++;
      }
    }
    return { reclassificadas, skipped, dryRun: !!args.dryRun };
  },
});

// ============================================================
// FIX (William 2026-08-13): listar viaturas em processo de descarga
// Retorna soh as que estao com emDescarga=true, com info da unit
export const listByDescarga = query({
  args: { cpf: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) return [];

    const todas = await ctx.db.query("viaturas").collect();
    const emDescarga = todas.filter(v => v.emDescarga === true);

    // Enriquece com opmCode
    const units = await ctx.db.query("units").collect();
    const unitsById = new Map(units.map(u => [u._id.toString(), u]));

    return emDescarga.map(v => {
      const unit = unitsById.get(v.opm.toString());
      return {
        ...v,
        opmCode: unit?.code || "",
        opmName: unit?.name || "",
      };
    });
  },
});

// ============================================================
// FIX (William 2026-08-13): reativa viatura (sai do estado de descarte)
// Zera emDescarga e marca ativo=true
export const reativar = mutation({
  args: {
    cpf: v.string(),
    id: v.id("viaturas"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) throw new Error("Usu�rio n�o encontrado");
    if (user.viaturasRole !== "admin" && user.viaturasRole !== "gestor" && user.viaturasRole !== "editor") {
      throw new Error("Sem permiss�o");
    }
    const v = await ctx.db.get(args.id);
    if (!v) throw new Error("Viatura n�o encontrada");
    await ctx.db.patch(args.id, {
      ativo: true,
      emDescarga: undefined,  // limpa o flag
      atualizadoEm: Date.now(),
      atualizadoPor: user._id,
    });
    return { id: args.id, reativada: true };
  },
});


// ============================================================
// FIX (William 2026-08-24): Toggle de ativo COM registro de historico
// Substitui a chamada direta pra upsert no toggle inline do checkbox.
// Quando muda true→false, registra evento "baixa".
// Quando muda false→true, registra evento "reativacao".
// Pega KM do ultimo agendamento concluido pra registrar no historico.
export const toggleAtivo = mutation({
  args: {
    cpf: v.string(),
    viaturaId: v.id("viaturas"),
    novoAtivo: v.boolean(),
    motivo: v.optional(v.string()),
    situacao: v.optional(v.string()),
    observacao: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) throw new Error("Usuário não encontrado");
    if (user.viaturasRole !== "admin" && user.viaturasRole !== "gestor" && user.viaturasRole !== "editor") {
      throw new Error("Sem permissão (precisa ser editor/gestor/admin)");
    }
    const viatura = await ctx.db.get(args.viaturaId);
    if (!viatura) throw new Error("Viatura não encontrada");
    if (viatura.emDescarga === true) {
      throw new Error("Viatura em processo de descarga. Vá na aba Processo de Descarga pra reativar.");
    }
    if (viatura.ativo === args.novoAtivo) {
      throw new Error("Viatura já está nesse estado");
    }

    // Pega KM do ultimo agendamento concluido dessa viatura
    // (prioriza devolucao, senao retirada) - mesma logica do getUltimoOdometro
    let kmAtual: number | undefined = undefined;
    const all = await ctx.db.query("agendamentos").collect();
    const comOdometro = all
      .filter(a => a.viaturaAtribuida && a.viaturaAtribuida.toString() === args.viaturaId.toString())
      .filter(a => typeof a.odometroRetirada === "number" || typeof a.odometroDevolucao === "number");
    if (comOdometro.length > 0) {
      comOdometro.sort((a, b) => (b.odometroDevolucaoEm || b.odometroRetiradaEm || 0) - (a.odometroDevolucaoEm || a.odometroRetiradaEm || 0));
      const ultimo = comOdometro[0];
      kmAtual = typeof ultimo.odometroDevolucao === "number" ? ultimo.odometroDevolucao : ultimo.odometroRetirada;
    }

    const now = Date.now();

    // 1) Atualiza estado da viatura
    await ctx.db.patch(args.viaturaId, {
      ativo: args.novoAtivo,
      motivo: args.novoAtivo ? undefined : (args.motivo || viatura.motivo),
      situacao: args.novoAtivo ? undefined : (args.situacao || viatura.situacao),
      dataBaixa: args.novoAtivo ? undefined : now,
      // FIX (William 2026-08-24): registra data de reativacao pra grafico mensal
      dataReativadoEm: args.novoAtivo ? now : viatura.dataReativadoEm,
      atualizadoEm: now,
      atualizadoPor: user._id,
    });

    // 2) Registra no historico
    const tipo = args.novoAtivo ? "reativacao" : "baixa";
    await ctx.db.insert("viaturaHistorico", {
      viaturaId: args.viaturaId,
      tipo,
      dataHora: now,
      motivo: args.motivo,
      situacao: args.situacao,
      km: kmAtual,
      observacao: args.observacao,
      registradoPor: user._id,
    });

    return { id: args.viaturaId, novoAtivo: args.novoAtivo, kmRegistrado: kmAtual };
  },
});

// ============================================================
// FIX (William 2026-08-17): Batch update de status (ativo) em bloco
// Usado pelo botao "Marcar X selecionadas" no frontend
export const batchUpdateAtivo = mutation({
  args: {
    cpf: v.string(),
    updates: v.array(v.object({
      id: v.id("viaturas"),
      ativo: v.boolean(),
      motivo: v.optional(v.string()),
      situacao: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) throw new Error("Usu�rio n�o encontrado");
    if (user.viaturasRole !== "editor" && user.viaturasRole !== "admin") {
      throw new Error("Sem permiss�o (apenas editor/admin)");
    }
    const now = Date.now();
    const results: any[] = [];
    for (const u of args.updates) {
      try {
        const viatura = await ctx.db.get(u.id);
        if (!viatura) {
          results.push({ id: u.id, ok: false, motivo: "nao encontrada" });
          continue;
        }
        // Verifica permissao por unidade se nao admin
        if (user.viaturasRole !== "admin") {
          const temAcesso = await userPodeAcessarUnidade(ctx, user, viatura.opm);
          if (!temAcesso) {
            results.push({ id: u.id, ok: false, motivo: "sem permissao nessa unidade" });
            continue;
          }
        }
        await ctx.db.patch(u.id, {
          ativo: u.ativo,
          motivo: u.motivo,
          situacao: u.situacao,
          dataBaixa: u.ativo ? undefined : Date.now(),
          atualizadoEm: now,
          atualizadoPor: user._id,
        });
        results.push({ id: u.id, ok: true });
      } catch (err: any) {
        results.push({ id: u.id, ok: false, motivo: err.message || "erro" });
      }
    }
    return {
      atualizados: results.filter(r => r.ok).length,
      erros: results.filter(r => !r.ok).length,
      results,
    };
  },
});

/**
 * Batch fix de prefixos (William 2026-08-13)
 */
export const batchFixPrefixos = mutation({
  args: {
    cpf: v.string(),
    updates: v.array(v.object({
      id: v.id("viaturas"),
      prefixo: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) throw new Error("Usu�rio n�o encontrado");
    if (user.viaturasRole !== "admin") {
      throw new Error("Sem permiss�o (apenas admin)");
    }
    const results: any[] = [];
    for (const u of args.updates) {
      const v = await ctx.db.get(u.id);
      if (!v) {
        results.push({ id: u.id, ok: false, motivo: "nao encontrada" });
        continue;
      }
      await ctx.db.patch(u.id, {
        prefixo: u.prefixo,
        atualizadoEm: Date.now(),
        atualizadoPor: user._id,
      });
      results.push({ id: u.id, ok: true, prefixo: u.prefixo });
    }
    return { atualizados: results.filter(r => r.ok).length, erros: results.filter(r => !r.ok).length, results };
  },
});
