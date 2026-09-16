-- ============================================================
-- Sistema de Viaturas CPI-7 - Schema SQLite (dev local)
-- CLONE do schema Convex (camelCase em tudo, sem sufixo _id)
-- Adaptacoes SQLite:
--   BIGSERIAL -> INTEGER PK AUTOINCREMENT
--   JSONB/Object -> TEXT (JSON.stringify)
--   BIGINT[]/array -> TEXT (JSON.stringify)
--   BOOLEAN -> INTEGER (0/1)
--   v.id("xxx") -> INTEGER (FK)
-- ============================================================

PRAGMA foreign_keys = ON;

-- ============================================================
-- UNITS (clone de convex/schema.ts units)
-- ============================================================
CREATE TABLE IF NOT EXISTS units (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  parentUnit INTEGER REFERENCES units(id) ON DELETE SET NULL,
  commandUnit INTEGER REFERENCES units(id) ON DELETE SET NULL,
  active INTEGER DEFAULT 1,
  sigla TEXT
);
CREATE INDEX IF NOT EXISTS idx_units_code ON units(code);
CREATE INDEX IF NOT EXISTS idx_units_parent ON units(parentUnit);
CREATE INDEX IF NOT EXISTS idx_units_command ON units(commandUnit);
CREATE INDEX IF NOT EXISTS idx_units_active ON units(active);

-- ============================================================
-- USERS (clone de convex/schema.ts users)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Identificacao
  email TEXT UNIQUE NOT NULL,
  cpf TEXT UNIQUE,
  re TEXT,
  digre TEXT,
  name TEXT,
  warName TEXT,
  postoGraduacao TEXT,
  codptgr TEXT,
  opmCode TEXT,
  unit INTEGER REFERENCES units(id) ON DELETE SET NULL,
  sexo TEXT,
  dataNascimento TEXT,
  telefone TEXT,
  -- Role Controle de Materiais
  role TEXT,
  -- Campos especificos Viaturas
  viaturasRole TEXT DEFAULT 'viewer',
  unidadesGestor TEXT DEFAULT '[]',         -- JSON array de IDs
  unidadesEditor TEXT DEFAULT '[]',         -- JSON array de IDs
  -- Auth Google (Vercel - adaptacao)
  googleId TEXT UNIQUE,
  picture TEXT,
  approved INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  lastLogin INTEGER,
  loginCount INTEGER DEFAULT 0,
  createdAt INTEGER,
  promotedAt INTEGER,
  escopo TEXT DEFAULT 'restrito',
  isMaster INTEGER DEFAULT 0,
  -- FIX (William 2026-09-08 v24 PDF): assinatura digital do gestor (SVG)
  -- O sistema coloca automaticamente essa assinatura no PDF do IFCT
  -- quando o gestor aprova/conclui o agendamento.
  assinaturaDigitalSvg TEXT,
  assinaturaDigitalCriadoEm INTEGER
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
CREATE INDEX IF NOT EXISTS idx_users_re ON users(re);
CREATE INDEX IF NOT EXISTS idx_users_viaturasRole ON users(viaturasRole);
CREATE INDEX IF NOT EXISTS idx_users_googleId ON users(googleId);

-- ============================================================
-- AGENDAMENTOS (clone de convex/schema.ts agendamentos)
-- IFCT eh objeto embutido (TEXT JSON) - IGUAL ao Convex
-- ============================================================
CREATE TABLE IF NOT EXISTS agendamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Solicitante (FK + snapshot dos dados pra historico)
  solicitante INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  postoGraduacao TEXT NOT NULL,
  re TEXT NOT NULL,
  nomeGuerra TEXT NOT NULL,
  email TEXT NOT NULL,
  -- Unidade REQUERENTE (escolhida pelo PM) - FK
  unidadeRequerente INTEGER REFERENCES units(id) ON DELETE SET NULL,
  unidadeRequerenteOutro TEXT,
  -- Unidade ORIGEM (automatica) - FK
  unidadeOrigem INTEGER REFERENCES units(id) ON DELETE SET NULL,
  secaoSetor TEXT,
  -- Viatura SOLICITADA (tipo, nao viatura especifica)
  tipoViaturaSolicitada TEXT NOT NULL,
  tipoViaturaOutro TEXT,
  -- Missao
  dataMissao INTEGER NOT NULL,
  destino TEXT NOT NULL,
  finalidade TEXT NOT NULL,
  oficialAutorizador TEXT NOT NULL,
  -- FIX (William 2026-09-09 v29): horario especifico que o solicitante
  -- informa pra "apresentar-se em" (separado da estimativa de retirada).
  -- O PDF do IFCT usa horarioApresentacao no campo "Apresentar-se em"
  -- em vez do retiradaHora.
  horarioApresentacao TEXT,
  -- Motorista (do SAT)
  solicitanteMotorista INTEGER DEFAULT 0,
  motoristaRe TEXT,
  motoristaPosto TEXT,
  motoristaNome TEXT,
  motoristaOpm TEXT,
  motoristaOpmCode TEXT,
  motoristaCnh TEXT,
  motoristaBoletim TEXT,
  motoristaDataProva TEXT,
  motoristaPublicacoes TEXT,                -- JSON array
  -- Retirada
  retiradaData INTEGER NOT NULL,
  retiradaHora TEXT NOT NULL,
  -- Devolucao
  devolucaoData INTEGER NOT NULL,
  devolucaoHora TEXT NOT NULL,
  -- Workflow
  status TEXT NOT NULL DEFAULT 'pendente',
  -- Aprovacao
  aprovadoPor INTEGER REFERENCES users(id) ON DELETE SET NULL,
  aprovadoEm INTEGER,
  -- Rejeicao
  rejeitadoPor INTEGER REFERENCES users(id) ON DELETE SET NULL,
  rejeitadoEm INTEGER,
  motivoRejeicao TEXT,
  -- Conclusao
  concluidoPor INTEGER REFERENCES users(id) ON DELETE SET NULL,
  concluidoEm INTEGER,
  naoCompareceu INTEGER DEFAULT 0,
  -- Atribuicao de viatura
  viaturaAtribuida INTEGER REFERENCES viaturas(id) ON DELETE SET NULL,
  -- Odometro (William 2026-08-19)
  odometroRetirada INTEGER,
  odometroRetiradaEm INTEGER,
  odometroRetiradaPor INTEGER REFERENCES users(id) ON DELETE SET NULL,
  odometroDevolucao INTEGER,
  odometroDevolucaoEm INTEGER,
  odometroDevolucaoPor INTEGER REFERENCES users(id) ON DELETE SET NULL,
  kmRodados INTEGER,
  odometroEditado INTEGER DEFAULT 0,
  -- IFCT (William 2026-09-01) - objeto embutido, IGUAL ao Convex
  linkIfct TEXT,
  linkIfctExpiraEm INTEGER,
  ifctStatus TEXT,                          -- pendente | preenchido | validado
  ifctData TEXT,                            -- JSON object com hodometro/abastecimento/defeitos/observacoes
  ifctValidadoPor INTEGER REFERENCES users(id) ON DELETE SET NULL,
  ifctValidadoEm INTEGER,
  ifctValidadoObservacao TEXT,
  -- Auditoria
  criadoEm INTEGER NOT NULL,
  atualizadoEm INTEGER
);
CREATE INDEX IF NOT EXISTS idx_ag_solicitante ON agendamentos(solicitante);
CREATE INDEX IF NOT EXISTS idx_ag_unidade_requerente ON agendamentos(unidadeRequerente);
CREATE INDEX IF NOT EXISTS idx_ag_unidade_origem ON agendamentos(unidadeOrigem);
CREATE INDEX IF NOT EXISTS idx_ag_status ON agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_ag_dataMissao ON agendamentos(dataMissao);
CREATE INDEX IF NOT EXISTS idx_ag_unidade_requerente_status ON agendamentos(unidadeRequerente, status);
CREATE INDEX IF NOT EXISTS idx_ag_linkIfct ON agendamentos(linkIfct);
CREATE INDEX IF NOT EXISTS idx_ag_ifctStatus ON agendamentos(ifctStatus);
CREATE INDEX IF NOT EXISTS idx_ag_viaturaAtribuida ON agendamentos(viaturaAtribuida);

-- ============================================================
-- VIATURAS (clone de convex/schema.ts viaturas)
-- ============================================================
CREATE TABLE IF NOT EXISTS viaturas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  opm INTEGER NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
  prefixo TEXT NOT NULL,
  tipo TEXT NOT NULL,                        -- MT | CR
  categoria TEXT NOT NULL,                   -- OPERACIONAL | ADM
  marcaModelo TEXT NOT NULL,
  ativo INTEGER DEFAULT 1,
  -- Baixa
  dataBaixa INTEGER,
  dataReativadoEm INTEGER,
  motivo TEXT,
  situacao TEXT,
  observacao TEXT,
  -- Processo de Descarte (William 2026-08-13)
  emDescarga INTEGER DEFAULT 0,
  -- Ronda (William 2026-09-01)
  linkRonda TEXT,
  -- Campos LCM (William 2026-08-17)
  placa TEXT,
  patrimonio TEXT,
  cadConv TEXT,
  anoFab INTEGER,
  valor REAL,
  nl TEXT,
  contaPatrimonial TEXT,
  local TEXT,
  -- Auditoria
  criadoEm INTEGER NOT NULL,
  criadoPor INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  atualizadoEm INTEGER,
  atualizadoPor INTEGER REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_vtr_opm ON viaturas(opm);
CREATE INDEX IF NOT EXISTS idx_vtr_prefixo ON viaturas(prefixo);
CREATE INDEX IF NOT EXISTS idx_vtr_ativo ON viaturas(ativo);
CREATE INDEX IF NOT EXISTS idx_vtr_emDescarga ON viaturas(emDescarga);
CREATE INDEX IF NOT EXISTS idx_vtr_placa ON viaturas(placa);
CREATE INDEX IF NOT EXISTS idx_vtr_patrimonio ON viaturas(patrimonio);
CREATE INDEX IF NOT EXISTS idx_vtr_opm_ativo ON viaturas(opm, ativo);

-- ============================================================
-- VIATURA_HISTORICO (clone de convex/schema.ts viaturaHistorico)
-- ============================================================
CREATE TABLE IF NOT EXISTS viaturaHistorico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  viaturaId INTEGER NOT NULL REFERENCES viaturas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,                        -- baixa | reativacao
  dataHora INTEGER NOT NULL,
  motivo TEXT,
  situacao TEXT,
  km INTEGER,
  observacao TEXT,
  registradoPor INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS idx_hist_viatura ON viaturaHistorico(viaturaId, dataHora);
CREATE INDEX IF NOT EXISTS idx_hist_viatura_tipo ON viaturaHistorico(viaturaId, tipo);

-- ============================================================
-- RONDAS (clone de convex/schema.ts rondas)
-- ============================================================
CREATE TABLE IF NOT EXISTS rondas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  viaturaId INTEGER NOT NULL REFERENCES viaturas(id) ON DELETE CASCADE,
  rondadoPor TEXT NOT NULL,
  textoLivre TEXT,
  posto TEXT,
  nomeGuerra TEXT,
  unidadePertence TEXT,
  assinaturaSvg TEXT,
  preenchidoEm INTEGER NOT NULL,
  ipOrigem TEXT,
  userAgentOrigem TEXT
);
CREATE INDEX IF NOT EXISTS idx_ronda_viatura ON rondas(viaturaId, preenchidoEm);

-- ============================================================
-- AUDIT_LOG (LGPD) - extra, nao existe no Convex legacy
-- mas eh boa pratica pra rastrear acoes sensiveis
-- ============================================================
CREATE TABLE IF NOT EXISTS auditLog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER REFERENCES users(id) ON DELETE SET NULL,
  cpf TEXT,
  action TEXT NOT NULL,
  resource TEXT,
  resourceId TEXT,
  details TEXT,
  ipOrigem TEXT,
  userAgent TEXT,
  dataHora INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_user ON auditLog(userId);
CREATE INDEX IF NOT EXISTS idx_audit_dataHora ON auditLog(dataHora);

-- ============================================================
-- IFCT ABASTECIMENTOS (William 2026-09-04)
-- Cada abastecimento eh um registro separado (pode ter varios
-- durante a missao). Anexa foto do comprovante (base64 em TEXT).
-- Nao obrigatorio.
-- ============================================================
CREATE TABLE IF NOT EXISTS ifctAbastecimentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agendamentoId INTEGER NOT NULL REFERENCES agendamentos(id) ON DELETE CASCADE,
  dataHora INTEGER NOT NULL,
  natureza TEXT NOT NULL,                        -- Gasolina | Alcool | Diesel | Oleo
  quantidadeLitros REAL NOT NULL,
  odometro INTEGER NOT NULL,
  posto TEXT,                                    -- Nome do posto (opcional)
  fotoComprovante TEXT,                          -- base64 da foto (opcional)
  observacao TEXT,
  criadoEm INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ifctab_agendamento ON ifctAbastecimentos(agendamentoId, dataHora);

-- ============================================================
-- IFCT ENCERRAMENTOS (William 2026-09-04)
-- Bloco "O CONDUTOR PREENCHERA" do IFCT (apos a missao).
-- Inclui assinatura digital do condutor (base64 PNG).
-- ============================================================
CREATE TABLE IF NOT EXISTS ifctEncerramentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agendamentoId INTEGER NOT NULL UNIQUE REFERENCES agendamentos(id) ON DELETE CASCADE,
  dataHora INTEGER NOT NULL,
  hodometroPartida INTEGER,
  hodometroRetorno INTEGER,
  hodometroDiferenca INTEGER,                    -- calculo: retorno - partida
  partidaConfirmadaEm INTEGER,                  -- FIX (William 2026-09-08 v24 PDF): timestamp da PRIMEIRA confirmacao do KM inicial pelo motorista
  defeitosVerificados TEXT,
  observacoes TEXT,
  novaApresentacaoData INTEGER,
  novaApresentacaoHora TEXT,
  novaApresentacaoLocal TEXT,
  consideracoesVeiculo TEXT,
  assinaturaCondutorSvg TEXT,                   -- SVG da assinatura
  ipOrigem TEXT,
  userAgentOrigem TEXT,
  criadoEm INTEGER NOT NULL
);
