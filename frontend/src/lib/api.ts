// Convex API helpers - Sistema de Viaturas CPI-7
// Wrappers em volta de apiFetch pra cada query/mutation do backend
// IMPORTANTE: Convex HTTP API espera body { path, args }
// FIX (William 2026-08-10): sub-path /viaturas/ via proxy reverso no nginx do Materiais (8080)
//   Os caminhos viraram /viaturas/api/... e /viaturas/convex/...
//   O nginx do Materiais (8080) faz rewrite removendo o prefixo e encaminha pra :8081

import { apiFetch } from "./auth";

// Helper: monta body no formato { path, args } exigido pelo Convex HTTP
function convexBody(path: string, args: any) {
  return JSON.stringify({ path, args });
}

// AGENDAMENTOS
export const listAgendamentos = (cpf: string, status?: string, unidadeId?: string) =>
  apiFetch("/viaturas/convex/query/agendamentos:list", {
    method: "POST",
    body: convexBody("agendamentos:list", { cpf, status, unidadeId }),
  });

export const listAgendamentosPendentes = (cpf: string) =>
  apiFetch("/viaturas/convex/query/agendamentos:listPendentes", {
    method: "POST",
    body: convexBody("agendamentos:listPendentes", { cpf }),
  });

export const getAgendamento = (id: string) =>
  apiFetch("/viaturas/convex/query/agendamentos:get", {
    method: "POST",
    body: convexBody("agendamentos:get", { id }),
  });

export const listAgendamentosPorMes = (cpf: string, ano: number, mes: number) =>
  apiFetch("/viaturas/convex/query/agendamentos:listPorMes", {
    method: "POST",
    // FIX (William 2026-08-21): chave "mes" sem acento (Convex rejeita acento em field names)
    body: convexBody("agendamentos:listPorMes", { cpf, ano, mes }),
  });

export const createAgendamento = (args: {
  cpf: string;
  unidadeRequerente: string;        // code SIAFEM ou "OUTRO"
  unidadeRequerenteOutro?: string;  // se for OUTRO
  secaoSetor?: string;
  tipoViaturaSolicitada: string;
  tipoViaturaOutro?: string;
  dataMissao: number;
  destino: string;
  finalidade: string;
  oficialAutorizador: string;
  retiradaData: number;
  retiradaHora: string;
  devolucaoData: number;
  devolucaoHora: string;
  solicitanteMotorista?: boolean;
  motoristaRe?: string;
  motoristaPosto?: string;
  motoristaNome?: string;
  motoristaOpm?: string;
  motoristaOpmCode?: string;
  motoristaCnh?: string;
  motoristaBoletim?: string;
  motoristaDataProva?: string;
}) =>
  apiFetch("/viaturas/convex/mutation/agendamentos:create", {
    method: "POST",
    body: convexBody("agendamentos:create", args),
  });

// Busca PM no SAT da PMESP pelo RE (sem digito verificador)
export const satConsulta = (re: string) =>
  apiFetch(`/viaturas/api/sat/consulta?re=${encodeURIComponent(re)}`);

export const approveAgendamento = (cpf: string, agendamentoId: string) =>
  apiFetch("/viaturas/convex/mutation/agendamentos:approve", {
    method: "POST",
    body: convexBody("agendamentos:approve", { cpf, agendamentoId }),
  });

export const rejectAgendamento = (cpf: string, agendamentoId: string, motivo: string) =>
  apiFetch("/viaturas/convex/mutation/agendamentos:reject", {
    method: "POST",
    body: convexBody("agendamentos:reject", { cpf, agendamentoId, motivo }),
  });

export const atribuirViatura = (
  cpf: string,
  agendamentoId: string,
  viaturaId: string,
  odometroRetirada: number,
) =>
  apiFetch("/viaturas/convex/mutation/agendamentos:atribuirViatura", {
    method: "POST",
    body: convexBody("agendamentos:atribuirViatura", { cpf, agendamentoId, viaturaId, odometroRetirada }),
  });

export const getUltimoOdometro = (viaturaId: string) =>
  apiFetch("/viaturas/convex/query/agendamentos:getUltimoOdometro", {
    method: "POST",
    body: convexBody("agendamentos:getUltimoOdometro", { viaturaId }),
  });

export const concluirAgendamento = (cpf: string, agendamentoId: string, odometroDevolucao: number, naoCompareceu?: boolean) =>
  apiFetch("/viaturas/convex/mutation/agendamentos:concluir", {
    method: "POST",
    body: convexBody("agendamentos:concluir", { cpf, agendamentoId, odometroDevolucao, naoCompareceu }),
  });

export const editarOdometro = (
  cpf: string,
  agendamentoId: string,
  tipo: "retirada" | "devolucao",
  novoOdometro: number,
) =>
  apiFetch("/viaturas/convex/mutation/agendamentos:editarOdometro", {
    method: "POST",
    body: convexBody("agendamentos:editarOdometro", { cpf, agendamentoId, tipo, novoOdometro }),
  });

export const cancelAgendamento = (cpf: string, agendamentoId: string) =>
  apiFetch("/viaturas/convex/mutation/agendamentos:cancel", {
    method: "POST",
    body: convexBody("agendamentos:cancel", { cpf, agendamentoId }),
  });

// FIX (William 2026-08-19): excluir agendamento permanentemente (APENAS ADMIN)
export const excluirAgendamento = (cpf: string, agendamentoId: string) =>
  apiFetch("/viaturas/convex/mutation/agendamentos:excluir", {
    method: "POST",
    body: convexBody("agendamentos:excluir", { cpf, agendamentoId }),
  });

// DASHBOARD
export const getTotais = (cpf: string) =>
  apiFetch("/viaturas/convex/query/dashboard:getTotaisPorUnidade", {
    method: "POST",
    body: convexBody("dashboard:getTotaisPorUnidade", { cpf }),
  });

export const getHomeStats = (cpf: string) =>
  apiFetch("/viaturas/convex/query/dashboard:getHomeStats", {
    method: "POST",
    body: convexBody("dashboard:getHomeStats", { cpf }),
  });

// FIX (William 2026-08-24): Evolucao mensal pra grafico de Desempenho
export const getEvolucaoMensal = (cpf: string, opm?: string, subordinada?: string) =>
  apiFetch("/viaturas/convex/query/dashboard:evolucaoMensal", {
    method: "POST",
    body: convexBody("dashboard:evolucaoMensal", { cpf, opm, subordinada }),
  });

// VIATURAS
export const listViaturas = (
  cpf: string,
  opm?: string,
  ativo?: boolean,
  tipo?: "MT" | "CR"
) =>
  apiFetch("/viaturas/convex/query/viaturas:list", {
    method: "POST",
    body: convexBody("viaturas:list", { cpf, opm, ativo, tipo }),
  });

export const getViatura = (id: string) =>
  apiFetch("/viaturas/convex/query/viaturas:get", {
    method: "POST",
    body: convexBody("viaturas:get", { id }),
  });

export const upsertViatura = (args: {
  cpf: string;
  // FIX (William 2026-08-17): id opcional pra edicao (validacao de placa nao
  // bloqueia quando o "duplicado" eh a propria viatura sendo editada)
  id?: string;
  opm: string;
  prefixo: string;
  tipo: "MT" | "CR";
  categoria: "OPERACIONAL" | "ADM";
  marcaModelo: string;
  ativo: boolean;
  dataBaixa?: number;
  motivo?: string;
  situação?: string;
  observacao?: string;
  // Campos completos do LCM (William 2026-08-17 - cadastro completo)
  placa?: string;
  patrimonio?: string;
  cadConv?: string;
  anoFab?: number;
  valor?: number;
  nl?: string;
  contaPatrimonial?: string;
  local?: string;
}) =>
  apiFetch("/viaturas/convex/mutation/viaturas:upsert", {
    method: "POST",
    body: convexBody("viaturas:upsert", args),
  });

export const removeViatura = (cpf: string, id: string) =>
  apiFetch("/viaturas/convex/mutation/viaturas:remove", {
    method: "POST",
    body: convexBody("viaturas:remove", { cpf, id }),
  });

// FIX (William 2026-08-17): Coloca viatura em PROCESSO DE DESCARTE
// (sai da aba Viaturas, vai pra aba Processo de Descarga)
export const colocarViaturaEmDescarga = (cpf: string, id: string, motivo?: string) =>
  apiFetch("/viaturas/convex/mutation/viaturas:colocarEmDescarga", {
    method: "POST",
    body: convexBody("viaturas:colocarEmDescarga", { cpf, id, motivo }),
  });

// FIX (William 2026-08-13): listar soh as viaturas em processo de descarga
export const listViaturasByDescarga = (cpf: string) =>
  apiFetch("/viaturas/convex/query/viaturas:listByDescarga", {
    method: "POST",
    body: convexBody("viaturas:listByDescarga", { cpf }),
  });

// FIX (William 2026-08-13): reativar viatura (sai do estado de descarga)
export const reativarViatura = (cpf: string, id: string) =>
  apiFetch("/viaturas/convex/mutation/viaturas:reativar", {
    method: "POST",
    body: convexBody("viaturas:reativar", { cpf, id }),
  });

// FIX (William 2026-08-24): Toggle de ativo COM registro de historico
// Chamado pelo checkbox inline do ViaturasPage. Registra o evento na tabela
// viaturaHistorico automaticamente (true→false = baixa, false→true = reativacao).
export const toggleViaturaAtivo = (
  cpf: string,
  viaturaId: string,
  novoAtivo: boolean,
  motivo?: string,
  situacao?: string,
  observacao?: string,
) =>
  apiFetch("/viaturas/convex/mutation/viaturas:toggleAtivo", {
    method: "POST",
    body: convexBody("viaturas:toggleAtivo", { cpf, viaturaId, novoAtivo, motivo, situacao, observacao }),
  });

// FIX (William 2026-08-24): Historico de baixa/reativacao de uma viatura
export const listViaturaHistorico = (cpf: string, viaturaId: string) =>
  apiFetch("/viaturas/convex/query/viaturaHistorico:listByViatura", {
    method: "POST",
    body: convexBody("viaturaHistorico:listByViatura", { cpf, viaturaId }),
  });

// UNITS
export const listUnits = () =>
  apiFetch("/viaturas/convex/query/units:list", {
    method: "POST",
    body: convexBody("units:list", {}),
  });

export const listUnitsHierarchical = () =>
  apiFetch("/viaturas/convex/query/units:listHierarchical", {
    method: "POST",
    body: convexBody("units:listHierarchical", {}),
  });

// PM AUTH / GESTAO DE USUARIOS
export const setViaturasRole = (args: {
  cpf: string;
  viaturasRole: "viewer" | "editor" | "gestor" | "admin";
  unidadesGestor?: string[];
  unidadesEditor?: string[];
  // FIX (William 2026-08-18): controla se os dropdowns de unidade ficam
  // livres ou travados. Default backend: "restrito"
  escopo?: "livre" | "restrito";
}) =>
  apiFetch("/viaturas/convex/mutation/pm_auth:setViaturasRole", {
    method: "POST",
    // FIX (William 2026-08-10): backend exige secret (mesmo do createOrUpdatePMUser)
    body: convexBody("pm_auth:setViaturasRole", { ...args, secret: "pmesp-import-2026" }),
  });

// Lista todos os usu\u00e1rios do app viaturas.
// Requer secret compartilhada (mesma do auth-api / createOrUpdatePMUser).
export const listAllUsers = () =>
  apiFetch("/viaturas/convex/query/pm_auth:listAll", {
    method: "POST",
    body: convexBody("pm_auth:listAll", { secret: "pmesp-import-2026" }),
  });
