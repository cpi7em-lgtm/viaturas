import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getUser, isAdmin } from '../lib/auth'
import { listAllUsers, setViaturasRole, listUnits } from '../lib/api'

export default function GestaoUsuariosPage() {
  const user = getUser()
  const [usuários, setUsuarios] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')

  // Modal de edição completa (Role + unidades + escopo)
  const [editando, setEditando] = useState<any | null>(null)
  const [editRole, setEditRole] = useState('viewer')
  const [editUnidadesGestor, setEditUnidadesGestor] = useState<string[]>([])
  const [editUnidadesEditor, setEditUnidadesEditor] = useState<string[]>([])
  // FIX (William 2026-08-18): escopo controla se os dropdowns de unidade
  // ficam livres ou travados. Default: "restrito" (mais seguro)
  const [editEscopo, setEditEscopo] = useState<'livre' | 'restrito'>('restrito')
  const [editSalvo, setEditSalvo] = useState(false)
  const [editErro, setEditErro] = useState('')

  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin()) {
    return (
      <div className="alert alert-error">
        Acesso restrito a administradores.
      </div>
    )
  }
  const canEdit = isAdmin()

  function carregar() {
    setLoading(true)
    Promise.all([listAllUsers(), listUnits()])
      .then(([us, us2]) => {
        setUsuarios(us)
        setUnits(us2)
      })
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [])

  const filtrados = usuários.filter(u => {
    if (!busca) return true
    const q = busca.toLowerCase().trim()
    // FIX (William 2026-08-25): busca focada em RE + nome/guerra
    // (removido match por CPF - admin master usa o RE pra localizar)
    return (
      (u.re || '').toLowerCase().includes(q) ||
      (u.warName || '').toLowerCase().includes(q) ||
      (u.name || '').toLowerCase().includes(q)
    )
  })

  function abrirEdição(u: any) {
    setEditando(u)
    setEditRole(u.viaturasRole || 'viewer')
    setEditUnidadesGestor(u.unidadesGestor || [])
    setEditUnidadesEditor(u.unidadesEditor || [])
    setEditEscopo(u.escopo || 'restrito')  // FIX (William 2026-08-18)
    setEditSalvo(false)
    setEditErro('')
  }

  function fecharEdição() {
    setEditando(null)
    setEditSalvo(false)
    setEditErro('')
  }

  function toggleUnidade(tipo: 'gestor' | 'editor', unitId: string) {
    const setter = tipo === 'gestor' ? setEditUnidadesGestor : setEditUnidadesEditor
    const current = tipo === 'gestor' ? editUnidadesGestor : editUnidadesEditor
    setter(current.includes(unitId) ? current.filter(id => id !== unitId) : [...current, unitId])
  }

  async function salvarEdição() {
    if (!editando) return
    setEditSalvo(false)
    setEditErro('')
    try {
      await setViaturasRole({
        cpf: editando.cpf,
        viaturasRole: editRole as any,
        unidadesGestor: editUnidadesGestor,
        unidadesEditor: editUnidadesEditor,
        escopo: editEscopo,  // FIX (William 2026-08-18)
      } as any)
      setEditSalvo(true)
      carregar()
      setTimeout(() => fecharEdição(), 800)
    } catch (e: any) {
      setEditErro(e.message)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Gestão de Usuários</h1>
        <p>Filtrar por RE e atribuir role + unidades no app</p>
      </div>

      {/* FILTRO LIVRE POR RE (FOCO PRINCIPAL) - FIX (William 2026-08-25) */}
      <div className="form-group">
        <input
          type="text"
          placeholder="🔍 Filtrar por RE, nome de guerra ou nome completo..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      {erro && <div className="alert alert-error">{erro}</div>}

      {loading ? <p>Carregando...</p> : (
        <div className="card">
          <p style={{ color: '#666', fontSize: 13 }}>
            {filtrados.length} usuário(s) {canEdit ? 'cadastrado(s). Clique em Editar pra mudar role ou atribuir unidades.' : 'nas suas unidades (visão de gestor). Edição só com admin.'}
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>RE</th>
                <th>CPF</th>
                <th>Nome</th>
                <th>Guerra</th>
                <th>OPM</th>
                <th>Role</th>
                <th>Unidades Gestor</th>
                {canEdit && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(u => {
                const unidadesG = (u.unidadesGestor || []).map((id: string) => {
                  const unit = units.find(x => x._id === id)
                  return unit ? (unit.sigla || unit.code) : id.substring(0, 8)
                }).join(', ')
                return (
                  <tr key={u._id}>
                    <td>{u.re}</td>
                    <td>{u.cpf}</td>
                    <td>{u.name}</td>
                    <td>{u.warName}</td>
                    <td>{u.opmCode}</td>
                    <td><strong>{u.viaturasRole || 'viewer'}</strong></td>
                    <td style={{ fontSize: 12, color: '#666' }}>{unidadesG || <em style={{ color: '#999' }}>nenhuma</em>}</td>
                    {canEdit && (
                      <td>
                        <button className="btn btn-primary btn-sm" onClick={() => abrirEdição(u)}>
                          Editar
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE EDICAO COMPLETA */}
      {editando && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20,
        }} onClick={fecharEdição}>
          <div style={{
            background: 'white', borderRadius: 8, padding: 24,
            maxWidth: 720, width: '100%', maxHeight: '90vh', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Editar usuário</h2>

            <div className="alert" style={{ background: '#f0f7ff', border: '1px solid #1976d2', color: '#0d47a1', marginBottom: 12 }}>
              <strong>{editando.ptgr || ''} {editando.warName || editando.name}</strong>
              <br />CPF: <span style={{ fontFamily: 'monospace' }}>{editando.cpf}</span> | RE: {editando.re}{editando.digre ? `-${editando.digre}` : ''}
            </div>

            <div className="form-group">
              <label><strong>Role</strong></label>
              <select value={editRole} onChange={e => setEditRole(e.target.value)} style={{ fontSize: 14, padding: 8 }}>
                <option value="viewer">viewer (so agenda)</option>
                <option value="editor">editor (CRUD viatura)</option>
                <option value="gestor">gestor (aprova pedido)</option>
                <option value="admin">admin (gerência usuários)</option>
              </select>
            </div>

            {/* FIX (William 2026-08-18): Escopo dos filtros de unidade */}
            <div className="form-group" style={{ background: '#fff3e0', padding: 12, borderRadius: 4, border: '1px solid #ff9800' }}>
              <label><strong>🔒 Escopo dos filtros de unidade</strong></label>
              <select
                value={editEscopo}
                onChange={e => setEditEscopo(e.target.value as 'livre' | 'restrito')}
                style={{ fontSize: 14, padding: 8, width: '100%' }}
              >
                <option value="restrito">
                  🔒 Restrito (recomendado) - dropdowns travados conforme a unidade
                </option>
                <option value="livre">
                  🔓 Livre - dropdowns abertos (vê todo o escopo: use só pra CPI-7 ou admin master)
                </option>
              </select>
              <small style={{ color: '#666', display: 'block', marginTop: 4 }}>
                <strong>Restrito + 1 unidade matriz</strong> (ex: 40BPMI): unidade travado, escolhe a filha<br />
                <strong>Restrito + 1 unidade filha</strong> (ex: 1ª Cia): ambos travados<br />
                <strong>Livre</strong>: admin master ou editor do CPI-7 (vê tudo)
              </small>
            </div>

            <div className="form-group">
              <label><strong>Unidades onde é GESTOR</strong> (vai aprovar pedidos de viatura)</label>
              <div style={{ border: '1px solid #ddd', borderRadius: 4, padding: 8, maxHeight: 200, overflowY: 'auto' }}>
                {units.map(u => (
                  <label key={u._id} style={{ display: 'block', padding: 2, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editUnidadesGestor.includes(u._id)}
                      onChange={() => toggleUnidade('gestor', u._id)}
                      style={{ marginRight: 6 }}
                    />
                    <span style={{ fontFamily: 'monospace' }}>{u.code}</span> - {u.sigla || u.name}
                  </label>
                ))}
              </div>
              <small style={{ color: '#666' }}>{editUnidadesGestor.length} unidade(s) selecionada(s)</small>
            </div>

            <div className="form-group">
              <label><strong>Unidades onde é EDITOR</strong> (vai atribuir viatura a pedido aprovado)</label>
              <div style={{ border: '1px solid #ddd', borderRadius: 4, padding: 8, maxHeight: 200, overflowY: 'auto' }}>
                {units.map(u => (
                  <label key={u._id} style={{ display: 'block', padding: 2, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editUnidadesEditor.includes(u._id)}
                      onChange={() => toggleUnidade('editor', u._id)}
                      style={{ marginRight: 6 }}
                    />
                    <span style={{ fontFamily: 'monospace' }}>{u.code}</span> - {u.sigla || u.name}
                  </label>
                ))}
              </div>
              <small style={{ color: '#666' }}>{editUnidadesEditor.length} unidade(s) selecionada(s)</small>
            </div>

            {editErro && <div className="alert alert-error">{editErro}</div>}
            {editSalvo && <div className="alert alert-success">Salvo! Modal fechando...</div>}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn btn-secondary" onClick={fecharEdição}>Cancelar</button>
              <button className="btn btn-primary" onClick={salvarEdição} disabled={editSalvo}>
                {editSalvo ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
