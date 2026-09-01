import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import {
  FiPhone, FiMail, FiUser, FiLock, FiEye, FiEyeOff,
  FiX, FiArrowRight, FiAlertCircle, FiZap,
  FiMoon, FiSun, FiChevronRight, FiStar,
  FiGlobe, FiHeart, FiAward, FiCpu,
  FiMapPin, FiFacebook, FiInstagram, FiYoutube
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import heroImg      from '../assets/hero.jpg'
import inicialImg   from '../assets/nivel-inicial.jpg'
import primariaImg  from '../assets/nivel-primaria.jpg'
import secundariaImg from '../assets/nivel-secundaria.jpg'

/* ── Rutas por rol ─────────────────────────────────────────── */
const RUTA_ROL = { ADMINISTRADOR: '/admin', DOCENTE: '/docente', ESTUDIANTE: '/estudiante' }

/* ====================================================================
   MODAL DE LOGIN — solo accesible desde el ícono de persona
   ==================================================================== */
function LoginModal({ onClose, onSuccess }) {
  const { login } = useAuth()
  const [id,       setId]       = useState('')
  const [pass,     setPass]     = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [tocado,   setTocado]   = useState(false)

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTocado(true); setError('')
    if (!id.trim() || !pass.trim()) return
    setLoading(true)
    try {
      const u = await login(id.trim(), pass)
      onSuccess(RUTA_ROL[u.rol] || '/')
    } catch (err) {
      setError(err?.response?.data?.mensaje || 'Credenciales incorrectas. Inténtalo de nuevo.')
    } finally { setLoading(false) }
  }

  return (
    <div className="pc-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pc-modal" role="dialog" aria-modal="true">
        <button id="modal-close-btn" className="pc-modal-close" onClick={onClose} title="Cerrar"><FiX size={14}/></button>

        {/* Logo */}
        <div className="pc-modal-brand">
          <div className="pc-logo-icon">🎓</div>
          <div>
            <div className="pc-modal-brand-name">Pen<span>College</span></div>
            <div className="pc-modal-brand-sub">Acceso al Aula Virtual</div>
          </div>
        </div>

        <h2 className="pc-modal-title">Iniciar sesión</h2>
        <p className="pc-modal-subtitle">Ingresa tus datos para acceder al sistema académico</p>

        <form noValidate onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="pc-modal-label" htmlFor="m-id">Correo o código institucional</label>
            <div className={`pc-modal-input-wrap ${tocado && !id.trim() ? 'invalid' : ''}`}>
              <span className="pc-modal-icon"><FiUser size={15}/></span>
              <input id="m-id" type="text" className="pc-modal-input form-control"
                placeholder="correo@pencollege.edu o código"
                value={id} onChange={e => setId(e.target.value)}
                autoComplete="username" autoFocus />
            </div>
            {tocado && !id.trim() && <div className="pc-modal-err"><FiAlertCircle size={11}/> Campo obligatorio</div>}
          </div>

          <div className="mb-1">
            <label className="pc-modal-label" htmlFor="m-pass">Contraseña</label>
            <div className={`pc-modal-input-wrap ${tocado && !pass.trim() ? 'invalid' : ''}`}>
              <span className="pc-modal-icon"><FiLock size={15}/></span>
              <input id="m-pass" type={showPass ? 'text' : 'password'} className="pc-modal-input form-control"
                placeholder="Tu contraseña"
                value={pass} onChange={e => setPass(e.target.value)}
                autoComplete="current-password" />
              <span className="pc-modal-toggle" onClick={() => setShowPass(s => !s)} role="button">
                {showPass ? <FiEyeOff size={14}/> : <FiEye size={14}/>}
              </span>
            </div>
            {tocado && !pass.trim() && <div className="pc-modal-err"><FiAlertCircle size={11}/> Campo obligatorio</div>}
          </div>

          <a href="#" className="pc-modal-forgot">¿Olvidaste tu contraseña?</a>

          {error && <div className="pc-modal-alert" role="alert"><FiAlertCircle size={14}/> {error}</div>}

          <button id="modal-submit-btn" type="submit" className="pc-modal-btn" disabled={loading}>
            {loading
              ? <><Spinner animation="border" size="sm"/> Verificando…</>
              : <><FiZap size={15}/> Ingresar <FiArrowRight size={14}/></>}
          </button>
        </form>

        <p className="pc-modal-note">
          ¿Problemas para acceder? Contacta a <a href="mailto:soporte@pencollege.edu">soporte@pencollege.edu</a>
        </p>
      </div>
    </div>
  )
}

/* ====================================================================
   PÁGINA PRINCIPAL DE PENCOLLEGE
   ==================================================================== */
export default function LandingPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogin,  setShowLogin]  = useState(false)
  const [darkMode,   setDarkMode]   = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [heroSlide,  setHeroSlide]  = useState(0)
  const avatarRef = useRef(null)

  // Toggle dark mode en <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  // Cerrar dropdown avatar al clicar afuera
  useEffect(() => {
    const fn = (e) => { if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  // Auto-slide del hero cada 4 segundos
  const HERO_SLIDES = [
    { titulo: 'Metodología centrada\nen el estudiante', subtitulo: 'Todas las actividades están pensadas para contribuir al desarrollo intelectual y socioemocional de nuestros alumnos.', img: heroImg },
    { titulo: 'Excelencia académica\ndesde el primer día', subtitulo: 'Formamos líderes del mañana con una educación de calidad, valores y tecnología de vanguardia.', img: heroImg },
    { titulo: 'Un espacio seguro\npara crecer y aprender', subtitulo: 'Nuestros docentes altamente capacitados guían a cada estudiante en su camino hacia el éxito.', img: heroImg },
  ]
  useEffect(() => {
    const t = setInterval(() => setHeroSlide(s => (s + 1) % HERO_SLIDES.length), 4500)
    return () => clearInterval(t)
  }, [])

  const handleLoginSuccess = (ruta) => { setShowLogin(false); navigate(ruta, { replace: true }) }
  const iniciales = (n) => { if (!n) return '?'; const p = n.trim().split(' '); return p.length >= 2 ? (p[0][0]+p[1][0]).toUpperCase() : n.slice(0,2).toUpperCase() }

  return (
    <div className="pc-wrap">

      {/* ── BARRA SUPERIOR ───────────────────────────── */}
      <div className="pc-topbar">
        <div className="pc-topbar-left">
          <span className="pc-topbar-item"><FiPhone size={12}/> 987 654 321</span>
          <span className="pc-topbar-item"><FiMail size={12}/> informes@pencollege.edu</span>
        </div>
        <a href="#aula" className="pc-topbar-aula">AULA VIRTUAL</a>
      </div>

      {/* ── NAVBAR ───────────────────────────────────── */}
      <nav className="pc-navbar" id="inicio">
        {/* Logo */}
        <a href="#inicio" className="pc-navbar-brand">
          <div className="pc-logo-icon-sm">🎓</div>
          <div>
            <div className="pc-brand-name">Pen<span>College</span></div>
            <div className="pc-brand-sub">Institución Educativa</div>
          </div>
        </a>

        {/* Links de navegación */}
        <div className="pc-nav-links">
          <a href="#inicio"    className="pc-nav-link active">🏠 INICIO</a>
          <a href="#nosotros"  className="pc-nav-link">🏛 NOSOTROS</a>
          <a href="#niveles"   className="pc-nav-link">📚 GALERÍA</a>
          <a href="#admision"  className="pc-nav-link">📋 ADMISIÓN</a>
          <a href="#contacto"  className="pc-nav-link">📞 CONTACTO</a>
        </div>

        {/* Ícono de login / avatar */}
        <div className="pc-nav-actions">
          {user ? (
            <div className="pc-avatar-wrap" ref={avatarRef}>
              <button id="lp-avatar-btn" className="pc-avatar-btn" onClick={() => setAvatarOpen(o => !o)} title="Mi cuenta">
                {iniciales(user.nombre)}
              </button>
              {avatarOpen && (
                <div className="pc-avatar-menu">
                  <div className="pc-avatar-menu-header">
                    <strong>{user.nombre}</strong>
                    <span>{user.email || user.codigo}</span>
                  </div>
                  <button className="pc-avatar-menu-item" onClick={() => navigate(RUTA_ROL[user.rol] || '/')}>
                    <FiArrowRight size={13}/> Ir a mi panel
                  </button>
                  <hr className="pc-avatar-divider"/>
                  <button className="pc-avatar-menu-item danger" onClick={() => { setAvatarOpen(false); logout() }}>
                    <FiX size={13}/> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="pc-login-icon-wrap">
              <button id="lp-login-icon-btn" className="pc-login-icon-btn" onClick={() => setShowLogin(true)}
                title="Iniciar sesión" aria-label="Acceso al aula virtual">
                <FiUser size={19}/>
              </button>
              <span className="pc-login-icon-lbl">Iniciar sesión</span>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO / SLIDER ────────────────────────────── */}
      <section className="pc-hero">
        <div className="pc-hero-overlay"/>
        <img src={heroImg} alt="Estudiantes PenCollege" className="pc-hero-bg"/>
        <div className="pc-hero-content">
          <div className="pc-hero-text">
            <h1 className="pc-hero-title" key={heroSlide}>
              {HERO_SLIDES[heroSlide].titulo.split('\n').map((l,i) => <span key={i}>{l}<br/></span>)}
            </h1>
            <p className="pc-hero-subtitle">{HERO_SLIDES[heroSlide].subtitulo}</p>
            <div className="pc-hero-btns">
              <button className="pc-btn-primary" onClick={() => document.getElementById('admision').scrollIntoView({behavior:'smooth'})}>
                Más información <FiChevronRight/>
              </button>
              <button className="pc-btn-outline" onClick={() => setShowLogin(true)}>
                Aula Virtual
              </button>
            </div>
          </div>
        </div>
        {/* Dots del slider */}
        <div className="pc-hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} className={`pc-hero-dot ${i === heroSlide ? 'active' : ''}`} onClick={() => setHeroSlide(i)}/>
          ))}
        </div>
      </section>

      {/* ── NIVELES EDUCATIVOS ───────────────────────── */}
      <section className="pc-section pc-bg-white" id="niveles">
        <div className="pc-section-inner">
          <h2 className="pc-section-title">Disponemos de 3 niveles educativos</h2>
          <p className="pc-section-desc">
            Una educación de calidad para la formación de la persona en todos los campos del conocimiento, basada en una preparación humanista, científica y artística.
          </p>
          <div className="pc-niveles-grid">
            {[
              { img: inicialImg,    label: 'INICIAL',    color: '#f59e0b', shadow: 'rgba(245,158,11,0.4)'  },
              { img: primariaImg,   label: 'PRIMARIA',   color: '#22c55e', shadow: 'rgba(34,197,94,0.4)'   },
              { img: secundariaImg, label: 'SECUNDARIA', color: '#3b82f6', shadow: 'rgba(59,130,246,0.4)'  },
            ].map(({img, label, color, shadow}) => (
              <div key={label} className="pc-nivel-card" style={{'--nivel-color': color, '--nivel-shadow': shadow}}>
                <div className="pc-nivel-img-wrap">
                  <img src={img} alt={label}/>
                </div>
                <div className="pc-nivel-label" style={{background: color}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALORES / PILARES ────────────────────────── */}
      <section className="pc-section pc-bg-gray" id="nosotros">
        <div className="pc-section-inner">
          <h2 className="pc-section-title">Educación con criterio científico y humanista</h2>
          <p className="pc-section-desc">
            Una educación de calidad para la formación de la persona en todos los campos del conocimiento, basada en una preparación humanista, científica y artística.
          </p>
          <div className="pc-pilares-grid">
            {[
              { emoji: '🌍', titulo: 'Colegio Pluricultural',    desc: 'Somos una institución multicultural con un programa de formación reconocido a nivel nacional.' },
              { emoji: '🙌', titulo: 'Formación con valores',    desc: 'Educación enfocada en el respeto de los valores y el desarrollo integral del ser humano.'       },
              { emoji: '🎨', titulo: 'Crecimiento Integral',     desc: 'Arte, deporte y responsabilidad social como herramientas para la educación del alumno.'         },
              { emoji: '🔬', titulo: 'Ciencia y Tecnología',     desc: 'Laboratorios de alta tecnología para la adquisición de habilidades científicas e informáticas.' },
            ].map(({emoji, titulo, desc}) => (
              <div key={titulo} className="pc-pilar-card">
                <div className="pc-pilar-emoji">{emoji}</div>
                <div className="pc-pilar-title">{titulo}</div>
                <div className="pc-pilar-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPUESTA EDUCATIVA ──────────────────────── */}
      <section className="pc-section pc-propuesta" id="admision">
        <div className="pc-section-inner pc-propuesta-inner">
          <div className="pc-propuesta-img-col">
            <img src={inicialImg} alt="Propuesta educativa PenCollege" className="pc-propuesta-img"/>
          </div>
          <div className="pc-propuesta-text-col">
            <div className="pc-section-badge-sm">¿Por qué elegirnos?</div>
            <h2 className="pc-section-title" style={{textAlign:'left', marginBottom:'16px'}}>
              Nuestra Propuesta Educativa
            </h2>
            {[
              'Enfoque educativo humanista – científico.',
              'Metodología diseñada para el proceso de enseñanza a distancia y presencial.',
              'Docentes certificados y con amplia experiencia.',
              'Infraestructura moderna y aulas equipadas.',
              'Programas extracurriculares de arte, deporte y tecnología.',
              'Seguimiento personalizado del desarrollo del alumno.',
            ].map(item => (
              <div key={item} className="pc-propuesta-item">
                <span className="pc-check">✔</span> {item}
              </div>
            ))}
            <button className="pc-btn-primary" style={{marginTop:'24px'}} onClick={() => setShowLogin(true)}>
              Solicitar información <FiChevronRight/>
            </button>
          </div>
        </div>
      </section>

      {/* ── BANNER CTA ───────────────────────────────── */}
      <section className="pc-cta-banner">
        <div className="pc-cta-inner">
          <div>
            <h3 className="pc-cta-title">¿DESEA RECIBIR MÁS INFORMACIÓN?</h3>
            <p className="pc-cta-sub">Solicita una cita por videoconferencia o reserva una cita presencial</p>
          </div>
          <button className="pc-cta-btn" onClick={() => document.getElementById('contacto').scrollIntoView({behavior:'smooth'})}>
            RESERVAR CITA
          </button>
        </div>
      </section>

      {/* ── TESTIMONIOS ──────────────────────────────── */}
      <section className="pc-section pc-bg-white">
        <div className="pc-section-inner">
          <h2 className="pc-section-title">Testimonios</h2>
          <p className="pc-section-desc">Nuestros alumnos y padres de familia nos respaldan</p>
          <div className="pc-testi-grid">
            {[
              { nombre: 'María García',    cargo: 'Madre de familia',      texto: 'PenCollege superó todas mis expectativas. Mi hijo ha mejorado notablemente en todas las áreas académicas y también en valores. ¡Lo recomiendo ampliamente!' },
              { nombre: 'Carlos Mendoza',  cargo: 'Estudiante · 5to Sec.', texto: 'Gracias a PenCollege logré ingresar a la universidad de mis sueños. Los docentes son excelentes y siempre están disponibles para apoyarte.' },
              { nombre: 'Ana Quispe',      cargo: 'Madre de familia',      texto: 'Un colegio que combina excelencia académica con formación en valores. Mis hijas están felices y aprenden cada día con entusiasmo.' },
            ].map(({nombre, cargo, texto}) => (
              <div key={nombre} className="pc-testi-card">
                <div className="pc-testi-stars">{'★'.repeat(5)}</div>
                <p className="pc-testi-text">"{texto}"</p>
                <div className="pc-testi-author">
                  <div className="pc-testi-avatar">{nombre[0]}</div>
                  <div>
                    <div className="pc-testi-name">{nombre}</div>
                    <div className="pc-testi-cargo">{cargo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="pc-footer" id="contacto">
        <div className="pc-footer-inner">
          <div className="pc-footer-col">
            <div className="pc-footer-brand">
              <span className="pc-footer-logo">🎓</span>
              <span className="pc-footer-brand-name">Pen<span>College</span></span>
            </div>
            <p className="pc-footer-about">
              Somos una Institución Educativa comprometida con la educación integral desde un enfoque científico-humanista, favoreciendo el desarrollo pleno de nuestros estudiantes.
            </p>
            <div className="pc-footer-social">
              <a href="#" title="Facebook"><FiFacebook/></a>
              <a href="#" title="Instagram"><FiInstagram/></a>
              <a href="#" title="YouTube"><FiYoutube/></a>
            </div>
          </div>

          <div className="pc-footer-col">
            <div className="pc-footer-col-title">Nosotros</div>
            {['Misión y Visión','Historia del colegio','Plana docente','Infraestructura','Logros y reconocimientos'].map(l => (
              <a key={l} href="#" className="pc-footer-link">{l}</a>
            ))}
          </div>

          <div className="pc-footer-col">
            <div className="pc-footer-col-title">Informes y consultas</div>
            <div className="pc-footer-contact"><FiPhone size={13}/> (01) 123 4567 / 987 654 321</div>
            <div className="pc-footer-contact"><FiMail size={13}/> informes@pencollege.edu</div>
            <div className="pc-footer-contact"><FiMapPin size={13}/> Av. Independencia N° 123, Lima, Perú</div>
            <div className="pc-footer-hours" style={{marginTop:12, fontSize:'0.8rem', color:'#9ca3af'}}>
              Lun – Vie: 8:00 am – 6:00 pm<br/>
              Sáb: 8:00 am – 1:00 pm
            </div>
          </div>

          <div className="pc-footer-col">
            <div className="pc-footer-col-title">Acceso rápido</div>
            {['Inicio','Galería','Admisión','Pagos'].map(l => (
              <a key={l} href="#" className="pc-footer-link">{l}</a>
            ))}
            <button
              className="pc-footer-aula-btn"
              onClick={() => setShowLogin(true)}
            >
              🖥️ Ingresar al Aula Virtual
            </button>
          </div>
        </div>
        <div className="pc-footer-bottom">
          © {new Date().getFullYear()} PenCollege — Institución Educativa. Todos los derechos reservados.
        </div>
      </footer>

      {/* ── Modal de Login ───────────────────────────── */}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess}/>
      )}

      {/* ── Botón Modo Oscuro/Claro ──────────────────── */}
      <button id="theme-toggle-btn" className="theme-toggle-btn"
        onClick={() => setDarkMode(d => !d)}
        title={darkMode ? 'Modo claro' : 'Modo oscuro'}>
        {darkMode ? <FiSun size={18}/> : <FiMoon size={18}/>}
      </button>
    </div>
  )
}
