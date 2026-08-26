// Dashboard - Sistema Viaturas CPI-7
// Replica a capa MAPA DE VIATURAS: totais por unidade, operacionais, baixadas, %

import { query } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromCpf, getUserUnidadesAutorizadas } from "./_helpers";

/**
 * Retorna os totais por unidade (igual a capa MAPA DE VIATURAS).
 * - admin: ve TODAS as unidades
 * - gestor/editor: ve unidades onde é gestor/editor
 * - viewer: ve só da SUA unidade
 *
 * 3 estados (William 2026-08-13):
 *   - Operando (ativo=true, emDescarga=false): CONTA
 *   - Baixadas (ativo=false, emDescarga=false): CONTA (frota viva)
 *   - Em Descarte (emDescarga=true): NAO CONTA
 *
 * 2 categorias: OPERACIONAL vs ADM (William 2026-08-13 pediu restauracao)
 */
export const getTotaisPorUnidade = query({
  args: { cpf: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) return { unidades: [], geral: null };

    // Determina unidades a incluir
    let unidadesIncluir: string[] = [];
    if (user.viaturasRole === "admin") {
      const all = await ctx.db.query("units").collect();
      unidadesIncluir = all.filter(u => u.active !== false).map(u => u._id.toString());
    } else if (user.viaturasRole === "gestor" || user.viaturasRole === "editor") {
      const unidades = user.viaturasRole === "gestor" ? user.unidadesGestor : user.unidadesEditor;
      if (unidades && unidades.length > 0) {
        unidadesIncluir = await getUserUnidadesAutorizadas(ctx, unidades);
      }
    } else {
      if (user.unit) unidadesIncluir = [user.unit.toString()];
    }

    // Pega units e viaturas
    const todasViaturas = await ctx.db.query("viaturas").collect();
    const unidadesInfo = await ctx.db.query("units").collect();
    const unitsById = new Map(unidadesInfo.map(u => [u._id.toString(), u]));

    // Mapa opmId -> matriz raiz (pega parentUnit ate o BPM matriz)
    function findMatriz(opmId: string): string {
      let current = unitsById.get(opmId);
      if (!current) return opmId;
      if (current.code === "607000000") return current._id.toString();
      const code = current.code || "";
      if (code.length === 9 && code.endsWith("0000") && code.substring(3, 5) !== "00") {
        return current._id.toString();
      }
      if (current.parentUnit) {
        return findMatriz(current.parentUnit.toString());
      }
      return current._id.toString();
    }

    // Pega info das matrizes
    const matrizesMap = new Map<string, { id: string, code: string, name: string }>();
    for (const u of unidadesInfo) {
      if (u.code === "607000000") {
        matrizesMap.set(u._id.toString(), { id: u._id.toString(), code: u.code, name: u.name });
      } else if (u.code && u.code.length === 9 && u.code.endsWith("0000") && u.code.substring(3, 5) !== "00") {
        matrizesMap.set(u._id.toString(), { id: u._id.toString(), code: u.code, name: u.name });
      }
    }

    // Filtra viaturas pelas unidades autorizadas
    const viaturasFiltradas = todasViaturas.filter(v =>
      unidadesIncluir.includes(v.opm.toString())
    );

    // Agrupa por MATRIZ
    // Estrutura separa por TIPO (MT/CR) e por CATEGORIA (OP/ADM)
    // Cada viatura cai em 1 dos 3 estados x 2 categorias
    const porMatriz = new Map<string, {
      matrizId: string;
      matrizCode: string;
      matrizName: string;
      // Totais
      total: number;
      totalOp: number;     // total categoria OPERACIONAL
      totalAdm: number;    // total categoria ADM
      motos: number; carros: number;
      // Por categoria
      opMotos: number; opCarros: number;
      admMotos: number; admCarros: number;
      // 3 estados
      operando: number; opMoto: number; opCarro: number;
      emDescarga: number; edMoto: number; edCarro: number;
      baixadas: number; bMoto: number; bCarro: number;
      // Por estado x categoria (soh para baixadas, que e o unico com ADM)
      bOpMoto: number; bOpCarro: number;
      bAdmMoto: number; bAdmCarro: number;
    }>();

    for (const viatura of viaturasFiltradas) {
      const opmId = viatura.opm.toString();
      const matrizId = findMatriz(opmId);
      let entry = porMatriz.get(matrizId);
      if (!entry) {
        const matriz = matrizesMap.get(matrizId) || { id: matrizId, code: "", name: "Desconhecido" };
        entry = {
          matrizId: matriz.id,
          matrizCode: matriz.code,
          matrizName: matriz.name,
          total: 0,
          totalOp: 0, totalAdm: 0,
          motos: 0, carros: 0,
          opMotos: 0, opCarros: 0,
          admMotos: 0, admCarros: 0,
          operando: 0, opMoto: 0, opCarro: 0,
          emDescarga: 0, edMoto: 0, edCarro: 0,
          baixadas: 0, bMoto: 0, bCarro: 0,
          bOpMoto: 0, bOpCarro: 0,
          bAdmMoto: 0, bAdmCarro: 0,
        };
        porMatriz.set(matrizId, entry);
      }
      entry.total++;

      const isMoto = viatura.tipo === "MT";
      const isAdm = viatura.categoria === "ADM";
      const isOp = viatura.categoria === "OPERACIONAL";

      // Contagem por tipo
      if (isMoto) entry.motos++;
      else entry.carros++;

      // Contagem por categoria + tipo
      if (isOp) {
        entry.totalOp++;
        if (isMoto) entry.opMotos++;
        else entry.opCarros++;
      } else if (isAdm) {
        entry.totalAdm++;
        if (isMoto) entry.admMotos++;
        else entry.admCarros++;
      }

      // 3 estados (William 2026-08-13)
      if (viatura.emDescarga) {
        entry.emDescarga++;
        if (isMoto) entry.edMoto++;
        else entry.edCarro++;
      } else if (viatura.ativo) {
        entry.operando++;
        if (isMoto) entry.opMoto++;
        else entry.opCarro++;
      } else {
        entry.baixadas++;
        if (isMoto) entry.bMoto++;
        else entry.bCarro++;
        // Cruza estado x categoria x tipo (soh para baixadas pois ADM soh tem baixadas)
        if (isOp) {
          if (isMoto) entry.bOpMoto++;
          else entry.bOpCarro++;
        } else if (isAdm) {
          if (isMoto) entry.bAdmMoto++;
          else entry.bAdmCarro++;
        }
      }
    }

    // Calcula % de baixa (NAO conta emDescarga)
    const unidades = Array.from(porMatriz.values()).map(u => ({
      ...u,
      pctBaixaMoto: u.motos > 0 ? Math.round((u.bMoto / (u.opMoto + u.bMoto)) * 10000) / 100 : 0,
      pctBaixaCarro: u.carros > 0 ? Math.round((u.bCarro / (u.opCarro + u.bCarro)) * 10000) / 100 : 0,
    }));

    // Ordena por codigo da matriz
    unidades.sort((a, b) => a.matrizCode.localeCompare(b.matrizCode));

    // Calcula geral
    const geral = {
      // Frota viva: NAO inclui emDescarga
      totalGeral: unidades.reduce((s, u) => s + u.operando + u.baixadas, 0),
      // Total com descarte
      totalFrota: unidades.reduce((s, u) => s + u.total, 0),
      // Por tipo
      totalMotos: unidades.reduce((s, u) => s + u.motos, 0),
      totalCarros: unidades.reduce((s, u) => s + u.carros, 0),
      // Por categoria
      totalOp: unidades.reduce((s, u) => s + u.totalOp, 0),
      totalAdm: unidades.reduce((s, u) => s + u.totalAdm, 0),
      totalOpMotos: unidades.reduce((s, u) => s + u.opMotos, 0),
      totalOpCarros: unidades.reduce((s, u) => s + u.opCarros, 0),
      totalAdmMotos: unidades.reduce((s, u) => s + u.admMotos, 0),
      totalAdmCarros: unidades.reduce((s, u) => s + u.admCarros, 0),
      // 3 estados
      totalOperando: unidades.reduce((s, u) => s + u.operando, 0),
      totalOperandoMoto: unidades.reduce((s, u) => s + u.opMoto, 0),
      totalOperandoCarro: unidades.reduce((s, u) => s + u.opCarro, 0),
      totalEmDescarga: unidades.reduce((s, u) => s + u.emDescarga, 0),
      totalEmDescargaMoto: unidades.reduce((s, u) => s + u.edMoto, 0),
      totalEmDescargaCarro: unidades.reduce((s, u) => s + u.edCarro, 0),
      totalBaixadas: unidades.reduce((s, u) => s + u.baixadas, 0),
      totalBaixadasMoto: unidades.reduce((s, u) => s + u.bMoto, 0),
      totalBaixadasCarro: unidades.reduce((s, u) => s + u.bCarro, 0),
      // Cruzamento estado x categoria
      totalBaixadasOp: unidades.reduce((s, u) => s + u.bOpMoto + u.bOpCarro, 0),
      totalBaixadasOpMoto: unidades.reduce((s, u) => s + u.bOpMoto, 0),
      totalBaixadasOpCarro: unidades.reduce((s, u) => s + u.bOpCarro, 0),
      totalBaixadasAdm: unidades.reduce((s, u) => s + u.bAdmMoto + u.bAdmCarro, 0),
      totalBaixadasAdmMoto: unidades.reduce((s, u) => s + u.bAdmMoto, 0),
      totalBaixadasAdmCarro: unidades.reduce((s, u) => s + u.bAdmCarro, 0),
      mediaBaixaMoto: 0,
      mediaBaixaCarro: 0,
    };
    geral.mediaBaixaMoto = (geral.totalOperandoMoto + geral.totalBaixadasMoto) > 0
      ? Math.round((geral.totalBaixadasMoto / (geral.totalOperandoMoto + geral.totalBaixadasMoto)) * 10000) / 100 : 0;
    geral.mediaBaixaCarro = (geral.totalOperandoCarro + geral.totalBaixadasCarro) > 0
      ? Math.round((geral.totalBaixadasCarro / (geral.totalOperandoCarro + geral.totalBaixadasCarro)) * 10000) / 100 : 0;

    return { unidades, geral };
  },
});

/**
 * Retorna contadores gerais pra home (cards)
 */
export const getHomeStats = query({
  args: { cpf: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) return null;

    let pendentes = 0;
    let meusAgendamentos = 0;
    if (user.viaturasRole === "gestor" || user.viaturasRole === "admin") {
      const all = await ctx.db.query("agendamentos").collect();
      const pendentesAll = all.filter(a => a.status === "pendente");

      if (user.viaturasRole === "admin") {
        pendentes = pendentesAll.length;
      } else {
        const unidades = user.unidadesGestor || [];
        const unidadesAutorizadas = await getUserUnidadesAutorizadas(ctx, unidades);
        pendentes = pendentesAll.filter(a =>
          a.unidadeRequerente && unidadesAutorizadas.includes(a.unidadeRequerente.toString())
        ).length;
      }
    }

    const meus = await ctx.db.query("agendamentos")
      .withIndex("by_solicitante", (q) => q.eq("solicitante", user._id))
      .collect();
    meusAgendamentos = meus.length;

    return {
      pendentes,
      meusAgendamentos,
      meusAprovados: meus.filter(a => a.status === "aprovado").length,
      meusConcluidos: meus.filter(a => a.status === "concluido").length,
    };
  },
});


/**
 * FIX (William 2026-08-24): Evolucao mensal de viaturas (operando x baixada)
 * Retorna uma serie temporal de pontos mensais pra alimentar o grafico
 * "Desempenho" da aba nova. Granularidade: mensal.
 *
 * Aproximacao (William ciente - dados antigos nao tem historico de reativacao):
 * - Para cada viatura V, em um mes M:
 *   - tava na frota se V.criadoEm <= fim(M)
 *   - tava BAIXADA se V.criadoEm <= fim(M) E V.dataBaixa <= fim(M) E
 *     (V.dataReativadoEm nao setado OU V.dataReativadoEm > fim(M))
 *   - tava OPERANDO senao
 *
 * RLS (igual Mapa Geral - William 2026-08-24):
 * - admin: ve tudo
 * - gestor/editor: ve unidades autorizadas (raiz + filhas + commandUnit)
 * - viewer: ve so a sua unidade
 *
 * Filtros:
 * - opm (opcional): restringe a 1 matriz (ou seja, a matriz + filhas tecnicas)
 * - subordinada (opcional): restringe a 1 filha especifica
 */
export const evolucaoMensal = query({
  args: {
    cpf: v.string(),
    opm: v.optional(v.id("units")),
    subordinada: v.optional(v.id("units")),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) return { pontos: [], totalGeral: 0 };

    // 1) RLS - mesmo padrao do Mapa Geral
    let unidadesIncluir: string[] = [];
    if (user.viaturasRole === "admin") {
      const all = await ctx.db.query("units").collect();
      unidadesIncluir = all.filter(u => u.active !== false).map(u => u._id.toString());
    } else if (user.viaturasRole === "gestor" || user.viaturasRole === "editor") {
      const unidades = user.viaturasRole === "gestor" ? user.unidadesGestor : user.unidadesEditor;
      if (unidades && unidades.length > 0) {
        unidadesIncluir = await getUserUnidadesAutorizadas(ctx, unidades);
      }
    } else {
      if (user.unit) unidadesIncluir = [user.unit.toString()];
    }

    if (unidadesIncluir.length === 0) return { pontos: [], totalGeral: 0 };

    // 2) Filtra viaturas pelas unidades autorizadas
    // FIX (William 2026-08-24): exclui viaturas em descarga (consistente
    // com viaturas:list e getTotaisPorUnidade - descarga NAO conta)
    const todasViaturas = await ctx.db.query("viaturas").collect();
    let viaturasFiltradas = todasViaturas.filter(v =>
      unidadesIncluir.includes(v.opm.toString()) && v.emDescarga !== true
    );

    // 3) Filtro explicito do frontend (opm matriz / subordinada)
    if (args.subordinada) {
      const subId = args.subordinada.toString();
      viaturasFiltradas = viaturasFiltradas.filter(v => v.opm.toString() === subId);
    } else if (args.opm) {
      // Pega a matriz + descendentes (recursivo)
      const opmId = args.opm.toString();
      const unidades = await ctx.db.query("units").collect();
      function descendentes(opmIdLocal: string): string[] {
        const acc: string[] = [opmIdLocal];
        for (const u of unidades) {
          if (u.parentUnit && u.parentUnit.toString() === opmIdLocal) {
            acc.push(...descendentes(u._id.toString()));
          }
        }
        return acc;
      }
      const descendentesOpm = descendentes(opmId);
      viaturasFiltradas = viaturasFiltradas.filter(v => descendentesOpm.includes(v.opm.toString()));
    }

    if (viaturasFiltradas.length === 0) return { pontos: [], totalGeral: 0 };

    // 4) Determina range de meses (desde a viatura mais antiga ate hoje)
    const criadoEmValues = viaturasFiltradas.map(v => v.criadoEm);
    const minCriadoEm = Math.min(...criadoEmValues);
    const agora = Date.now();
    const inicio = new Date(minCriadoEm);
    inicio.setDate(1);
    inicio.setHours(0, 0, 0, 0);
    const fimAgora = new Date(agora);
    fimAgora.setMonth(fimAgora.getMonth() + 1);
    fimAgora.setDate(1);
    fimAgora.setHours(0, 0, 0, 0);

    // 5) Itera mes a mes e conta
    const pontos: Array<{ mes: string; label: string; operando: number; baixada: number; total: number; pctOperando: number }> = [];
    let cursor = new Date(inicio);
    while (cursor < fimAgora) {
      const inicioMes = cursor.getTime();
      const fimMes = new Date(cursor);
      fimMes.setMonth(fimMes.getMonth() + 1);
      const tsFimMes = fimMes.getTime();

      let operando = 0;
      let baixada = 0;
      for (const v of viaturasFiltradas) {
        // Tava na frota em M?
        if (v.criadoEm > tsFimMes) continue;
        // Tava BAIXADA em M?
        if (v.dataBaixa && v.dataBaixa <= tsFimMes) {
          // Se foi reativada DEPOIS de M, considera baixada em M
          // Se foi reativada dentro de M (>= inicioMes), considera operante em M
          if (v.dataReativadoEm && v.dataReativadoEm >= inicioMes && v.dataReativadoEm < tsFimMes) {
            operando++;
          } else {
            baixada++;
          }
        } else {
          // dataBaixa > tsFimMes ou nao tem -> tava operante em M
          operando++;
        }
      }
      const total = operando + baixada;
      const pct = total > 0 ? Math.round((operando / total) * 1000) / 10 : 0;
      const mm = String(cursor.getMonth() + 1).padStart(2, "0");
      pontos.push({
        mes: cursor.getFullYear() + "-" + mm,
        label: cursor.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
        operando,
        baixada,
        total,
        pctOperando: pct,
      });
      cursor = fimMes;
    }

    return {
      pontos,
      totalGeral: viaturasFiltradas.length,
    };
  },
});
