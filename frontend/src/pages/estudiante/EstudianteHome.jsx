import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Table, Badge } from 'react-bootstrap'
import estudianteService from '../../services/estudianteService'

export default function EstudianteHome() {
  const [cursos, setCursos] = useState([])

  useEffect(() => { estudianteService.misCursos().then(setCursos) }, [])

  return (
    <>
      <Card className="card-custom mb-3 hero-card p-3">
        <h2 style={{ color: '#fff', marginTop: 0 }}>Bienvenido a tu portal estudiantil</h2>
        <p style={{ color: '#f0eefe' }}>Consulta tu horario, notas, tareas, exámenes e historial académico.</p>
      </Card>
      <Card className="card-custom p-3">
        <h5>Mis cursos</h5>
        <Table striped hover responsive className="mt-2">
          <thead><tr><th>Código</th><th>Curso</th><th>Créditos</th><th>Periodo</th><th>Estado</th></tr></thead>
          <tbody>
            {cursos.map((m) => (
              <tr key={m.id}>
                <td>{m.curso?.codigo}</td>
                <td>{m.curso?.nombre}</td>
                <td>{m.curso?.creditos}</td>
                <td>{m.curso?.periodo?.nombre || '—'}</td>
                <td><Badge bg="info">{m.estado}</Badge></td>
              </tr>
            ))}
            {cursos.length === 0 && <tr><td colSpan={5} className="text-center small-muted">Aún no estás matriculado en ningún curso</td></tr>}
          </tbody>
        </Table>
      </Card>
    </>
  )
}
