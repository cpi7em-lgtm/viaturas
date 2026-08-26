import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { getUser, isGestor, isAdmin, isMaster } from '../lib/auth'
import { listAgendamentos, approveAgendamento, rejectAgendamento, atribuirViatura, concluirAgendamento, cancelAgendamento, listViaturas, listUnits, getUltimoOdometro, editarOdometro, excluirAgendamento } from '../lib/api'
import { STATUS_AGENDAMENTO } from '../lib/constants'

export default function AgendamentosPage() {
  const user = getUser()
  const [filtro, setFiltro] = useState<string>('')
  // FIX (William 2026-08-24): filtro por data da RETIRADA
  const [filtroDataInicio, setFiltroDataInicio] = useState<string>('')
  const [filtroDataFim, setFiltroDataFim] = useState<string>('')
  const [agendamentos, setAgendamentos] = useState<any[]>([])
  const [viaturas, setViaturas] = useState<any[]>([])
  const [unitsMap, setUnitsMap] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [detalhe, setDetalhe] = useState<any>(null)  // modal de detalhes

  if (!user) return <Navigate to="/login" replace />

  function carregar() {
    if (!user) return
    setLoading(true)
    Promise.all([
      listAgendamentos(user.cpf, filtro || undefined),
      isGestor() || isAdmin() ? listViaturas(user.cpf, undefined, true) : Promise.resolve([]),
      listUnits().catch(() => []),
    ])
      .then(([ags, viats, units]) => {
        setAgendamentos(ags)
        setViaturas(viats)
        const m: Record<string, any> = {}
        for (const u of units) m[u._id] = u
        setUnitsMap(m)
      })
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [filtro, user?.cpf])

  async function handleApprove(id: string) {
    if (!user) return
    if (!confirm('Aprovar este agendamento?')) return
    try {
      await approveAgendamento(user.cpf, id)
      carregar()
    } catch (e: any) { alert(e.message) }
  }

  async function handleReject(id: string) {
    if (!user) return
    const motivo = prompt('Motivo da rejeição:')
    if (!motivo) return
    try {
      await rejectAgendamento(user.cpf, id, motivo)
      carregar()
    } catch (e: any) { alert(e.message) }
  }

  async function handleAtribuir(agendamentoId: string) {
    if (!user) return
    const prefixo = prompt('Prefixo da viatura (ex: I-07019):')
    if (!prefixo) return
    const v = viaturas.find(x => x.prefixo === prefixo)
    if (!v) {
      alert('Viatura não encontrada com esse prefixo')
      return
    }

    // FIX (William 2026-08-19): pedir odometro de retirada (obrigatorio)
    // Sugere o ultimo odometro conhecido dessa viatura (se houver)
    let sugestaoKm = ''
    try {
      const ult = await getUltimoOdometro(v._id)
      if (ult && typeof ult.ultimoOdometro === 'number') {
        sugestaoKm = String(ult.ultimoOdometro)
      }
    } catch (e) {
      // ignora - sem sugestao
    }

    const msgSugestao = sugestaoKm
      ? `\n\nÚltima KM registrada: ${sugestaoKm} (Confirme se está correto)`
      : ''
    const kmStr = prompt(
      `KM ATUAL da viatura ${v.prefixo} (odômetro de retirada):${msgSugestao}`,
      sugestaoKm,
    )
    if (kmStr === null) return  // cancelou
    const km = parseInt(kmStr, 10)
    if (isNaN(km) || km < 0) {
      alert('KM inválida. Informe um número >= 0.')
      return
    }

    try {
      await atribuirViatura(user.cpf, agendamentoId, v._id, km)
      carregar()
    } catch (e: any) { alert(e.message) }
  }

  async function handleConcluir(id: string) {
    if (!user) return
    // FIX (William 2026-08-19): pedir odometro de devolucao (obrigatorio)
    // Sugere o odometro de retirada (sempre tem, ja que passou por Atribuir)
    const ag = agendamentos.find(x => x._id === id)
    const kmRetirada = ag?.odometroRetirada
    const sugestao = typeof kmRetirada === 'number' ? String(kmRetirada) : ''
    const msgSug = sugestao
      ? `\n\nOdômetro de retirada: ${sugestao} (KM na hora de pegar a viatura)`
      : ''
    const kmStr = prompt(
      `KM FINAL da viatura (odômetro de devolução):${msgSug}\n\nInforme a KM atual do painel:`,
      sugestao,
    )
    if (kmStr === null) return
    const km = parseInt(kmStr, 10)
    if (isNaN(km) || km < 0) {
      alert('KM inválida. Informe um número >= 0.')
      return
    }
    if (typeof kmRetirada === 'number' && km < kmRetirada) {
      alert(`KM final (${km}) é MENOR que a KM de retirada (${kmRetirada}). Verifique o número.`)
      return
    }
    if (!confirm('Marcar este agendamento como concluido?')) return
    try {
      const res = await concluirAgendamento(user.cpf, id, km)
      const kmR = res?.kmRodados
      if (typeof kmR === 'number') {
        alert(`Concluído! KM rodados: ${kmR}`)
      }
      carregar()
    } catch (e: any) { alert(e.message) }
  }

  async function handleCancel(id: string) {
    if (!user) return
    if (!confirm('Cancelar este agendamento?')) return
    try {
      await cancelAgendamento(user.cpf, id)
      carregar()
    } catch (e: any) { alert(e.message) }
  }

  // FIX (William 2026-08-21): excluir agendamento (APENAS ADMIN MASTER - soh William)
  async function handleExcluir(id: string, info: string) {
    if (!user) return
    if (!isMaster()) {
      alert('Apenas admin master pode excluir agendamentos.')
      return
    }
    const ok = confirm(
      `EXCLUIR PERMANENTEMENTE o agendamento?\n\n${info}\n\nEssa ação NÃO pode ser desfeita.`
    )
    if (!ok) return
    try {
      await excluirAgendamento(user.cpf, id)
      alert('Agendamento excluído.')
      setDetalhe(null)  // fecha modal se tiver aberto
      carregar()
    } catch (e: any) { alert(e.message) }
  }

  // FIX (William 2026-08-19): gestor/admin edita odometro caso erro
  async function handleEditarOdometro(ag: any) {
    if (!user) return
    const tipoStr = prompt(
      'Qual odômetro quer editar?\n\nDigite:\n  1 = Retirada\n  2 = Devolução',
      '1',
    )
    if (tipoStr === null) return
    const tipo = tipoStr === '2' ? 'devolucao' : 'retirada'
    const valorAtual = tipo === 'retirada' ? ag.odometroRetirada : ag.odometroDevolucao
    const novoStr = prompt(
      `Novo valor do odômetro de ${tipo.toUpperCase()}\n(Atual: ${valorAtual ?? 'não registrado'} km)`,
      valorAtual !== null && valorAtual !== undefined ? String(valorAtual) : '',
    )
    if (novoStr === null) return
    const novo = parseInt(novoStr, 10)
    if (isNaN(novo) || novo < 0) {
      alert('Valor inválido (deve ser >= 0)')
      return
    }
    if (!confirm(`Confirmar edição do odômetro de ${tipo} para ${novo} km?`)) return
    try {
      await editarOdometro(user.cpf, ag._id, tipo, novo)
      alert('Odômetro atualizado!')
      carregar()
    } catch (e: any) { alert(e.message) }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Agendamentos</h1>
        <p>Lista de todos os agendamentos da sua unidade</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className={`btn ${filtro === '' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFiltro('')}>Todos</button>
        <button className={`btn ${filtro === 'pendente' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFiltro('pendente')}>Pendentes</button>
        <button className={`btn ${filtro === 'aprovado' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFiltro('aprovado')}>Aprovados</button>
        <button className={`btn ${filtro === 'rejeitado' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFiltro('rejeitado')}>Rejeitados</button>
        <button className={`btn ${filtro === 'concluido' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFiltro('concluido')}>Concluidos</button>

        {/* FIX (William 2026-08-24): filtro por data da RETIRADA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 16 }}>
          <label style={{ fontSize: 13, color: '#666' }}>Retirada:</label>
          <input
            type="date"
            value={filtroDataInicio}
            onChange={e => setFiltroDataInicio(e.target.value)}
            style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }}
            title="Data inicial da retirada"
          />
          <span style={{ color: '#666' }}>até</span>
          <input
            type="date"
            value={filtroDataFim}
            onChange={e => setFiltroDataFim(e.target.value)}
            style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }}
            title="Data final da retirada"
          />
          {(filtroDataInicio || filtroDataFim) && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { setFiltroDataInicio(''); setFiltroDataFim('') }}
              title="Limpar filtro de data"
              style={{ padding: '2px 8px', fontSize: 12 }}
            >×</button>
          )}
        </div>

        <div style={{ flex: 1 }}></div>
        <Link to="/agendar" className="btn btn-primary">+ Novo</Link>
      </div>

      {erro && <div className="alert alert-error">{erro}</div>}

      {loading ? <p>Carregando...</p> : (
        <div className="card">
          {/* FIX (William 2026-08-24): filtro de data da retirada (client-side) */}
          {(() => {
            const filtrados = agendamentos.filter((a: any) => {
              if (!filtroDataInicio && !filtroDataFim) return true
              const r = new Date(a.retiradaData)
              const rStr = r.toISOString().slice(0, 10)
              if (filtroDataInicio && rStr < filtroDataInicio) return false
              if (filtroDataFim && rStr > filtroDataFim) return false
              return true
            })
            if (filtrados.length === 0) {
              return <p style={{ color: '#666' }}>Nenhum agendamento encontrado no período selecionado.</p>
            }
            return (
            <table className="table">
              <thead>
                <tr>
                  <th>Data Missão</th>
                  <th>Solicitante</th>
                  <th>Unidade</th>
                  <th>Tipo VTR</th>
                  <th>Destino / Finalidade</th>
                  <th>Retirada</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(a => {
                  const unidadeReq = unitsMap[a.unidadeRequerente]
                  const unidadeOrig = unitsMap[a.unidadeOrigem]
                  const unidadeReqLabel = unidadeReq ? (unidadeReq.sigla || unidadeReq.name) : '?'
                  const unidadeOrigLabel = unidadeOrig ? (unidadeOrig.sigla || unidadeOrig.name) : '-'
                  // FIX (William 2026-08-19): mostra prefixo da viatura atribuida
                  // ao inves do ID cru do Convex
                  const viaturaAtribuida = a.viaturaAtribuida
                    ? viaturas.find(v => v._id === a.viaturaAtribuida)
                    : null
                  const viaturaLabel = viaturaAtribuida
                    ? `${viaturaAtribuida.prefixo}${viaturaAtribuida.placa ? ' (' + viaturaAtribuida.placa + ')' : ''}`
                    : null
                  return (
                  <tr key={a._id}>
                    <td>{new Date(a.dataMissao).toLocaleDateString('pt-BR')}</td>
                    <td>{a.postoGraduacao} {a.nomeGuerra}<br /><small style={{ color: '#888' }}>RE {a.re}</small></td>
                    <td>
                      <strong>Req: {unidadeReqLabel}</strong>
                      <div style={{ fontSize: 11, color: '#666' }}>Orig: {unidadeOrigLabel}</div>
                      {a.secaoSetor && <div style={{ fontSize: 11, color: '#888' }}>{a.secaoSetor}</div>}
                      {a.unidadeRequerenteOutro && <div style={{ fontSize: 11, color: '#888' }}>Outro: {a.unidadeRequerenteOutro}</div>}
                    </td>
                    <td>
                      {a.tipoViaturaSolicitada}
                      {a.tipoViaturaOutro && <div style={{ fontSize: 11, color: '#888' }}>{a.tipoViaturaOutro}</div>}
                    </td>
                    <td style={{ maxWidth: 240 }}>
                      <div><strong>{a.destino}</strong></div>
                      <div style={{ fontSize: 12, color: '#666' }}>{a.finalidade}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {new Date(a.retiradaData).toLocaleDateString('pt-BR')} <strong>{a.retiradaHora}</strong>
                      <div style={{ color: '#888' }}>
                        até {new Date(a.devolucaoData).toLocaleDateString('pt-BR')} {a.devolucaoHora}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${a.status}`}>
                        {STATUS_AGENDAMENTO[a.status]?.label || a.status}
                      </span>
                      {viaturaLabel && <div style={{ fontSize: 11, color: '#1976d2', fontWeight: 600 }}>VTR: {viaturaLabel}</div>}
                      {/* KM rodados quando concluido (William 2026-08-19) */}
                      {a.status === 'concluido' && typeof a.kmRodados === 'number' && (
                        <div style={{ fontSize: 11, color: '#2e7d32', fontWeight: 600, marginTop: 2 }}>
                          🚗 {a.kmRodados.toLocaleString('pt-BR')} km
                        </div>
                      )}
                      {a.status === 'aprovado' && typeof a.odometroRetirada === 'number' && (
                        <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                          KM inicial: {a.odometroRetirada.toLocaleString('pt-BR')}
                        </div>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => setDetalhe(a)}>Detalhes</button>
                      {' '}
                      {a.status === 'pendente' && (isGestor() || isAdmin()) && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => handleApprove(a._id)}>Aprovar</button>
                          {' '}
                          <button className="btn btn-danger btn-sm" onClick={() => handleReject(a._id)}>Rejeitar</button>
                        </>
                      )}
                      {a.status === 'aprovado' && (
                        <>
                          {(!a.viaturaAtribuida) && (
                            <button className="btn btn-primary btn-sm" onClick={() => handleAtribuir(a._id)}>Atribuir VTR</button>
                          )}
                          {' '}
                          <button className="btn btn-secondary btn-sm" onClick={() => handleConcluir(a._id)}>Concluir</button>
                        </>
                      )}
                      {a.status !== 'concluido' && a.status !== 'cancelado' && a.status !== 'rejeitado' && (
                        <>{' '}<button className="btn btn-secondary btn-sm" onClick={() => handleCancel(a._id)}>Cancelar</button></>
                      )}
                      {/* FIX (William 2026-08-21): botao Excluir (so admin master) */}
                      {isMaster() && (
                        <>{' '}<button
                          className="btn btn-danger btn-sm"
                          title="Excluir permanentemente (apenas admin master)"
                          onClick={() => handleExcluir(a._id,
                            `${a.postoGraduacao} ${a.nomeGuerra} (RE ${a.re}) - ${new Date(a.dataMissao).toLocaleDateString('pt-BR')}`
                          )}
                        >🗑️ Excluir</button></>
                      )}
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
            )
          })()}
        </div>
      )}

      {/* Modal de detalhes */}
      {detalhe && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20,
        }} onClick={() => setDetalhe(null)}>
          <div style={{
            background: 'white', borderRadius: 8, padding: 24,
            maxWidth: 700, width: '100%', maxHeight: '90vh', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Detalhes do Agendamento</h2>
            <table className="table" style={{ fontSize: 14 }}>
              <tbody>
                <tr><th>Status</th><td>
                  <span className={`badge badge-${detalhe.status}`}>
                    {STATUS_AGENDAMENTO[detalhe.status]?.label || detalhe.status}
                  </span>
                </td></tr>
                <tr><th>Solicitante</th><td>{detalhe.postoGraduacao} {detalhe.nomeGuerra} (RE {detalhe.re})</td></tr>
                <tr><th>Email</th><td>{detalhe.email}</td></tr>
                <tr><th>Unidade ORIGEM</th><td>
                  {unitsMap[detalhe.unidadeOrigem]?.sigla || '?'}
                  {' '}({(unitsMap[detalhe.unidadeOrigem]?.name) || '?'})
                  <div style={{ fontSize: 11, color: '#888' }}>(OPM do PM logado, automatica)</div>
                </td></tr>
                <tr><th>Unidade REQUERENTE</th><td>
                  <strong>{unitsMap[detalhe.unidadeRequerente]?.sigla || '?'}</strong>
                  {' '}({(unitsMap[detalhe.unidadeRequerente]?.name) || '?'})
                  {detalhe.unidadeRequerenteOutro && <div style={{ fontSize: 12, color: '#888' }}>Outro: {detalhe.unidadeRequerenteOutro}</div>}
                  <div style={{ fontSize: 11, color: '#888' }}>(gestor dessa unidade que aprova)</div>
                </td></tr>
                {detalhe.secaoSetor && (
                  <tr><th>Seção/Setor</th><td>{detalhe.secaoSetor}</td></tr>
                )}
                <tr><th>Data Missão</th><td>{new Date(detalhe.dataMissao).toLocaleDateString('pt-BR')}</td></tr>
                <tr><th>Destino</th><td>{detalhe.destino}</td></tr>
                <tr><th>Finalidade</th><td style={{ whiteSpace: 'pé-wrap' }}>{detalhe.finalidade}</td></tr>
                <tr><th>Oficial Autorizador</th><td>{detalhe.oficialAutorizador}</td></tr>
                <tr><th>Tipo Viatura Solicitada</th><td>
                  {detalhe.tipoViaturaSolicitada}
                  {detalhe.tipoViaturaOutro && <div style={{ fontSize: 12, color: '#888' }}>Outro: {detalhe.tipoViaturaOutro}</div>}
                </td></tr>
                <tr><th>Retirada</th><td>{new Date(detalhe.retiradaData).toLocaleDateString('pt-BR')} as <strong>{detalhe.retiradaHora}</strong></td></tr>
                <tr><th>Devolucao</th><td>{new Date(detalhe.devolucaoData).toLocaleDateString('pt-BR')} as <strong>{detalhe.devolucaoHora}</strong></td></tr>
                {detalhe.viaturaAtribuida && (() => {
                  // FIX (William 2026-08-19): mostra prefixo + placa ao inves do ID
                  const v = viaturas.find(x => x._id === detalhe.viaturaAtribuida)
                  if (v) {
                    return (
                      <tr>
                        <th>Viatura Atribuída</th>
                        <td>
                          <strong style={{ color: '#1976d2' }}>{v.prefixo}</strong>
                          {v.placa && <span style={{ marginLeft: 8, color: '#666' }}>({v.placa})</span>}
                          {v.tipo && <div style={{ fontSize: 12, color: '#888' }}>{v.tipo}</div>}
                        </td>
                      </tr>
                    )
                  }
                  // Viatura nao encontrada na lista (pode ter sido removida)
                  return (
                    <tr>
                      <th>Viatura Atribuída</th>
                      <td>
                        <strong style={{ color: '#999' }}>ID: {detalhe.viaturaAtribuida}</strong>
                        <div style={{ fontSize: 11, color: '#c62828' }}>(viatura não encontrada - foi removida?)</div>
                      </td>
                    </tr>
                  )
                })()}
                {/* ODOMETRO (William 2026-08-19) */}
                {(typeof detalhe.odometroRetirada === 'number' || typeof detalhe.odometroDevolucao === 'number') && (
                  <tr>
                    <th>Odômetro</th>
                    <td>
                      {typeof detalhe.odometroRetirada === 'number' && (
                        <div>
                          <span style={{ color: '#666' }}>Retirada:</span>{' '}
                          <strong>{detalhe.odometroRetirada.toLocaleString('pt-BR')} km</strong>
                          {detalhe.odometroRetiradaEm && (
                            <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>
                              em {new Date(detalhe.odometroRetiradaEm).toLocaleString('pt-BR')}
                            </span>
                          )}
                        </div>
                      )}
                      {typeof detalhe.odometroDevolucao === 'number' && (
                        <div style={{ marginTop: 4 }}>
                          <span style={{ color: '#666' }}>Devolução:</span>{' '}
                          <strong>{detalhe.odometroDevolucao.toLocaleString('pt-BR')} km</strong>
                          {detalhe.odometroDevolucaoEm && (
                            <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>
                              em {new Date(detalhe.odometroDevolucaoEm).toLocaleString('pt-BR')}
                            </span>
                          )}
                        </div>
                      )}
                      {typeof detalhe.kmRodados === 'number' && detalhe.kmRodados >= 0 && (
                        <div style={{ marginTop: 6, padding: 4, background: '#e8f5e9', borderRadius: 4, display: 'inline-block' }}>
                          <strong style={{ color: '#2e7d32' }}>🚗 {detalhe.kmRodados.toLocaleString('pt-BR')} km rodados</strong>
                          {detalhe.odometroEditado && (
                            <span style={{ fontSize: 10, color: '#f57c00', marginLeft: 8 }}>(editado manualmente)</span>
                          )}
                        </div>
                      )}
                      {/* Botao de editar pra gestor/admin */}
                      {(isGestor() || isAdmin()) && (
                        <div style={{ marginTop: 8 }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditarOdometro(detalhe)}
                          >
                            ✏️ Editar odômetro
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
                {detalhe.motivoRejeição && (
                  <tr><th>Motivo Rejeição</th><td style={{ color: '#c62828' }}>{detalhe.motivoRejeição}</td></tr>
                )}
                {(detalhe.motoristaNome || detalhe.motoristaRe) && (
                  <tr><th>Motorista</th><td>
                    {detalhe.motoristaPosto} <strong>{detalhe.motoristaNome}</strong> (RE {detalhe.motoristaRe})
                    <div style={{ fontSize: 12, color: '#666' }}>
                      OPM: {detalhe.motoristaOpm} ({detalhe.motoristaOpmCode}) |
                      CNH: {detalhe.motoristaCnh} (Boletim: {detalhe.motoristaBoletim}, {detalhe.motoristaDataProva})
                    </div>
                  </td></tr>
                )}
                <tr><th>Criado em</th><td>{new Date(detalhe.criadoEm).toLocaleString('pt-BR')}</td></tr>
                {detalhe.aprovadoEm && <tr><th>Aprovado em</th><td>{new Date(detalhe.aprovadoEm).toLocaleString('pt-BR')}</td></tr>}
                {detalhe.concluidoEm && <tr><th>Concluído em</th><td>{new Date(detalhe.concluidoEm).toLocaleString('pt-BR')}</td></tr>}
              </tbody>
            </table>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {/* FIX (William 2026-08-21): botao Excluir no modal (so admin master) */}
                {isMaster() && detalhe && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleExcluir(detalhe._id,
                      `${detalhe.postoGraduacao} ${detalhe.nomeGuerra} (RE ${detalhe.re}) - ${new Date(detalhe.dataMissao).toLocaleDateString('pt-BR')}`
                    )}
                  >
                    🗑️ Excluir permanentemente
                  </button>
                )}
              </div>
              <button className="btn btn-secondary" onClick={() => setDetalhe(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
