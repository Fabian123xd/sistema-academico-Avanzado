import React from 'react'
import { Row, Col, Nav } from 'react-bootstrap'
import { FiHome, FiUsers, FiBookOpen, FiBarChart2, FiClock } from 'react-icons/fi'

function Item({ icon: Icon, label, active, onClick }){
  return (
    <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick} role="button">
      <div className="nav-icon"><Icon/></div>
      <div className="nav-label">{label}</div>
    </div>
  )
}

export default function Layout({ view, onChange, children }) {
  return (
    <Row>
      <Col md={3} className="pe-3">
        <div className="sidebar p-3" style={{height:'100%'}}>
          <h5 className="mb-3">Menú</h5>
          <Nav className="flex-column">
            <Item icon={FiHome} label="Dashboard" active={view==='dashboard'} onClick={()=>onChange('dashboard')} />
            <Item icon={FiUsers} label="Alumnos" active={view==='alumnos'} onClick={()=>onChange('alumnos')} />
            <Item icon={FiBookOpen} label="Cursos" active={view==='cursos'} onClick={()=>onChange('cursos')} />
            <Item icon={FiBarChart2} label="Mis notas" active={view==='notas'} onClick={()=>onChange('notas')} />
            <Item icon={FiClock} label="Horarios" active={view==='horarios'} onClick={()=>onChange('horarios')} />
          </Nav>
        </div>
      </Col>
      <Col md={9}>
        {children}
      </Col>
    </Row>
  )
}
