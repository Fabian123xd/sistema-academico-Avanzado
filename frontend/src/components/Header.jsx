import React from 'react'
import { Navbar, Container, Nav, Dropdown, Badge } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const ETIQUETA_ROL = {
  ADMINISTRADOR: 'Administrador',
  DOCENTE: 'Docente',
  ESTUDIANTE: 'Estudiante'
}

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header>
      <div className="top-bar" />
      <Navbar expand="lg" className="mb-3 header-bar">
        <Container fluid>
          <div className="d-flex align-items-center" style={{ gap: 12 }}>
            <div className="logo-box">UTP</div>
            <div className="brand-title">UTP+portal</div>
            {user && <Badge bg="light" text="dark">{ETIQUETA_ROL[user.rol] || user.rol}</Badge>}
          </div>
          <Nav className="ms-auto align-items-center">
            <div className="me-3 small-muted">Hola, {user?.nombre || 'Invitado'}</div>
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="user-menu">
                Perfil
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.ItemText className="small-muted">{user?.email}</Dropdown.ItemText>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
    </header>
  )
}
