import React, { useEffect, useState } from 'react'
import { Card, Table } from 'react-bootstrap'
import estudianteService from '../../services/estudianteService'

const ORDEN_DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']

export default function EstudianteHorario() {
  const [horario, setHorario] = useState([])

  useEffect(() => { estudianteService.miHorario().then(setHorario) }, [])

  const ordenado = [...horario].sort((a, b) => ORDEN_DIAS.indexOf(a.diaSemana) - ORDEN_DIAS.indexOf(b.diaSemana))

  return (
    <Card className="card-custom p-3">
      <h5>Mi horario</h5>
      <Table striped hover responsive className="mt-2">
        <thead><tr><th>Día</th><th>Curso</th><th>Hora inicio</th><th>Hora fin</th><th>Aula</th></tr></thead>
        <tbody>
          {ordenado.map((h) => (
            <tr key={h.id}>
              <td>{h.diaSemana}</td>
              <td>{h.curso?.nombre}</td>
              <td>{h.horaInicio}</td>
              <td>{h.horaFin}</td>
              <td>{h.aula}</td>
            </tr>
          ))}
          {ordenado.length === 0 && <tr><td colSpan={5} className="text-center small-muted">Sin horario asignado aún</td></tr>}
        </tbody>
      </Table>
    </Card>
  )
}
