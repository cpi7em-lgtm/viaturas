import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { getUser } from '../lib/auth'
import { createAgendamento, satConsulta } from '../lib/api'
import { UNIDADES_REQUERENTES, SELECT_SECOES_SETORES, SELECT_TIPOS_VIATURA, POSTO_GRADUACAO } from '../lib/constants'

interface SatResult {
  encontrado: boolean
  erro?: string
  re?: string
  postoGraduacao?: string
  nome?: string
  opm?: string
  opmCode?: string
  cnhCategoria?: string
  boletim?: string
  dataProva?: string
  cassada?: boolean
  // FIX (William 2026-08-24): todas as publicacoes de habilitacao
  publicacoes?: Array<{
    categoria: string
    boletim: string
    data: string
    cassada: boolean
  }>
}

export default function AgendarPage() {
  const user = getUser()
  const nav = useNavigate()

  // Solicitante (auto do user)
  const [unidadeRequerente, setUnidadeRequerente] = useState('')
  const [unidadeRequerenteOutro, setUnidadeRequerenteOutro] = useState('')
  const [secaoSetor, setSecaoSetor] = useState('')
  const [secaoSetorOutro, setSecaoSetorOutro] = useState('')
  const [tipoViatura, setTipoViatura] = useState('')
  const [tipoViaturaOutro, setTipoViaturaOutro] = useState('')
  const [dataMissao, setdataMissao] = useState('')
  const [destino, setDestino] = useState('')
  const [finalidade, setFinalidade] = useState('')
  const [oficialAutorizador, setOficialAutorizador] = useState('')
  const [retiradaData, setRetiradaData] = useState('')
  const [retiradaHora, setRetiradaHora] = useState('')
  const [devolucaoData, setDevolucaoData] = useState('')
  const [devolucaoHora, setDevolucaoHora] = useState('')

  // Motorista (SAT)
  const [solicitanteMotorista, setSolicitanteMotorista] = useState(true)
  const [motoristaRe, setMotoristaRe] = useState('')
  const [satResult, setSatResult] = useState<SatResult | null>(null)
  const [satLoading, setSatLoading] = useState(false)
  const [satErro, setSatErro] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  async function buscarMotorista() {
    const reLimpo = (solicitanteMotorista ? (user.re || '') : motoristaRe).replace(/\D/g, '').trim()
    if (reLimpo.length < 2) {
      setSatErro('RE invalido')
      return
    }
    setSatLoading(true)
    setSatErro('')
    setSatResult(null)
    try {
      const r = await satConsulta(reLimpo)
      setSatResult(r)
      if (!r.encontrado) setSatErro(r.erro || 'PM não encontrado no SAT')
    } catch (e: any) {
      setSatErro(e.message)
    } finally {
      setSatLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSubmitting(true)
    try {
      if (!unidadeRequerente) throw new Error('Selecione a unidade requerente')
      if (unidadeRequerente === 'OUTRO' && !unidadeRequerenteOutro.trim()) {
        throw new Error('Especifique a unidade requerente (Outro)')
      }
      if (!secaoSetor) throw new Error('Selecione a secao/setor')
      if (secaoSetor === 'OUTRO' && !secaoSetorOutro.trim()) {
        throw new Error('Especifique a secao/setor (Outro)')
      }
      if (!tipoViatura) throw new Error('Selecione o tipo de viatura')
      if (tipoViatura === 'OUTRO' && !tipoViaturaOutro.trim()) {
        throw new Error('Especifique o tipo de viatura (Outro)')
      }
      if (!dataMissao || !retiradaData || !devolucaoData) {
        throw new Error('Preencha as datas')
      }
      if (!retiradaHora || !devolucaoHora) {
        throw new Error('Preencha os horarios')
      }
      if (!destino.trim() || !finalidade.trim()) {
        throw new Error('Preencha destino e finalidade')
      }
      if (!oficialAutorizador.trim()) {
        throw new Error('Preencha o oficial que autorizou')
      }
      if (!satResult || !satResult.encontrado) {
        throw new Error('Busque o motorista no SAT antes de enviar')
      }

      const args: any = {
        cpf: user.cpf,
        // Unidade REQUERENTE (escolhida pelo PM)
        unidadeRequerente,
        unidadeRequerenteOutro: unidadeRequerente === 'OUTRO' ? unidadeRequerenteOutro : undefined,
        // Seção/Setor dentro da unidade requerente
        secaoSetor: secaoSetor === 'OUTRO' ? secaoSetorOutro : secaoSetor,
        tipoViaturaSolicitada: tipoViatura,
        tipoViaturaOutro: tipoViatura === 'OUTRO' ? tipoViaturaOutro : undefined,
        dataMissao: new Date(dataMissao).getTime(),
        destino,
        finalidade,
        oficialAutorizador,
        retiradaData: new Date(retiradaData).getTime(),
        retiradaHora,
        devolucaoData: new Date(devolucaoData).getTime(),
        devolucaoHora,
        solicitanteMotorista,
        motoristaRe: satResult.re,
        motoristaPosto: satResult.postoGraduacao,
        motoristaNome: satResult.nome,
        motoristaOpm: satResult.opm,
        motoristaOpmCode: satResult.opmCode,
        motoristaCnh: satResult.cnhCategoria,
        motoristaBoletim: satResult.boletim,
        motoristaDataProva: satResult.dataProva,
        // FIX (William 2026-08-24): salva todas as publicacoes
        motoristaPublicacoes: satResult.publicacoes,
      }

      await createAgendamento(args)
      setSucesso(true)
      setTimeout(() => nav('/agendamentos'), 1500)
    } catch (err: any) {
      setErro(err.message || 'Erro ao agendar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Agendar Viatura</h1>
        <p>Preencha o formulário para reservar uma viatura para a missão</p>
      </div>

      {sucesso && (
        <div className="alert alert-success">
          Agendamento criado com sucesso! Redirecionando...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Dados do Solicitante</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Posto/Graduacao</label>
              <input type="text" value={user.postoGraduacao || ''} readOnly />
            </div>
            <div className="form-group">
              <label>RE</label>
              <input type="text" value={user.re || ''} readOnly />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Nome de Guerra</label>
              <input type="text" value={user.warName || ''} readOnly />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input type="text" value={user.email || ''} readOnly />
            </div>
          </div>
        </div>

        {/* MOTORISTA (SAT) */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Motorista (consulta SAT)</h3>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: 8 }}>O solicitante é o proprio motorista? <span className="required">*</span></label>
            <label style={{ display: 'inline-flex', alignItems: 'center', marginRight: 16, cursor: 'pointer' }}>
              <input type="radio" name="solMotorista" checked={solicitanteMotorista} onChange={() => { setSolicitanteMotorista(true); setSatResult(null); }} style={{ marginRight: 4 }} />
              Sim, eu vou dirigir
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="radio" name="solMotorista" checked={!solicitanteMotorista} onChange={() => { setSolicitanteMotorista(false); setSatResult(null); }} style={{ marginRight: 4 }} />
              Não, outro PM vai dirigir
            </label>
          </div>

          {!solicitanteMotorista && (
            <div className="form-group">
              <label>RE do motorista (sem digito verificador) <span className="required">*</span></label>
              <input
                type="text"
                value={motoristaRe}
                onChange={e => setMotoristaRe(e.target.value)}
                placeholder="Ex: 111926"
                maxLength={6}
                style={{ fontFamily: 'monospace' }}
              />
            </div>
          )}

          <button type="button" className="btn btn-primary" onClick={buscarMotorista} disabled={satLoading}>
            {satLoading ? 'Consultando SAT...' : 'Buscar no SAT'}
          </button>
          {satErro && <div className="alert alert-error" style={{ marginTop: 8 }}>{satErro}</div>}

          {satResult && satResult.encontrado && (
            <div style={{ marginTop: 12, padding: 12, background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: 4 }}>
              <table style={{ fontSize: 14 }}>
                <tbody>
                  <tr><td style={{ color: '#666', paddingRight: 12 }}>Motorista:</td><td><strong>{satResult.postoGraduacao} {satResult.nome}</strong></td></tr>
                  <tr><td style={{ color: '#666' }}>RE:</td><td style={{ fontFamily: 'monospace' }}>{satResult.re}</td></tr>
                  <tr><td style={{ color: '#666' }}>OPM:</td><td>{satResult.opm} ({satResult.opmCode})</td></tr>
                  <tr>
                    <td style={{ color: '#666', verticalAlign: 'top' }}>CNH:</td>
                    <td>
                      {/* FIX (William 2026-08-24): mostra TODAS as publicacoes,
                          sem destaque hierarquico (todas sao iguais) */}
                      {satResult.publicacoes && satResult.publicacoes.length > 0 ? (
                        <table style={{ fontSize: 13, borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ color: '#666', fontSize: 11 }}>
                              <th style={{ textAlign: 'left', padding: '2px 8px 2px 0', fontWeight: 500 }}>Cat</th>
                              <th style={{ textAlign: 'left', padding: '2px 8px 2px 0', fontWeight: 500 }}>Boletim</th>
                              <th style={{ textAlign: 'left', padding: '2px 0 2px 0', fontWeight: 500 }}>Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {satResult.publicacoes.map((p, i) => (
                              <tr key={i} style={{
                                background: p.cassada ? '#ffebee' : 'transparent',
                                color: p.cassada ? '#c62828' : 'inherit',
                              }}>
                                <td style={{ padding: '2px 8px 2px 0', fontWeight: 600 }}>{p.categoria}</td>
                                <td style={{ padding: '2px 8px 2px 0' }}>
                                  {p.boletim ? <code style={{ fontSize: 12 }}>{p.boletim}</code> : '-'}
                                </td>
                                <td style={{ padding: '2px 0' }}>{p.data || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <span>{satResult.cnhCategoria} (Boletim: {satResult.boletim}, {satResult.dataProva})</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Unidade / Missão</h3>

          <div className="alert" style={{ background: '#e3f2fd', border: '1px solid #1976d2', color: '#0d47a1', marginBottom: 12, padding: 10, borderRadius: 4 }}>
            <strong>Sua OPM de origem:</strong> {user.unitName || user.opmCode || '?'} (automatica do seu login, não editavel).
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Unidade REQUERENTE (pra qual unidade vai a viatura?) <span className="required">*</span></label>
              <select value={unidadeRequerente} onChange={e => setUnidadeRequerente(e.target.value)} required>
                <option value="">Selecione...</option>
                {UNIDADES_REQUERENTES.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Seção/Setor (dentro da unidade requerente) <span className="required">*</span></label>
              <select value={secaoSetor} onChange={e => setSecaoSetor(e.target.value)} required>
                <option value="">Selecione...</option>
                {SELECT_SECOES_SETORES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          {unidadeRequerente === 'OUTRO' && (
            <div className="form-group">
              <label>Especifique a unidade requerente</label>
              <input
                type="text"
                value={unidadeRequerenteOutro}
                onChange={e => setUnidadeRequerenteOutro(e.target.value)}
                placeholder="Descreva a unidade"
                required
              />
            </div>
          )}
          {secaoSetor === 'OUTRO' && (
            <div className="form-group">
              <label>Especifique a secao/setor</label>
              <input
                type="text"
                value={secaoSetorOutro}
                onChange={e => setSecaoSetorOutro(e.target.value)}
                placeholder="Descreva a secao/setor"
                required
              />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Data da Missão <span className="required">*</span></label>
              <input type="date" value={dataMissao} onChange={e => setdataMissao(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Tipo de Viatura <span className="required">*</span></label>
              <select value={tipoViatura} onChange={e => setTipoViatura(e.target.value)} required>
                <option value="">Selecione...</option>
                {SELECT_TIPOS_VIATURA.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          {tipoViatura === 'OUTRO' && (
            <div className="form-group">
              <label>Especifique o tipo de viatura</label>
              <input
                type="text"
                value={tipoViaturaOutro}
                onChange={e => setTipoViaturaOutro(e.target.value)}
                placeholder="Descreva o tipo"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Destino e Finalidade da Missão <span className="required">*</span></label>
            <textarea
              value={destino}
              onChange={e => setDestino(e.target.value)}
              placeholder="Descreva o destino e a finalidade da missão"
              required
            />
          </div>
          <div className="form-group">
            <label>Finalidade (resumo) <span className="required">*</span></label>
            <textarea
              value={finalidade}
              onChange={e => setFinalidade(e.target.value)}
              placeholder="Resumo da missão"
              required
            />
          </div>
          <div className="form-group">
            <label>Oficial que autorizou o deslocamento <span className="required">*</span></label>
            <input
              type="text"
              value={oficialAutorizador}
              onChange={e => setOficialAutorizador(e.target.value)}
              placeholder="Nome e posto do oficial"
              required
            />
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Retirada e Devolucao</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Data de Retirada <span className="required">*</span></label>
              <input type="date" value={retiradaData} onChange={e => setRetiradaData(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Horario de Retirada <span className="required">*</span></label>
              <input type="time" value={retiradaHora} onChange={e => setRetiradaHora(e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Data de Devolucao <span className="required">*</span></label>
              <input type="date" value={devolucaoData} onChange={e => setDevolucaoData(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Horario de Devolucao <span className="required">*</span></label>
              <input type="time" value={devolucaoHora} onChange={e => setDevolucaoHora(e.target.value)} required />
            </div>
          </div>
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Solicitar Agendamento'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => nav('/agendamentos')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
