// Agendamentos - Sistema de Viaturas CPI-7
// Workflow: pendente -> aprovado -> (atribuido viatura) -> concluido

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserUnidadesAutorizadas, getUserFromCpf, requireViaturasRole, getUserUnit } from "./_helpers";

// ============================================================
// QUERIES
// ============================================================

/**
 * Lista agendamentos com base no role do usuario.
 * - admin: ve TODOS
 * - gestor/editor: ve os das unidades REQUERENTES onde é gestor/editor (recursivo)
 * - viewer: ve só da SUA unidade ORIGEM (a dele)
 *
 * RLS: filtra por unidadeRequerente (pra qual unidade vai a viatura),
 * NAO por unidadeOrigem. Assim, se PM do 40BPMI pede viatura pra CPI-7,
 * só gestor do CPI-7 ve.
 */
export const list = query({
  args: {
    cpf: v.string(),
    status: v.optional(v.string()),
    unidadeId: v.optional(v.id("units")),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) return [];

    let unidadesAutorizadas: string[] = [];

    if (user.viaturasRole === "admin") {
      // Admin ve tudo
      unidadesAutorizadas = []; // sem filtro
    } else if (user.viaturasRole === "gestor" || user.viaturasRole === "editor") {
      // Gestor/Editor ve agendamentos onde a UNIDADE REQUERENTE é dele
      const unidades = user.viaturasRole === "gestor" ? user.unidadesGestor : user.unidadesEditor;
      if (unidades && unidades.length > 0) {
        unidadesAutorizadas = await getUserUnidadesAutorizadas(ctx, unidades);
      }
    } else {
      // Viewer: ve só os agendamentos QUE ELE FEZ (solicitante = user)
      unidadesAutorizadas = []; // sem filtro de unidade; filtra por solicitante abaixo
    }

    let q = ctx.db.query("agendamentos");
    const agendamentos = await q.collect();

    // Filtra por unidades autorizadas (ou por solicitante se viewer)
    let filtered = agendamentos;
    if (unidadesAutorizadas.length > 0) {
      // Gestor/editor: ve onde a unidade REQUERENTE esta nas autorizadas
      filtered = filtered.filter(a =>
        a.unidadeRequerente && unidadesAutorizadas.includes(a.unidadeRequerente.toString())
      );
    } else if (user.viaturasRole !== "admin") {
      // Viewer: ve só os proprios
      filtered = filtered.filter(a => a.solicitante.toString() === user._id.toString());
    }

    // Filtra por status
    if (args.status) {
      filtered = filtered.filter(a => a.status === args.status);
    }

    // Filtra por unidade REQUERENTE especifica
    if (args.unidadeId) {
      filtered = filtered.filter(a => a.unidadeRequerente && a.unidadeRequerente.toString() === args.unidadeId);
    }

    // Ordena por dataMissao decrescente
    return filtered.sort((a, b) => b.dataMissao - a.dataMissao);
  },
});

/**
 * Lista agendamentos PENDENTES (para gestor aprovar)
 */
export const listPendentes = query({
  args: { cpf: v.string() },
  handler: async (ctx, args) => {
    return await ctx.runQuery("agendamentos:list" as any, {
      cpf: args.cpf,
      status: "pendente",
    });
  },
});

/**
 * Detalhe de 1 agendamento
 */
export const get = query({
  args: { id: v.id("agendamentos") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Agendamentos por dia (para o calendario)
 */
export const listPorMes = query({
  args: {
    cpf: v.string(),
    ano: v.number(),
    mes: v.number(),  // 0-11
  },
  handler: async (ctx, args) => {
    const start = new Date(args.ano, args.mes, 1).getTime();
    const end = new Date(args.ano, args.mes + 1, 1).getTime();

    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) return [];

    let unidadesAutorizadas: string[] = [];
    if (user.viaturasRole === "admin") {
      unidadesAutorizadas = [];
    } else if (user.viaturasRole === "gestor" || user.viaturasRole === "editor") {
      const unidades = user.viaturasRole === "gestor" ? user.unidadesGestor : user.unidadesEditor;
      if (unidades && unidades.length > 0) {
        unidadesAutorizadas = await getUserUnidadesAutorizadas(ctx, unidades);
      }
    } else {
      if (user.unit) unidadesAutorizadas = [user.unit.toString()];
    }

    const all = await ctx.db.query("agendamentos").collect();
    let filtered = all.filter(a => a.dataMissao >= start && a.dataMissao < end);

    if (unidadesAutorizadas.length > 0) {
      filtered = filtered.filter(a =>
        a.unidadeRequerente && unidadesAutorizadas.includes(a.unidadeRequerente.toString())
      );
    }

    return filtered;
  },
});

// ============================================================
// MUTATIONS
// ============================================================

/**
 * Cria um novo agendamento.
 * Qualquer usuário logado pode criar.
 * unidadeRequerente: code SIAFEM (ex: "607070000") OU "OUTRO"
 *   - Se "OUTRO", usa unidadeRequerenteOutro como texto
 *   - Senao, resolve na tabela units por code
 * secaoSetor: secao/setor dentro da unidade requerente (texto livre)
 *
 * PM logado pode pedir viatura pra qualquer unidade. O gestor que ve
 * o pedido é o da UNIDADE REQUERENTE (nao da origem).
 */
export const create = mutation({
  args: {
    cpf: v.string(),
    // Unidade REQUERENTE (escolhida pelo PM)
    unidadeRequerente: v.string(),       // ex: "607070000" (code), "CPI-7" (sigla), "OUTRO"
    unidadeRequerenteOutro: v.optional(v.string()),
    secaoSetor: v.optional(v.string()),
    tipoViaturaSolicitada: v.string(),
    tipoViaturaOutro: v.optional(v.string()),
    dataMissao: v.number(),
    destino: v.string(),
    finalidade: v.string(),
    oficialAutorizador: v.string(),
    retiradaData: v.number(),
    retiradaHora: v.string(),
    devolucaoData: v.number(),
    devolucaoHora: v.string(),
    // Motorista (do SAT)
    solicitanteMotorista: v.optional(v.boolean()),
    motoristaRe: v.optional(v.string()),
    motoristaPosto: v.optional(v.string()),
    motoristaNome: v.optional(v.string()),
    motoristaOpm: v.optional(v.string()),
    motoristaOpmCode: v.optional(v.string()),
    motoristaCnh: v.optional(v.string()),
    motoristaBoletim: v.optional(v.string()),
    motoristaDataProva: v.optional(v.string()),
    // FIX (William 2026-08-24): todas as publicacoes de habilitacao (A, B, C, D...)
    motoristaPublicacoes: v.optional(v.array(v.object({
      categoria: v.string(),
      boletim: v.string(),
      data: v.string(),
      cassada: v.boolean(),
    }))),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) throw new Error("Usuário não encontrado");

    // Resolve a unidade REQUERENTE (escolhida pelo PM)
    let unidadeId: any;
    if (args.unidadeRequerente === "OUTRO") {
      throw new Error("Para 'Outro', informe em unidadeRequerenteOutro.");
    }

    // Tenta por code (SIAFEM 9 digitos), sigla, ou nome
    let unit: any = await ctx.db
      .query("units")
      .withIndex("by_code", (q) => q.eq("code", args.unidadeRequerente))
      .first();
    if (!unit) {
      // Tenta match por sigla
      const all = await ctx.db.query("units").collect();
      unit = all.find(u => u.sigla === args.unidadeRequerente);
    }
    if (!unit && args.unidadeRequerente) {
      const all = await ctx.db.query("units").collect();
      unit = all.find(u => u.name && u.name.toLowerCase() === args.unidadeRequerente.toLowerCase());
    }
    if (!unit) {
      throw new Error("Unidade REQUERENTE não encontrada: " + args.unidadeRequerente);
    }
    unidadeId = unit._id;

    // Resolve unidadeOrigem com fallback inteligente (William 2026-08-19):
    // 1) user.unit, 2) opmCode exato, 3) matriz (XXX XX 0000), 4) sub do mesmo prefixo
    const unidadeOrigemId = await getUserUnit(ctx, user);

    // Valida cobertura: a unidade REQUERENTE deve ter pelo menos 1 gestor
    // SKIP: se o user for admin (cobre tudo) OU se for gestor da unidade
    const isAdmin = user.viaturasRole === "admin";
    const isGestorUnidade = user.viaturasRole === "gestor" &&
      user.unidadesGestor && user.unidadesGestor.length > 0;
    if (!isAdmin) {
      const gestores = await ctx.db
        .query("users")
        .withIndex("by_viaturasRole", (q) => q.eq("viaturasRole", "gestor"))
        .collect();
      // Junta admin tb (admin cobre tudo)
      const admins = await ctx.db
        .query("users")
        .withIndex("by_viaturasRole", (q) => q.eq("viaturasRole", "admin"))
        .collect();
      const cobridores = [...gestores, ...admins];
      const temGestor = cobridores.some(g =>
        g.unidadesGestor && g.unidadesGestor.includes(unidadeId)
      );
      if (!temGestor) {
        // Verifica recursivamente (se gestor da matriz cobre)
        if (unit.parentUnit) {
          const temGestorPai = cobridores.some(g =>
            g.unidadesGestor && g.unidadesGestor.includes(unit.parentUnit!)
          );
          if (!temGestorPai) {
            throw new Error("Unidade REQUERENTE sem gestor nomeado. Avise o admin.");
          }
        } else {
          throw new Error("Unidade REQUERENTE sem gestor nomeado. Avise o admin.");
        }
      }
    }

    const id = await ctx.db.insert("agendamentos", {
      solicitante: user._id,
      postoGraduacao: user.postoGraduacao || "",
      re: user.re || "",
      nomeGuerra: user.warName || "",
      email: user.email,
      // Unidade REQUERENTE (escolhida pelo PM)
      unidadeRequerente: unidadeId,
      unidadeRequerenteOutro: args.unidadeRequerenteOutro,
      secaoSetor: args.secaoSetor,
      // Unidade de ORIGEM (automatica, do user logado)
      // FIX (William 2026-08-19): usa resolveUnidadeOrigem com fallback
      // (user.unit -> opmCode -> matriz -> sub mesmo prefixo)
      unidadeOrigem: unidadeOrigemId,
      // Viatura
      tipoViaturaSolicitada: args.tipoViaturaSolicitada,
      tipoViaturaOutro: args.tipoViaturaOutro,
      // Missao
      dataMissao: args.dataMissao,
      destino: args.destino,
      finalidade: args.finalidade,
      oficialAutorizador: args.oficialAutorizador,
      // Retirada/Devolucao
      retiradaData: args.retiradaData,
      retiradaHora: args.retiradaHora,
      devolucaoData: args.devolucaoData,
      devolucaoHora: args.devolucaoHora,
      // Motorista
      solicitanteMotorista: args.solicitanteMotorista,
      motoristaRe: args.motoristaRe,
      motoristaPosto: args.motoristaPosto,
      motoristaNome: args.motoristaNome,
      motoristaOpm: args.motoristaOpm,
      motoristaOpmCode: args.motoristaOpmCode,
      motoristaCnh: args.motoristaCnh,
      motoristaBoletim: args.motoristaBoletim,
      motoristaDataProva: args.motoristaDataProva,
      motoristaPublicacoes: args.motoristaPublicacoes,
      status: "pendente",
      criadoEm: Date.now(),
    });
    return { id };
  },
});

/**
 * Aprova um agendamento. Só gestor/editor da unidade REQUERENTE pode.
 */
export const approve = mutation({
  args: {
    cpf: v.string(),  // do gestor que aprova
    agendamentoId: v.id("agendamentos"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) throw new Error("Usuário não encontrado");
    if (user.viaturasRole !== "gestor" && user.viaturasRole !== "admin") {
      throw new Error("Sem permissão para aprovar agendamento");
    }

    const agendamento = await ctx.db.get(args.agendamentoId);
    if (!agendamento) throw new Error("Agendamento não encontrado");
    if (agendamento.status !== "pendente") {
      throw new Error("Agendamento não esta pendente (status=" + agendamento.status + ")");
    }

    // Verifica que o user é gestor da unidade REQUERENTE (nao da origem)
    if (user.viaturasRole !== "admin" && agendamento.unidadeRequerente) {
      const unidadesGestor = user.unidadesGestor || [];
      const unidadesAutorizadas = await getUserUnidadesAutorizadas(ctx, unidadesGestor);
      if (!unidadesAutorizadas.includes(agendamento.unidadeRequerente.toString())) {
        throw new Error("Você não tem permissão pra aprovar pedidos dessa unidade");
      }
    }

    await ctx.db.patch(args.agendamentoId, {
      status: "aprovado",
      aprovadoPor: user._id,
      aprovadoEm: Date.now(),
      atualizadoEm: Date.now(),
    });
    return { ok: true };
  },
});

/**
 * Rejeita um agendamento. Só gestor pode.
 */
export const reject = mutation({
  args: {
    cpf: v.string(),
    agendamentoId: v.id("agendamentos"),
    motivo: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) throw new Error("Usuário não encontrado");
    if (user.viaturasRole !== "gestor" && user.viaturasRole !== "admin") {
      throw new Error("Sem permissão para rejeitar");
    }

    const agendamento = await ctx.db.get(args.agendamentoId);
    if (!agendamento) throw new Error("Agendamento não encontrado");
    if (agendamento.status !== "pendente") {
      throw new Error("Agendamento não esta pendente");
    }

    // Verifica que o user é gestor da unidade REQUERENTE
    if (user.viaturasRole !== "admin" && agendamento.unidadeRequerente) {
      const unidadesGestor = user.unidadesGestor || [];
      const unidadesAutorizadas = await getUserUnidadesAutorizadas(ctx, unidadesGestor);
      if (!unidadesAutorizadas.includes(agendamento.unidadeRequerente.toString())) {
        throw new Error("Você não tem permissão pra rejeitar pedidos dessa unidade");
      }
    }

    await ctx.db.patch(args.agendamentoId, {
      status: "rejeitado",
      rejeitadoPor: user._id,
      rejeitadoEm: Date.now(),
      motivoRejeicao: args.motivo,
      atualizadoEm: Date.now(),
    });
    return { ok: true };
  },
});

/**
 * Atribui uma viatura a um agendamento aprovado.
 * Só editor (ou admin) da unidade pode.
 * OBRIGATÓRIO informar o odometroRetirada (KM atual da viatura).
 */
export const atribuirViatura = mutation({
  args: {
    cpf: v.string(),
    agendamentoId: v.id("agendamentos"),
    viaturaId: v.id("viaturas"),
    odometroRetirada: v.number(),  // km atual no momento da atribuicao
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) throw new Error("Usuário não encontrado");
    if (user.viaturasRole !== "editor" && user.viaturasRole !== "admin") {
      throw new Error("Sem permissão para atribuir viatura");
    }

    const agendamento = await ctx.db.get(args.agendamentoId);
    if (!agendamento) throw new Error("Agendamento não encontrado");
    if (agendamento.status !== "aprovado") {
      throw new Error("Agendamento não esta aprovado");
    }

    // Valida odometro
    if (typeof args.odometroRetirada !== "number" || args.odometroRetirada < 0) {
      throw new Error("Odômetro de retirada inválido (deve ser >= 0)");
    }

    await ctx.db.patch(args.agendamentoId, {
      viaturaAtribuida: args.viaturaId,
      odometroRetirada: args.odometroRetirada,
      odometroRetiradaEm: Date.now(),
      odometroRetiradaPor: user._id,
      atualizadoEm: Date.now(),
    });
    return { ok: true };
  },
});

/**
 * Marca agendamento como concluido.
 * User (solicitante) ou editor/admin pode.
 * OBRIGATÓRIO informar odometroDevolucao (KM final da viatura).
 * Calcula kmRodados = odometroDevolucao - odometroRetirada.
 */
export const concluir = mutation({
  args: {
    cpf: v.string(),
    agendamentoId: v.id("agendamentos"),
    odometroDevolucao: v.number(),  // km atual no momento da devolucao
    naoCompareceu: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) throw new Error("Usuário não encontrado");

    const agendamento = await ctx.db.get(args.agendamentoId);
    if (!agendamento) throw new Error("Agendamento não encontrado");
    if (agendamento.status !== "aprovado" && agendamento.status !== "concluido") {
      throw new Error("Agendamento não pode ser concluido (status=" + agendamento.status + ")");
    }

    // Valida odometro de devolucao
    if (typeof args.odometroDevolucao !== "number" || args.odometroDevolucao < 0) {
      throw new Error("Odômetro de devolução inválido (deve ser >= 0)");
    }

    // Valida que tem odometro de retirada (senao nao da pra calcular)
    if (typeof agendamento.odometroRetirada !== "number") {
      throw new Error("Sem odômetro de retirada. Atribua uma viatura primeiro com KM atual.");
    }

    // Valida que devolucao >= retirada
    if (args.odometroDevolucao < agendamento.odometroRetirada) {
      throw new Error(
        "Odômetro de devolução (" + args.odometroDevolucao + ") é menor que o de retirada (" +
        agendamento.odometroRetirada + "). Verifique o número."
      );
    }

    // Calcula km rodados
    const kmRodados = args.odometroDevolucao - agendamento.odometroRetirada;

    await ctx.db.patch(args.agendamentoId, {
      status: "concluido",
      concluidoPor: user._id,
      concluidoEm: Date.now(),
      naoCompareceu: args.naoCompareceu,
      odometroDevolucao: args.odometroDevolucao,
      odometroDevolucaoEm: Date.now(),
      odometroDevolucaoPor: user._id,
      kmRodados,
      atualizadoEm: Date.now(),
    });
    return { ok: true, kmRodados };
  },
});

/**
 * Cancela agendamento (proprio solicitante ou admin).
 */
export const cancel = mutation({
  args: {
    cpf: v.string(),
    agendamentoId: v.id("agendamentos"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) throw new Error("Usuário não encontrado");

    const agendamento = await ctx.db.get(args.agendamentoId);
    if (!agendamento) throw new Error("Agendamento não encontrado");

    // Só o solicitante ou admin pode cancelar
    if (agendamento.solicitante.toString() !== user._id.toString()
        && user.viaturasRole !== "admin") {
      throw new Error("Sem permissão para cancelar");
    }

    if (agendamento.status === "concluido") {
      throw new Error("Agendamento já concluido, não pode cancelar");
    }

    await ctx.db.patch(args.agendamentoId, {
      status: "cancelado",
      atualizadoEm: Date.now(),
    });
    return { ok: true };
  },
});

/**
 * EXCLUI agendamento permanentemente.
 * APENAS ADMIN MASTER pode (William 2026-08-21).
 * Usado pra limpar agendamentos de teste, erros, ou cancelados antigos.
 */
export const excluir = mutation({
  args: {
    cpf: v.string(),
    agendamentoId: v.id("agendamentos"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) throw new Error("Usuário não encontrado");
    if (user.isMaster !== true) {
      throw new Error("Apenas admin master pode excluir agendamentos");
    }

    const agendamento = await ctx.db.get(args.agendamentoId);
    if (!agendamento) throw new Error("Agendamento não encontrado");

    await ctx.db.delete(args.agendamentoId);
    return { ok: true, id: args.agendamentoId };
  },
});

/**
 * Retorna o último odômetro conhecido de uma viatura.
 * Usado pra SUGERIR a KM de retirada no modal "Atribuir VTR"
 * (pega o último odometroDevolucao de agendamentos concluídos dessa viatura,
 *  ou se nao tiver conclusao, o ultimo odometroRetirada de atribuidos).
 *
 * William 2026-08-19
 */
export const getUltimoOdometro = query({
  args: {
    viaturaId: v.id("viaturas"),
  },
  handler: async (ctx, args) => {
    // Pega todos os agendamentos dessa viatura que tem odometro (retirada ou devolucao)
    const all = await ctx.db.query("agendamentos").collect();
    const comOdometro = all
      .filter(a => a.viaturaAtribuida && a.viaturaAtribuida.toString() === args.viaturaId.toString())
      .filter(a => typeof a.odometroRetirada === "number" || typeof a.odometroDevolucao === "number");

    if (comOdometro.length === 0) {
      return { ultimoOdometro: null, agendamentoId: null, data: null, fonte: null };
    }

    // Prioriza o ultimo odometroDevolucao (mais recente conclusao)
    const comDevolucao = comOdometro
      .filter(a => typeof a.odometroDevolucao === "number")
      .sort((a, b) => (b.odometroDevolucaoEm || 0) - (a.odometroDevolucaoEm || 0));

    if (comDevolucao.length > 0) {
      const ultimo = comDevolucao[0];
      return {
        ultimoOdometro: ultimo.odometroDevolucao,
        agendamentoId: ultimo._id,
        data: ultimo.odometroDevolucaoEm,
        fonte: "devolucao",
      };
    }

    // Fallback: ultima retirada (viatura atribuida mas nao concluida ainda)
    const comRetirada = comOdometro
      .filter(a => typeof a.odometroRetirada === "number")
      .sort((a, b) => (b.odometroRetiradaEm || 0) - (a.odometroRetiradaEm || 0));

    if (comRetirada.length > 0) {
      const ultimo = comRetirada[0];
      return {
        ultimoOdometro: ultimo.odometroRetirada,
        agendamentoId: ultimo._id,
        data: ultimo.odometroRetiradaEm,
        fonte: "retirada",
      };
    }

    return { ultimoOdometro: null, agendamentoId: null, data: null, fonte: null };
  },
});

/**
 * Edita o odômetro de um agendamento já atribuído/concluído.
 * Só admin ou gestor pode (correção de erro de digitação).
 * Marca odometroEditado=true pra auditoria.
 *
 * William 2026-08-19
 */
export const editarOdometro = mutation({
  args: {
    cpf: v.string(),
    agendamentoId: v.id("agendamentos"),
    tipo: v.union(v.literal("retirada"), v.literal("devolucao")),
    novoOdometro: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) throw new Error("Usuário não encontrado");
    if (user.viaturasRole !== "gestor" && user.viaturasRole !== "admin") {
      throw new Error("Sem permissão para editar odômetro (requer gestor ou admin)");
    }

    const agendamento = await ctx.db.get(args.agendamentoId);
    if (!agendamento) throw new Error("Agendamento não encontrado");

    if (typeof args.novoOdometro !== "number" || args.novoOdometro < 0) {
      throw new Error("Odômetro inválido (deve ser >= 0)");
    }

    if (args.tipo === "retirada") {
      // Se ja tem devolucao, valida que a nova retirada <= devolucao
      if (typeof agendamento.odometroDevolucao === "number" && args.novoOdometro > agendamento.odometroDevolucao) {
        throw new Error(
          "Odômetro de retirada (" + args.novoOdometro + ") maior que o de devolução (" +
          agendamento.odometroDevolucao + "). Verifique."
        );
      }
      // Recalcula kmRodados se tiver devolucao
      const kmRodados = typeof agendamento.odometroDevolucao === "number"
        ? agendamento.odometroDevolucao - args.novoOdometro
        : agendamento.kmRodados;
      await ctx.db.patch(args.agendamentoId, {
        odometroRetirada: args.novoOdometro,
        odometroRetiradaEm: Date.now(),
        odometroRetiradaPor: user._id,
        kmRodados,
        odometroEditado: true,
        atualizadoEm: Date.now(),
      });
    } else {
      // devolucao
      if (typeof agendamento.odometroRetirada !== "number") {
        throw new Error("Sem odômetro de retirada pra comparar");
      }
      if (args.novoOdometro < agendamento.odometroRetirada) {
        throw new Error(
          "Odômetro de devolução (" + args.novoOdometro + ") menor que o de retirada (" +
          agendamento.odometroRetirada + "). Verifique."
        );
      }
      const kmRodados = args.novoOdometro - agendamento.odometroRetirada;
      await ctx.db.patch(args.agendamentoId, {
        odometroDevolucao: args.novoOdometro,
        odometroDevolucaoEm: Date.now(),
        odometroDevolucaoPor: user._id,
        kmRodados,
        odometroEditado: true,
        atualizadoEm: Date.now(),
      });
    }
    return { ok: true };
  },
});
