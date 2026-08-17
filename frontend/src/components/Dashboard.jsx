import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import Alumnos from './Alumnos'
import Hero from './Hero'

export default function Dashboard({onNavigate}){
  return (
    <>
      <Row className="mb-3">
        <Col>
          <Hero onNavigate={onNavigate} />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={8}>
          <Card className="card-custom mb-3">
            <div className="card-header-portal">
              <h4 style={{margin:0}}>Bienvenido al Sistema Académico</h4>
            </div>
            <div className="card-body-portal">
              <p className="small-muted">Resumen rápido: accede a tus cursos, notas y horarios.</p>
              <div style={{display:'flex',gap:'0.5rem'}}>
                <Button variant="outline-light" onClick={()=>onNavigate('cursos')}>Ver cursos</Button>
                <Button variant="light" onClick={()=>onNavigate('notas')}>Mis notas</Button>
                <Button variant="success" onClick={()=>onNavigate('alumnos')}>Alumnos</Button>
              </div>
            </div>
          </Card>

          <Card className="card-custom p-3">
            <h5>Alumnos</h5>
            <div className="small-muted">Vista rápida de alumnos</div>
            <div className="mt-3"><Alumnos /></div>
          </Card>
        </Col>
        <Col md={4}>
          <div className="quick-cards">
            <div className="quick-card">
              <h6>Hoy</h6>
              <p>Resumen de clases y trámites</p>
            </div>
            <div className="quick-card">
              <h6>Trámites</h6>
              <p>Rectificación de nota, solicitudes</p>
            </div>
            <div className="quick-card">
              <h6>Enlaces</h6>
              <p>Información institucional</p>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}
