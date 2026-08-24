import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import docenteService from '../../services/docenteService'

export default function DocenteHome() {
  const [cursos, setCursos] = useState([])
  const navigate = useNavigate()

  useEffect(() => { docenteService.misCursos().then(setCursos) }, [])

  return (
    <>
      <Card className="card-custom mb-3 hero-card p-3">
        <h2 style={{ color: '#fff', marginTop: 0 }}>Panel del Docente</h2>
        <p style={{ color: '#f0eefe' }}>Consulta tus cursos asignados, registra notas, asistencia, material y evaluaciones.</p>
      </Card>
      <Row className="g-3">
        {cursos.map((c) => (
          <Col md={4} key={c.id}>
            <Card className="card-custom p-3 h-100">
              <h5>{c.nombre}</h5>
              <div className="small-muted mb-2">{c.codigo} · {c.creditos} créditos</div>
              <div className="small-muted mb-3">Periodo: {c.periodo?.nombre || '—'}</div>
              <Button variant="light" onClick={() => navigate(`/docente/cursos/${c.id}`)}>Gestionar curso</Button>
            </Card>
          </Col>
        ))}
        {cursos.length === 0 && <Col><p className="small-muted">Aún no tienes cursos asignados.</p></Col>}
      </Row>
    </>
  )
}
