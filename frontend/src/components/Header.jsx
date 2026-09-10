import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiLogOut, FiSettings, FiArrowLeft } from 'react-icons/fi'

/* ── Etiquetas de rol ────────────────────────────────────── */
const ETIQUETA_ROL = {
  ADMINISTRADOR: 'Administrador',
  DOCENTE: 'Docente',
  ESTUDIANTE: 'Estudiante'
}
const CLASE_ROL = {
  ADMINISTRADOR: 'admin',
  DOCENTE: 'docente',
  ESTUDIANTE: ''
}

function iniciales(nombre) {
  if (!nombre) return '?'
  const p = nombre.trim().split(' ')
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nombre.slice(0, 2).toUpperCase()
}

function saludoHora() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return '🌅 Buenos días'
  if (h >= 12 && h < 19) return '☀️ Buenas tardes'
  return '🌙 Buenas noches'
}

/** Header del dashboard (cuando el usuario ya está autenticado). */
export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const dropRef = useRef(null)

  // Cerrar dropdown al clicar fuera
  useEffect(() => {
    const fn = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="ap-header">
      {/* Logo */}
      <a href="/" className="ap-header-brand" style={{ textDecoration: 'none' }}>
        <div className="ap-logo-mark">AP</div>
        <div>
          <div className="ap-logo-text">Academia<span>Pro</span></div>
          <div className="ap-logo-sub">Sistema Académico</div>
        </div>
      </a>

      {/* Badge de rol */}
      {user && (
        <div className="ap-header-center">
          <span className={`ap-role-badge ${CLASE_ROL[user.rol] || ''}`}>
            {ETIQUETA_ROL[user.rol] || user.rol}
          </span>
        </div>
      )}

      {/* Saludo + avatar */}
      <div className="ap-header-right">
        {user && (
          <div className="ap-greeting">
            {saludoHora()}, <strong>{user.nombre?.split(' ')[0] || 'Usuario'}</strong>
          </div>
        )}

        <div className="ap-dropdown" ref={dropRef}>
          <button
            id="header-avatar-btn"
            className="ap-avatar-btn"
            onClick={() => setOpen(o => !o)}
            aria-haspopup="true"
            aria-expanded={open}
            title="Menú de usuario"
          >
            {iniciales(user?.nombre)}
          </button>

          {open && (
            <div className="ap-dropdown-menu" role="menu">
              <div className="ap-dropdown-header">
                <div className="ap-dropdown-name">{user?.nombre || 'Invitado'}</div>
                <div className="ap-dropdown-email">{user?.email || user?.codigo || '—'}</div>
              </div>

              <button className="ap-dropdown-item" onClick={() => setOpen(false)}>
                <FiUser size={14} /> Mi perfil
              </button>
              <button className="ap-dropdown-item" onClick={() => setOpen(false)}>
                <FiSettings size={14} /> Configuración
              </button>
              <button className="ap-dropdown-item" onClick={() => { setOpen(false); navigate('/') }}>
                <FiArrowLeft size={14} /> Página principal
              </button>

              <div className="ap-dropdown-divider" />

              <button
                id="header-logout-btn"
                className="ap-dropdown-item danger"
                onClick={handleLogout}
              >
                <FiLogOut size={14} /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
