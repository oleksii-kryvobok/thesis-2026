import { useState } from "react";
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
import './Login.css'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState('')
    const [loading, setLoading]   = useState(false)
  
    async function handleSubmit() {
      if (!email || !password) { setError('Заповніть всі поля'); return }
      setLoading(true)
      setError('')
      try {
        await login(email, password)
        navigate('/')
      } catch (e) {
        setError(e.message || 'Невірний email або пароль')
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">АналітикаУС</div>
          <div className="login-sub">Система аналітики успішності студентів</div>
  
          <div className="login-form">
            <div className="form-row">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="admin@university.ua"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Пароль</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            {error && <div className="login-error">{error}</div>}
            <button
              className="btn-primary login-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Вхід...' : 'Увійти'}
            </button>
          </div>
        </div>
      </div>
    )
}