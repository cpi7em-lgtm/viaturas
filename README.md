# Sistema de Viaturas CPI-7 (App dedicado)

Substitui a planilha `MAPA GERAL CPI-7 - 2026` (Google Sheets) por um app web dedicado.

## Stack

- **Frontend:** React + Vite + TypeScript
- **Backend:** Convex self-hosted (porta 3211, schema `convex_viaturas`)
- **Auth:** SOAP CPD via auth-api Python (extensão do existente)
- **Server:** 10.36.177.138 (mesmo do Controle de Materiais)
- **Porta:** 8081 (8080 ocupado pelo Controle de Materiais)
- **Descontinua:** planilha Google Sheets atual quando entrar em produção

## Roles (4 níveis)

| Role | Quem atribui | Dashboard | Agenda | Aprova | Edita VTR |
|---|---|---|---|---|---|
| **usuário** (padrão) | automático | da própria unidade | ✅ (pendente) | ❌ | ❌ |
| **editor** | admin | da própria unidade | ✅ | ❌ | ✅ (própria unidade) |
| **gestor** | admin | da própria unidade | ✅ | ✅ (própria unidade) | ✅ (própria unidade) |
| **admin** | ninguém | **GERAL** (igual Sheets) | ✅ | ✅ | ✅ (tudo) |

**Multi-role:** PM pode ser gestor E editor ao mesmo tempo, em unidades diferentes.

**Cobertura:** toda unidade DEVE ter pelo menos 1 gestor. Sistema avisa admin se unidade ficar sem.

**Recursão:** gestor de matriz cobre sub-OPMs filhas automaticamente.

## Funcionalidades

- [ ] Login SOAP CPD
- [ ] Form de agendamento (igual Forms atual)
- [ ] Workflow: pendente → aprovado/rejeitado → vinculado a viatura → concluído
- [ ] Calendário mensal de agendamentos
- [ ] Lista de viaturas com filtros
- [ ] CRUD de viaturas (editor)
- [ ] Dashboard hierárquico
- [ ] Gestão de usuários (admin: buscar por RE + atribuir role + unidades)
- [ ] Importar ~500 viaturas da planilha .xlsx

## Estrutura de pastas

```
D:\USER\DESKTOPP\excel\viaturas\
├── README.md              este arquivo
├── plano.md               plano consolidado (decisões)
├── CHANGELOG.md           log de mudanças
├── convex/                backend Convex
│   ├── schema.ts
│   ├── auth.ts
│   ├── users.ts
│   ├── viaturas.ts
│   ├── agendamentos.ts
│   └── dashboard.ts
├── frontend/              React + Vite
│   ├── src/
│   │   ├── pages/         rotas
│   │   ├── components/    UI
│   │   ├── lib/           helpers
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── index.html
├── scripts/               Python helpers
│   ├── import_from_sheets.py
│   └── deploy.py
├── server-config/         configs do server
│   ├── nginx-viaturas.conf
│   ├── docker-compose.yml
│   └── .env
└── docs/                  documentação
```

## Cronograma

- **Semana 1:** Setup infra + Auth + Agendar + Workflow aprovação + Calendário
- **Semana 2:** CRUD Viaturas + Atribuição + Dashboard
- **Semana 3:** Gestão usuários + Importar xlsx + Polish

Deploy: sexta-feira de cada semana.
