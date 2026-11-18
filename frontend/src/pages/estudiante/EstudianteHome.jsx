import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Table, Badge, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import estudianteService from '../../services/estudianteService'

export default function EstudianteHome() {
  const navigate = useNavigate()
  const [cursos, setCursos] = useState([])
  const [rendimiento, setRendimiento] = useState(null)

  useEffect(() => { 
    estudianteService.misCursos().then(setCursos).catch(console.error)
    estudianteService.obtenerRendimiento().then(setRendimiento).catch(console.error)
  }, [])

  const getBadgeDistincion = (distincion) => {
    switch (distincion) {
      case 'DÉCIMO SUPERIOR': return <Badge bg="warning" text="dark">⭐ Décimo Superior</Badge>
      case 'QUINTO SUPERIOR': return <Badge bg="primary">Quinto Superior</Badge>
      case 'TERCIO SUPERIOR': return <Badge bg="info">Tercio Superior</Badge>
      default: return <Badge bg="secondary">Regular</Badge>
    }
  }

  return (
    <>
      <Card className="card-custom mb-3 hero-card p-4">
        <h2 style={{ color: '#fff', marginTop: 0 }}>Bienvenido a tu portal estudiantil</h2>
        <p style={{ color: '#f0eefe', maxWidth: 650 }}>
          Revisa en tiempo real tus asignaturas, calificaciones ponderadas, horarios de clase y orden de mérito académico.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button variant="light" size="sm" onClick={() => navigate('/estudiante/notas')}>Ver mis notas y PPA</Button>
          <Button variant="outline-light" size="sm" onClick={() => navigate('/estudiante/horario')}>Mi horario</Button>
          <Button variant="outline-light" size="sm" onClick={() => navigate('/estudiante/evaluaciones')}>Tareas y exámenes</Button>
        </div>
      </Card>

      {/* Indicadores de Rendimiento */}
      <Row className="mb-3 g-3">
        <Col md={3} sm={6}>
          <Card className="card-custom p-3 text-center shadow-sm">
            <span className="text-muted small fw-bold text-uppercase">Promedio (PPA)</span>
            <h3 className="my-1 fw-bold text-primary">
              {rendimiento?.ppa != null ? Number(rendimiento.ppa).toFixed(2) : '0.00'}
            </h3>
            <small className="text-muted">Ponderado acumulado</small>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="card-custom p-3 text-center shadow-sm">
            <span className="text-muted small fw-bold text-uppercase">Mérito Académico</span>
            <div className="my-2">
              {getBadgeDistincion(rendimiento?.distincion)}
            </div>
            <small className="text-muted">Puesto #{rendimiento?.puesto || 1} en su carrera</small>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="card-custom p-3 text-center shadow-sm">
            <span className="text-muted small fw-bold text-uppercase">Créditos Aprobados</span>
            <h3 className="my-1 fw-bold text-success">
              {rendimiento?.creditosAprobados || 0}
              <span className="fs-6 text-muted fw-normal"> / {rendimiento?.creditosInscritos || 0}</span>
            </h3>
            <small className="text-muted">{rendimiento?.cursosAprobados || 0} asignaturas</small>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="card-custom p-3 text-center shadow-sm">
            <span className="text-muted small fw-bold text-uppercase">Carrera</span>
            <h5 className="my-2 fw-semibold text-truncate" title={rendimiento?.carrera}>
              {rendimiento?.carrera || 'General'}
            </h5>
            <small className="text-muted">{cursos.length} cursos activos</small>
          </Card>
        </Col>
      </Row>

      <Card className="card-custom p-3">
        <h5>Mis cursos activos</h5>
        <Table striped hover responsive className="mt-2 align-middle">
          <thead><tr><th>Código</th><th>Curso</th><th>Créditos</th><th>Periodo</th><th>Estado</th></tr></thead>
          <tbody>
            {cursos.map((m) => (
              <tr key={m.id}>
                <td><strong>{m.curso?.codigo}</strong></td>
                <td>{m.curso?.nombre}</td>
                <td>{m.curso?.creditos} cr.</td>
                <td>{m.curso?.periodo?.nombre || '—'}</td>
                <td>
                  <Badge bg={m.estado === 'APROBADO' ? 'success' : m.estado === 'DESAPROBADO' ? 'danger' : 'info'}>
                    {m.estado}
                  </Badge>
                </td>
              </tr>
            ))}
            {cursos.length === 0 && <tr><td colSpan={5} className="text-center small-muted">Aún no estás matriculado en ningún curso</td></tr>}
          </tbody>
        </Table>
      </Card>
    </>
  )
}
