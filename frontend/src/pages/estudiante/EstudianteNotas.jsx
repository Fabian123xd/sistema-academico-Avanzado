import React, { useEffect, useState } from 'react'
import { Card, Table } from 'react-bootstrap'
import estudianteService from '../../services/estudianteService'

export default function EstudianteNotas() {
  const [notas, setNotas] = useState([])
  const [cursos, setCursos] = useState([])

  useEffect(() => {
    estudianteService.misNotas().then(setNotas)
    estudianteService.misCursos().then(setCursos)
  }, [])

  const nombreCurso = (matriculaId) => {
    const m = cursos.find((c) => c.id === matriculaId)
    return m?.curso?.nombre || '—'
  }

  return (
    <Card className="card-custom p-3">
      <h5>Mis notas</h5>
      <Table striped hover responsive className="mt-2">
        <thead><tr><th>Curso</th><th>Concepto</th><th>Valor</th><th>Comentario</th><th>Fecha</th></tr></thead>
        <tbody>
          {notas.map((n) => (
            <tr key={n.id}>
              <td>{nombreCurso(n.matricula?.id)}</td>
              <td>{n.concepto}</td>
              <td>{n.valor}</td>
              <td>{n.comentario}</td>
              <td>{n.fecha}</td>
            </tr>
          ))}
          {notas.length === 0 && <tr><td colSpan={5} className="text-center small-muted">Aún no tienes notas registradas</td></tr>}
        </tbody>
      </Table>
    </Card>
  )
}
