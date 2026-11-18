import React, { useEffect, useState } from 'react'
import { Card, Table, Badge, Row, Col } from 'react-bootstrap'
import estudianteService from '../../services/estudianteService'

export default function EstudianteNotas() {
  const [notas, setNotas] = useState([])
  const [cursos, setCursos] = useState([])
  const [rendimiento, setRendimiento] = useState(null)

  useEffect(() => {
    estudianteService.misNotas().then(setNotas)
    estudianteService.misCursos().then(setCursos)
    estudianteService.obtenerRendimiento().then(setRendimiento).catch(console.error)
  }, [])

  const nombreCurso = (matriculaId) => {
    const m = cursos.find((c) => c.id === matriculaId)
    return m?.curso?.nombre || '—'
  }

  const getBadgeColor = (distincion) => {
    switch (distincion) {
      case 'DÉCIMO SUPERIOR': return 'warning'
      case 'QUINTO SUPERIOR': return 'primary'
      case 'TERCIO SUPERIOR': return 'info'
      default: return 'secondary'
    }
  }

  return (
    <>
      {/* Tarjetas de Rendimiento y PPA */}
      <Row className="mb-3 g-3">
        <Col md={3} sm={6}>
          <Card className="card-custom p-3 text-center h-100 shadow-sm border-0">
            <span className="text-muted small fw-bold text-uppercase">Promedio Acumulado (PPA)</span>
            <h2 className="my-1 fw-bold text-primary">
              {rendimiento?.ppa != null ? Number(rendimiento.ppa).toFixed(2) : '0.00'}
            </h2>
            <small className="text-muted">Escala vigesimal (0 - 20)</small>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="card-custom p-3 text-center h-100 shadow-sm border-0">
            <span className="text-muted small fw-bold text-uppercase">Mérito Académico</span>
            <div className="my-2">
              <Badge bg={getBadgeColor(rendimiento?.distincion)} className="fs-6 px-3 py-2">
                {rendimiento?.distincion || 'REGULAR'}
              </Badge>
            </div>
            <small className="text-muted">
              Puesto #{rendimiento?.puesto || 1} de {rendimiento?.totalEstudiantesCarrera || 1}
            </small>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="card-custom p-3 text-center h-100 shadow-sm border-0">
            <span className="text-muted small fw-bold text-uppercase">Créditos Aprobados</span>
            <h2 className="my-1 fw-bold text-success">
              {rendimiento?.creditosAprobados || 0}
              <span className="fs-6 text-muted fw-normal"> / {rendimiento?.creditosInscritos || 0}</span>
            </h2>
            <small className="text-muted">{rendimiento?.cursosAprobados || 0} asignaturas aprobadas</small>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="card-custom p-3 text-center h-100 shadow-sm border-0">
            <span className="text-muted small fw-bold text-uppercase">Especialidad</span>
            <h5 className="my-2 fw-semibold text-truncate" title={rendimiento?.carrera}>
              {rendimiento?.carrera || 'General'}
            </h5>
            <small className="text-muted">{rendimiento?.cursosEnCurso || 0} en curso · {rendimiento?.cursosDesaprobados || 0} desaprobados</small>
          </Card>
        </Col>
      </Row>

      {/* Resumen por Asignatura Matriculada */}
      <Card className="card-custom p-3 mb-3">
        <h5>Resumen de Asignaturas y Calificación Final</h5>
        <Table striped hover responsive className="mt-2 align-middle">
          <thead>
            <tr>
              <th>Código</th>
              <th>Asignatura</th>
              <th>Créditos</th>
              <th>Periodo</th>
              <th className="text-center">Promedio Final</th>
              <th className="text-center">Condición</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((m) => (
              <tr key={m.id}>
                <td><strong>{m.curso?.codigo}</strong></td>
                <td>{m.curso?.nombre}</td>
                <td>{m.curso?.creditos} cr.</td>
                <td>{m.curso?.periodo?.nombre || '—'}</td>
                <td className="text-center">
                  {m.promedioFinal != null ? (
                    <strong className={`fs-6 ${m.promedioFinal >= 10.5 ? 'text-success' : 'text-danger'}`}>
                      {m.promedioFinal}
                    </strong>
                  ) : (
                    <span className="small-muted">En evaluación</span>
                  )}
                </td>
                <td className="text-center">
                  <Badge
                    bg={
                      m.estado === 'APROBADO' ? 'success'
                      : m.estado === 'DESAPROBADO' ? 'danger'
                      : m.estado === 'COMPLETADO' ? 'primary'
                      : 'info'
                    }
                  >
                    {m.estado === 'INSCRITO' ? 'EN CURSO' : m.estado}
                  </Badge>
                </td>
              </tr>
            ))}
            {cursos.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center small-muted py-3">
                  No estás matriculado en ninguna asignatura en este periodo
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      {/* Detalle de Evaluaciones Registradas */}
      <Card className="card-custom p-3">
        <h5>Detalle de Evaluaciones Continuas</h5>
        <Table striped hover responsive className="mt-2">
          <thead><tr><th>Curso</th><th>Criterio</th><th>Concepto</th><th>Calificación</th><th>Comentario</th><th>Fecha</th></tr></thead>
          <tbody>
            {notas.map((n) => (
              <tr key={n.id}>
                <td><strong>{nombreCurso(n.matricula?.id)}</strong></td>
                <td>
                  {n.criterio ? (
                    <Badge bg="info">{n.criterio.codigo} ({n.criterio.porcentaje}%)</Badge>
                  ) : (
                    <Badge bg="secondary">General</Badge>
                  )}
                </td>
                <td>{n.concepto}</td>
                <td>
                  <strong className={n.valor >= 10.5 ? 'text-success' : 'text-danger'}>
                    {n.valor}
                  </strong>
                </td>
                <td>{n.comentario || '—'}</td>
                <td>{n.fecha}</td>
              </tr>
            ))}
            {notas.length === 0 && <tr><td colSpan={6} className="text-center small-muted">Aún no tienes calificaciones parciales registradas</td></tr>}
          </tbody>
        </Table>
      </Card>
    </>
  )
}
