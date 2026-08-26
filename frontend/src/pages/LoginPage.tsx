import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../lib/auth'

export default function LoginPage() {
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const nav = useNavigate()

  function formatCpf(v: string) {
    const clean = v.replace(/\D/g, '').slice(0, 11)
    return clean
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const cpfClean = cpf.replace(/\D/g, '')
      await login(cpfClean, senha)
      nav('/', { replace: true })
    } catch (err: any) {
      setErro(err.message || 'Erro de login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Viaturas CPI-7</h1>
        <p className="subtitle">Sistema de Agendamento de Viaturas</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={e => setCpf(formatCpf(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Senha do Holerite</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="Sua senha do Portal PM"
              required
            />
          </div>

          {erro && <div className="alert alert-error">{erro}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ fontSize: 11, color: '#888', marginTop: 16, textAlign: 'center' }}>
          Login integrado com CPD PM (mesma senha do Portal de Holerite)
        </p>
      </div>
    </div>
  )
}
