import React, { useEffect, useState } from 'react'
import { Card, Table, Badge } from 'react-bootstrap'
import estudianteService from '../../services/estudianteService'

const COLOR_ESTADO = { INSCRITO: 'info', COMPLETADO: 'success', RETIRADO: 'secondary' }

export default function EstudianteHistorial() {
  const [historial, setHistorial] = useState([])

  useEffect(() => { estudianteService.historial().then(setHistorial) }, [])

  return (
    <Card className="card-custom p-3">
      <h5>Historial académico</h5>
      <Table striped hover responsive className="mt-2">
        <thead><tr><th>Curso</th><th>Créditos</th><th>Periodo</th><th>Fecha matrícula</th><th>Estado</th></tr></thead>
        <tbody>
          {historial.map((m) => (
            <tr key={m.id}>
              <td>{m.curso?.nombre}</td>
              <td>{m.curso?.creditos}</td>
              <td>{m.curso?.periodo?.nombre || '—'}</td>
              <td>{m.fechaMatricula}</td>
              <td><Badge bg={COLOR_ESTADO[m.estado] || 'dark'}>{m.estado}</Badge></td>
            </tr>
          ))}
          {historial.length === 0 && <tr><td colSpan={5} className="text-center small-muted">Sin historial académico</td></tr>}
        </tbody>
      </Table>
    </Card>
  )
}
