import React from 'react'
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap'

export default function Header(){
  return (
    <header>
      <div className="top-bar" />
      <Navbar expand="lg" className="mb-3 header-bar">
        <Container fluid>
          <div className="d-flex align-items-center" style={{gap:12}}>
            <div className="logo-box">UTP</div>
            <div className="brand-title">UTP+portal</div>
          </div>
          <Nav className="ms-auto align-items-center">
            <div className="me-3 small-muted">Hola, Fabian • </div>
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="user-menu">
                Perfil
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Perfil</Dropdown.Item>
                <Dropdown.Item>Cerrar sesión</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
    </header>
  )
}
