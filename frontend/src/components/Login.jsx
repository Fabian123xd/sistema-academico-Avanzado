import React, { useState } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap'
import { FiUser, FiLock, FiEye, FiEyeOff, FiBookOpen, FiBarChart2, FiClock, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const RUTA_POR_ROL = {
  ADMINISTRADOR: '/admin',
  DOCENTE: '/docente',
  ESTUDIANTE: '/estudiante'
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [identificador, setIdentificador] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    setError('')
    if (!identificador.trim() || !password.trim()) return

    setLoading(true)
    try {
      const sessionUser = await login(identificador.trim(), password)
      navigate(RUTA_POR_ROL[sessionUser.rol] || '/', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.mensaje || 'Correo/código o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-panel">
        <div className="login-brand">
          <div className="top-bar" />
          <div className="d-flex align-items-center mb-4" style={{ gap: 12 }}>
            <div className="logo-box">UTP</div>
            <div className="brand-title" style={{ color: '#fff', fontSize: '1.3rem' }}>+portal</div>
          </div>

          <h1 className="login-headline">Tu vida académica,<br />en un solo lugar.</h1>
          <p className="login-subhead">
            Administradores, docentes y estudiantes gestionan cursos, notas, asistencia y evaluaciones desde un mismo sistema.
          </p>

          <div className="login-feature-list">
            <div className="login-feature">
              <div className="login-feature-icon"><FiBookOpen /></div>
              <div>
                <div className="login-feature-title">Cursos y matrícula</div>
                <div className="login-feature-desc">Gestión centralizada por roles</div>
              </div>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon"><FiBarChart2 /></div>
              <div>
                <div className="login-feature-title">Notas y evaluaciones</div>
                <div className="login-feature-desc">Registro y consulta en tiempo real</div>
              </div>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon"><FiClock /></div>
              <div>
                <div className="login-feature-title">Horarios y asistencia</div>
                <div className="login-feature-desc">Todo organizado por curso</div>
              </div>
            </div>
          </div>
        </div>
        <div className="login-panel-glow" />
      </div>

      <div className="login-form-side">
        <div className="login-form-wrap">
          <div className="login-form-header">
            <span className="login-eyebrow">Bienvenido de nuevo</span>
            <h2 className="login-title">Acceso al sistema</h2>
            <p className="small-muted">Ingresa tus credenciales para continuar</p>
          </div>

          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="login-label">Correo o código de acceso</Form.Label>
              <div className={`login-input-wrap ${touched && !identificador.trim() ? 'is-invalid' : ''}`}>
                <span className="login-input-icon"><FiUser /></span>
                <Form.Control
                  type="text"
                  placeholder="admin@sistema-academico.edu o A2342384"
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                  autoComplete="username"
                  className="login-input"
                />
              </div>
              {touched && !identificador.trim() && <div className="login-error-text">Ingresa tu correo o código</div>}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="login-label">Contraseña</Form.Label>
              <div className={`login-input-wrap ${touched && !password.trim() ? 'is-invalid' : ''}`}>
                <span className="login-input-icon"><FiLock /></span>
                <Form.Control
                  type={showPass ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="login-input"
                />
                <span className="login-input-toggle" onClick={() => setShowPass((s) => !s)} role="button">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              {touched && !password.trim() && <div className="login-error-text">Ingresa tu contraseña</div>}
            </Form.Group>

            {error && <div className="login-alert">{error}</div>}

            <Button type="submit" className="login-submit" disabled={loading}>
              {loading ? (
                <><Spinner animation="border" size="sm" className="me-2" /> Verificando…</>
              ) : (
                <>Ingresar <FiArrowRight className="ms-1" /></>
              )}
            </Button>

            
          </Form>

          
        </div>
      </div>
    </div>
  )
}
