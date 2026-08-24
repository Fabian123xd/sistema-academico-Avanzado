import React from 'react'
import { Container, Row, Col, Nav } from 'react-bootstrap'
import { NavLink, Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function Item({ icon: Icon, label, to }) {
  return (
    <NavLink to={to} end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
      <div className="nav-icon"><Icon /></div>
      <div className="nav-label">{label}</div>
    </NavLink>
  )
}

/** Layout compartido: header + sidebar de navegacion (items segun el rol) + contenido de la ruta activa. */
export default function AppLayout({ title, menuItems }) {
  return (
    <Container fluid className="p-4">
      <Header />
      <div className="container-main">
        <h1 className="mb-4">{title}</h1>
        <Row>
          <Col md={3} className="pe-3">
            <div className="sidebar p-3" style={{ height: '100%' }}>
              <h5 className="mb-3">Menú</h5>
              <Nav className="flex-column">
                {menuItems.map((item) => (
                  <Item key={item.to} {...item} />
                ))}
              </Nav>
            </div>
          </Col>
          <Col md={9}>
            <Outlet />
          </Col>
        </Row>
      </div>
      <Footer />
    </Container>
  )
}
