import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function AdminHome() {
  const navigate = useNavigate()
  return (
    <Row className="mb-3">
      <Col md={12}>
        <Card className="card-custom mb-3 hero-card p-3">
          <h2 style={{ color: '#fff', marginTop: 0 }}>Panel de Administración</h2>
          <p style={{ color: '#f0eefe' }}>
            Gestiona usuarios, cursos, periodos académicos y matrículas de toda la plataforma.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button variant="light" onClick={() => navigate('/admin/usuarios')}>Gestionar usuarios</Button>
            <Button variant="outline-light" onClick={() => navigate('/admin/cursos')}>Gestionar cursos</Button>
            <Button variant="outline-light" onClick={() => navigate('/admin/matriculas')}>Matrículas</Button>
          </div>
        </Card>
      </Col>
    </Row>
  )
}
