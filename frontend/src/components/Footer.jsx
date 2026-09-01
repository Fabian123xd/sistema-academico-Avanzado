import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiMail, FiMapPin, FiPhone,
  FiBookOpen, FiUsers, FiCalendar, FiBarChart2,
  FiGithub, FiHeart
} from 'react-icons/fi'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="ap-footer">
      <div className="ap-footer-inner">

        {/* Col 1 — Brand */}
        <div>
          <div className="ap-footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div className="ap-logo-mark" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>AP</div>
              <span className="ap-logo-text" style={{ fontSize: '1.15rem' }}>
                Academia<span>Pro</span>
              </span>
            </div>
          </div>
          <p className="ap-footer-desc">
            Plataforma académica avanzada para gestionar alumnos, cursos, matrículas, horarios y evaluaciones en un solo lugar.
          </p>
          <div className="ap-footer-badges">
            <span className="ap-footer-badge">Spring Boot</span>
            <span className="ap-footer-badge">React + Vite</span>
            <span className="ap-footer-badge">MySQL</span>
          </div>
        </div>

        {/* Col 2 — Quick links */}
        <div>
          <div className="ap-footer-col-title">Accesos rápidos</div>
          <ul className="ap-footer-links">
            <li>
              <a href="/admin">
                <FiUsers size={13} /> Panel de Administración
              </a>
            </li>
            <li>
              <a href="/docente">
                <FiBookOpen size={13} /> Portal Docente
              </a>
            </li>
            <li>
              <a href="/estudiante">
                <FiCalendar size={13} /> Portal Estudiantil
              </a>
            </li>
            <li>
              <a href="/estudiante/notas">
                <FiBarChart2 size={13} /> Consulta de Notas
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3 — Contact */}
        <div>
          <div className="ap-footer-col-title">Información</div>

          <div className="ap-footer-contact-item">
            <div className="ap-footer-contact-icon"><FiMail size={13} /></div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 1 }}>Soporte técnico</div>
              soporte@academiapro.edu
            </div>
          </div>

          <div className="ap-footer-contact-item">
            <div className="ap-footer-contact-icon"><FiMapPin size={13} /></div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 1 }}>Institución</div>
              Sistema Académico Avanzado
            </div>
          </div>

          <div className="ap-footer-contact-item">
            <div className="ap-footer-contact-icon"><FiPhone size={13} /></div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 1 }}>Horario de atención</div>
              Lun – Vie · 8:00 am – 6:00 pm
            </div>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="ap-footer-bottom" style={{ marginTop: '3rem' }}>
        <div className="ap-footer-copy">
          © {YEAR} AcademiaPro — Sistema Académico Avanzado. Todos los derechos reservados.
        </div>
        <div className="ap-footer-tech">
          Hecho con <FiHeart size={11} style={{ color: 'var(--danger)', margin: '0 3px' }} /> usando{' '}
          <span>Spring Boot</span> &amp; <span>React</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <FiGithub size={14} /> GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
