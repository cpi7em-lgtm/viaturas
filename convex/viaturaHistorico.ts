// Historico de baixa/reativacao de viatura
// FIX (William 2026-08-24): feature de historico
// Registra TODAS as vezes que a viatura foi baixada/reativada.
// Acionado pela mutation viaturas:toggleAtivo (que muda o estado).

import { query } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromCpf } from "./_helpers";

/**
 * Lista o historico de baixa/reativacao de uma viatura.
 * Ordenado por dataHora desc (mais recente primeiro).
 * Visivel pra todos que tem acesso a viatura (decisao William 2026-08-24).
 */
export const listByViatura = query({
  args: {
    cpf: v.string(),
    viaturaId: v.id("viaturas"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromCpf(ctx, args.cpf);
    if (!user) return [];

    // Pega todos os eventos dessa viatura, ordenado desc
    const eventos = await ctx.db
      .query("viaturaHistorico")
      .withIndex("by_viatura", (q) => q.eq("viaturaId", args.viaturaId))
      .collect();

    eventos.sort((a, b) => b.dataHora - a.dataHora);

    // Enriquece com nome do user que registrou
    const usersById = new Map<string, any>();
    for (const ev of eventos) {
      const uid = ev.registradoPor.toString();
      if (!usersById.has(uid)) {
        const u = await ctx.db.get(ev.registradoPor);
        usersById.set(uid, u);
      }
    }

    return eventos.map(ev => {
      const u = usersById.get(ev.registradoPor.toString());
      return {
        ...ev,
        registradoPorNome: u ? (u.warName || u.nome || u.name || "—") : "(user removido)",
        registradoPorPosto: u ? (u.postoGraduacao || "") : "",
        registradoPorRe: u ? (u.re || "") : "",
      };
    });
  },
});
