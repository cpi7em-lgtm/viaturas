import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Schema do Sistema de Viaturas CPI-7
// Apartado do Controle de Materiais (mesma tabela users no nivel,
// mas tabelas agendamentos/viaturas sao exclusivas deste sistema)

export default defineSchema({

  // ============================================================
  // USERS - mesmo schema do Controle de Materiais + campos viaturas
  // ============================================================
  users: defineTable({
    // Identificacao
    email: v.string(),                    // "pm:CPF" ou email real
    cpf: v.optional(v.string()),          // 11 digitos, sem pontuacao
    re: v.optional(v.string()),           // 6 digitos
    digre: v.optional(v.string()),        // DV do RE
    name: v.optional(v.string()),          // Nome completo
    warName: v.optional(v.string()),      // Nome de guerra
    postoGraduacao: v.optional(v.string()), // "Cb PM", "Cap PM"
    codptgr: v.optional(v.string()),      // Código numerico do posto

    // OPM (vinda do SOAP)
    opmCode: v.optional(v.string()),      // Código SIAFEM (ex: "607002140")
    unit: v.optional(v.id("units")),      // FK pra unit (matriz ou sub)
    sexo: v.optional(v.string()),
    dataNascimento: v.optional(v.string()),
    telefone: v.optional(v.string()),

    // Role do Controle de Materiais (mantido pra compat)
    role: v.optional(v.union(
      v.literal("admin"),
      v.literal("user"),
      v.literal("unitAdmin")
    )),

    // ============================================================
    // CAMPOS ESPECIFICOS DO VIATURAS (APP NOVO)
    // ============================================================
    // Role no app viaturas (4 niveis)
    viaturasRole: v.optional(v.union(
      v.literal("viewer"),     // padrao: só agenda
      v.literal("editor"),     // controla VTR da propria unidade
      v.literal("gestor"),     // aprova agendamento
      v.literal("admin")       // William
    )),

    // Unidades onde é GESTOR (recursao cobre sub-OPMs filhas)
    unidadesGestor: v.optional(v.array(v.id("units"))),

    // Unidades onde é EDITOR (recursao cobre sub-OPMs filhas)
    unidadesEditor: v.optional(v.array(v.id("units"))),

    // ============================================================
    // Status
    // ============================================================
    approved: v.optional(v.boolean()),     // admin aprovou
    active: v.optional(v.boolean()),      // soft delete
    lastLogin: v.optional(v.number()),
    loginCount: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    promotedAt: v.optional(v.number()),  // timestamp da última promocao de role

    // FIX (William 2026-08-18): Escopo do filtro de unidade
    // - "livre": dropdowns de unidade/subordinada ABERTOS (ve tudo do escopo)
    // - "restrito": dropdowns TRAVADOS conforme as unidades (so ve o escopo restrito)
    // Se nao definido, default = "restrito" (mais seguro)
    escopo: v.optional(v.union(
      v.literal("livre"),
      v.literal("restrito"),
    )),

    // FIX (William 2026-08-21): Admin master
    // - true: pode fazer acoes DESTRUTIVAS (excluir agendamento, deletar viatura, etc)
    // - false/undefined: admin normal, soh ve tudo mas nao mexe
    // Apenas o William (cpf 26034202833) eh isMaster
    isMaster: v.optional(v.boolean()),
  })
    .index("by_email", ["email"])
    .index("by_cpf", ["cpf"])
    .index("by_re", ["re"])
    .index("by_viaturasRole", ["viaturasRole"]),

  // ============================================================
  // UNITS - compartilhada com Materiais via mesmo Postgres
  // (read-only no Viaturas, escrita é via Materiais)
  // ============================================================
  units: defineTable({
    code: v.string(),              // "607000000" (CPI-7), "607070000" (7BPMI), etc
    name: v.string(),              // "CPI-7", "7 BPM/I", etc
    parentUnit: v.optional(v.id("units")),  // hierarquia tecnica (pai-filho)
    // FIX (William 2026-08-21): unidade de comando (hierarquia FUNCIONAL PM).
    // Ex: 7BPMI tem commandUnit = CPI-7 (o 7BPMI responde ao comando do CPI-7,
    // mesmo sendo "irmao" do CPI-7 na hierarquia tecnica).
    // Quando o user eh gestor de uma unidade, o sistema inclui:
    //   1) A propria unidade + descendentes tecnicos (parentUnit recursivo)
    //   2) Todas as unidades onde commandUnit = esta unidade + descendentes delas
    commandUnit: v.optional(v.id("units")),
    active: v.optional(v.boolean()),
    sigla: v.optional(v.string()),       // "7BPMI"
  })
    .index("by_code", ["code"])
    .index("by_parent", ["parentUnit"])
    .index("by_commandUnit", ["commandUnit"])
    .index("by_active", ["active"]),

  // ============================================================
  // AGENDAMENTOS - tabela principal do sistema
  // ============================================================
  agendamentos: defineTable({
    // Solicitante (dados do SOAP, redundante pra historico)
    solicitante: v.id("users"),
    postoGraduacao: v.string(),          // "Cb PM"
    re: v.string(),                       // "111926-5"
    nomeGuerra: v.string(),               // "WILLIAM"
    email: v.string(),                    // pm:CPF ou real

    // Unidade REQUERENTE (pra qual unidade vai a viatura) - escolhe o solicitante
    // v.optional pra backward-compat com agendamentos antigos que tinham só unidadeSolicitante
    unidadeRequerente: v.optional(v.id("units")),
    unidadeRequerenteOutro: v.optional(v.string()), // se escolheu "Outro" no select
    // Unidade de ORIGEM (a OPM do PM logado) - automatico, NAO editavel
    unidadeOrigem: v.optional(v.id("units")),
    // Secao/setor dentro da unidade requerente
    secaoSetor: v.optional(v.string()),

    // Viatura SOLICITADA (tipo do que quer, não viatura especifica)
    tipoViaturaSolicitada: v.string(),   // "Onibus 7-2"
    tipoViaturaOutro: v.optional(v.string()),

    // Missao
    dataMissao: v.number(),               // timestamp
    destino: v.string(),                  // "Cidade Y"
    finalidade: v.string(),               // descricao da missao
    oficialAutorizador: v.string(),      // "Cap PM Fulano"

    // Motorista (do SAT)
    solicitanteMotorista: v.optional(v.boolean()), // true se o solicitante é o proprio motorista
    motoristaRe: v.optional(v.string()),           // RE do motorista (sem digito)
    motoristaPosto: v.optional(v.string()),        // "Cb PM"
    motoristaNome: v.optional(v.string()),         // "MICHEL WILLIAM DE MORAES"
    motoristaOpm: v.optional(v.string()),          // "CPI-7"
    motoristaOpmCode: v.optional(v.string()),      // "607002140"
    motoristaCnh: v.optional(v.string()),          // "B"
    motoristaBoletim: v.optional(v.string()),       // "INT.CPI7-12504"
    motoristaDataProva: v.optional(v.string()),    // "18/10/2004"
    // FIX (William 2026-08-24): todas as publicacoes de habilitacao (A, B, C, D, E...)
    // Nao confundir com motoristaCnh (que eh a melhor CNH ativa)
    motoristaPublicacoes: v.optional(v.array(v.object({
      categoria: v.string(),
      boletim: v.string(),
      data: v.string(),
      cassada: v.optional(v.boolean()),
    }))),

    // Retirada
    retiradaData: v.number(),
    retiradaHora: v.string(),             // "14:30"

    // Devolucao
    devolucaoData: v.number(),
    devolucaoHora: v.string(),            // "18:00"

    // Workflow
    status: v.union(
      v.literal("pendente"),
      v.literal("aprovado"),
      v.literal("rejeitado"),
      v.literal("concluido"),
      v.literal("cancelado")
    ),

    // Aprovacao/Rejeicao
    aprovadoPor: v.optional(v.id("users")),
    aprovadoEm: v.optional(v.number()),
    rejeitadoPor: v.optional(v.id("users")),
    rejeitadoEm: v.optional(v.number()),
    motivoRejeicao: v.optional(v.string()),

    // Conclusao
    concluidoPor: v.optional(v.id("users")),
    concluidoEm: v.optional(v.number()),
    naoCompareceu: v.optional(v.boolean()),

    // Atribuição de viatura (depos de aprovado, editor atribui)
    viaturaAtribuida: v.optional(v.id("viaturas")),

    // ODOMETRO (William 2026-08-19) - controle de quilometragem rodada
    // - odometroRetirada: km marcado pelo editor quando atribui a viatura
    // - odometroDevolucao: km marcado pelo user/editor quando conclui
    // - kmRodados: calculado = devolucao - retirada
    // Quando user errar, gestor/admin pode editar via mutation editarOdometro
    odometroRetirada: v.optional(v.number()),
    odometroRetiradaEm: v.optional(v.number()),
    odometroRetiradaPor: v.optional(v.id("users")),
    odometroDevolucao: v.optional(v.number()),
    odometroDevolucaoEm: v.optional(v.number()),
    odometroDevolucaoPor: v.optional(v.id("users")),
    kmRodados: v.optional(v.number()),
    // Flag de editado manualmente (auditoria)
    odometroEditado: v.optional(v.boolean()),

    // Auditoria
    criadoEm: v.number(),
    atualizadoEm: v.optional(v.number()),
  })
    .index("by_solicitante", ["solicitante"])
    .index("by_unidade_requerente", ["unidadeRequerente"])
    .index("by_unidade_origem", ["unidadeOrigem"])
    .index("by_status", ["status"])
    .index("by_dataMissao", ["dataMissao"])
    .index("by_unidade_requerente_status", ["unidadeRequerente", "status"]),

  // ============================================================
  // VIATURAS - cadastro das viaturas existentes
  // ============================================================
  viaturas: defineTable({
    opm: v.id("units"),                    // FK pra unit (matriz BPM)
    prefixo: v.string(),                   // "I-07019", "17-202", "E-14103"
    tipo: v.union(v.literal("MT"), v.literal("CR")),  // moto/carro
    categoria: v.union(v.literal("OPERACIONAL"), v.literal("ADM")),
    marcaModelo: v.string(),               // "GM/TRAILBLAZER"
    ativo: v.boolean(),                    // true=operante, false=baixado

    // Se baixada
    dataBaixa: v.optional(v.number()),
    // FIX (William 2026-08-24): timestamp da ULTIMA reativacao (usado
    // pelo grafico de desempenho mensal). Apenas para reativacoes a
    // partir de hoje - dados antigos nao tem essa info.
    dataReativadoEm: v.optional(v.number()),
    motivo: v.optional(v.string()),        // "MOTOR", "ARREFECIMENTO"
    situacao: v.optional(v.string()),      // "AGUARDANDO PREGAO"
    observacao: v.optional(v.string()),

    // FIX (William 2026-08-13): flag de Processo de Descarte (fim de vida util)
    // Quando true, some da aba Viaturas e vai pra aba "Processo de Descarga"
    emDescarga: v.optional(v.boolean()),

    // Campos LCM (William 2026-08-17) - cadastro completo
    placa: v.optional(v.string()),         // "BRZ9485"
    patrimonio: v.optional(v.string()),    // "1279580-P"
    cadConv: v.optional(v.string()),       // "8  792"
    anoFab: v.optional(v.number()),        // 2014
    valor: v.optional(v.number()),         // 45000.00
    nl: v.optional(v.string()),             // "123110501" (Nota Lancamento)
    contaPatrimonial: v.optional(v.string()), // "180156"
    local: v.optional(v.string()),         // "Patio da 1a Cia"

    // Auditoria
    criadoEm: v.number(),
    criadoPor: v.id("users"),
    atualizadoEm: v.optional(v.number()),
    atualizadoPor: v.optional(v.id("users")),
  })
    .index("by_opm", ["opm"])
    .index("by_prefixo", ["prefixo"])
    .index("by_ativo", ["ativo"])
    .index("by_emDescarga", ["emDescarga"])
    .index("by_placa", ["placa"])
    .index("by_patrimonio", ["patrimonio"])
    .index("by_opm_ativo", ["opm", "ativo"]),

  // ============================================================
  // VIATURA_HISTORICO - log de cada baixa/reativacao da viatura
  // FIX (William 2026-08-24): feature de historico
  // Registra TODAS as vezes que a viatura foi baixada/reativada,
  // com motivo, situacao, km e observacao.
  // ============================================================
  viaturaHistorico: defineTable({
    viaturaId: v.id("viaturas"),
    tipo: v.union(v.literal("baixa"), v.literal("reativacao")),
    dataHora: v.number(),                  // timestamp do evento
    motivo: v.optional(v.string()),        // "MOTOR", "ARREFECIMENTO"
    situacao: v.optional(v.string()),      // "AGUARDANDO PREGAO"
    km: v.optional(v.number()),            // odometro no momento
    observacao: v.optional(v.string()),    // texto livre
    registradoPor: v.id("users"),          // user que fez a operacao
  })
    .index("by_viatura", ["viaturaId", "dataHora"])
    .index("by_viatura_tipo", ["viaturaId", "tipo"]),

});
