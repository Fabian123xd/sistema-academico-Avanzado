import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap'
import {
  FiUser, FiLock, FiEye, FiEyeOff,
  FiBookOpen, FiBarChart2, FiClock, FiArrowRight,
  FiAlertCircle, FiShield, FiZap
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const RUTA_POR_ROL = {
  ADMINISTRADOR: '/admin',
  DOCENTE: '/docente',
  ESTUDIANTE: '/estudiante'
}

function getTimeGreeting() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return '🌅 Buenos días'
  if (h >= 12 && h < 19) return '☀️ Buenas tardes'
  return '🌙 Buenas noches'
}

const STATS = [
  { value: '500+', label: 'Estudiantes' },
  { value: '40+',  label: 'Cursos' },
  { value: '30+',  label: 'Docentes' },
]

const FEATURES = [
  {
    icon: FiBookOpen,
    title: 'Cursos y matrícula',
    desc: 'Gestión centralizada por roles'
  },
  {
    icon: FiBarChart2,
    title: 'Notas y evaluaciones',
    desc: 'Registro y consulta en tiempo real'
  },
  {
    icon: FiClock,
    title: 'Horarios y asistencia',
    desc: 'Todo organizado por curso'
  },
]

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [identificador, setIdentificador] = useState('')
  const [password,      setPassword]      = useState('')
  const [showPass,      setShowPass]      = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')
  const [touched,       setTouched]       = useState(false)

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

      {/* ── Left panel ─────────────────────────────────── */}
      <div className="login-panel">
        <div className="login-panel-glow" />

        {/* Institution logo */}
        <div className="login-inst-logo">
          <div className="login-inst-mark">AP</div>
          <div>
            <div className="login-inst-name">
              Academia<span>Pro</span>
            </div>
            <div className="login-inst-tag">Sistema Académico Avanzado</div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="login-headline">
          Tu vida académica,<br />
          <span className="highlight">en un solo lugar.</span>
        </h1>
        <p className="login-subhead">
          Administradores, docentes y estudiantes gestionan cursos, notas, asistencia y evaluaciones desde una sola plataforma.
        </p>

        {/* Stats */}
        <div className="login-stats">
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="login-divider" />}
              <div className="login-stat">
                <div className="login-stat-value">{s.value}</div>
                <div className="login-stat-label">{s.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Feature list */}
        <div className="login-feature-list">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div className="login-feature" key={title}>
              <div className="login-feature-icon"><Icon /></div>
              <div>
                <div className="login-feature-title">{title}</div>
                <div className="login-feature-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right — form ───────────────────────────────── */}
      <div className="login-form-side">
        <div className="login-form-wrap">

          {/* Glass card */}
          <div className="login-card">

            {/* Header */}
            <div className="login-form-header">
              <div className="login-time-greet">{getTimeGreeting()}</div>
              <div className="login-eyebrow">
                <FiShield size={11} /> Acceso seguro
              </div>
              <h2 className="login-title">Acceso al sistema</h2>
              <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
            </div>

            {/* Form */}
            <form noValidate onSubmit={handleSubmit}>

              {/* Identifier */}
              <div className="mb-3">
                <label className="login-label" htmlFor="login-id">
                  Correo o código de acceso
                </label>
                <div className={`login-input-wrap ${touched && !identificador.trim() ? 'is-invalid' : ''}`}>
                  <span className="login-input-icon"><FiUser /></span>
                  <input
                    id="login-id"
                    type="text"
                    className="login-input form-control"
                    placeholder="correo@academiapro.edu o A0001234"
                    value={identificador}
                    onChange={(e) => setIdentificador(e.target.value)}
                    autoComplete="username"
                  />
                </div>
                {touched && !identificador.trim() && (
                  <div className="login-error-text">
                    <FiAlertCircle size={12} /> Ingresa tu correo o código
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="mb-1">
                <label className="login-label" htmlFor="login-pass">
                  Contraseña
                </label>
                <div className={`login-input-wrap ${touched && !password.trim() ? 'is-invalid' : ''}`}>
                  <span className="login-input-icon"><FiLock /></span>
                  <input
                    id="login-pass"
                    type={showPass ? 'text' : 'password'}
                    className="login-input form-control"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <span
                    className="login-input-toggle"
                    onClick={() => setShowPass((s) => !s)}
                    role="button"
                    aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
                {touched && !password.trim() && (
                  <div className="login-error-text">
                    <FiAlertCircle size={12} /> Ingresa tu contraseña
                  </div>
                )}
              </div>

              {/* Forgot password */}
              <a href="#" className="login-forgot" tabIndex={-1}>
                ¿Olvidaste tu contraseña?
              </a>

              {/* Error alert */}
              {error && (
                <div className="login-alert" role="alert">
                  <FiAlertCircle size={15} /> {error}
                </div>
              )}

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                className="login-submit btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    Verificando…
                  </>
                ) : (
                  <>
                    <FiZap size={16} />
                    Ingresar
                    <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Demo hint */}
            <div className="login-demo-hint">
              <strong>💡 Acceso de demo:</strong> Usa tus credenciales institucionales para ingresar al portal.
              Contacta a soporte si no tienes acceso.
            </div>

          </div>

          <div className="login-footer-note">
            © {new Date().getFullYear()} AcademiaPro · <a href="#" className="login-link">Términos</a> · <a href="#" className="login-link">Privacidad</a>
          </div>
        </div>
      </div>
    </div>
  )
}
