import React, { useEffect, useState } from 'react'
import { Card, Table, Badge, Button, Form, Modal, Alert } from 'react-bootstrap'
import estudianteService from '../../services/estudianteService'

export default function EstudianteEvaluaciones() {
  const [evaluaciones, setEvaluaciones] = useState([])
  const [entregas, setEntregas] = useState([])
  const [seleccion, setSeleccion] = useState(null)
  const [contenido, setContenido] = useState('')
  const [error, setError] = useState(null)

  const cargar = () => {
    estudianteService.evaluacionesDisponibles().then(setEvaluaciones)
    estudianteService.misEntregas().then(setEntregas)
  }

  useEffect(() => { cargar() }, [])

  const yaEntregado = (evaluacionId) => entregas.find((e) => e.evaluacion?.id === evaluacionId)

  const enviar = async () => {
    setError(null)
    try {
      await estudianteService.entregar(seleccion.id, contenido)
      setSeleccion(null)
      setContenido('')
      cargar()
    } catch (err) {
      setError(err?.response?.data?.mensaje || 'No se pudo registrar tu entrega.')
    }
  }

  return (
    <Card className="card-custom p-3">
      <h5>Tareas y exámenes</h5>
      <Table striped hover responsive className="mt-2">
        <thead><tr><th>Curso</th><th>Título</th><th>Tipo</th><th>Fecha límite</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          {evaluaciones.map((ev) => {
            const entrega = yaEntregado(ev.id)
            return (
              <tr key={ev.id}>
                <td>{ev.curso?.nombre}</td>
                <td>{ev.titulo}</td>
                <td><Badge bg={ev.tipo === 'EXAMEN' ? 'danger' : 'primary'}>{ev.tipo}</Badge></td>
                <td>{ev.fechaEntrega ? new Date(ev.fechaEntrega).toLocaleString() : '—'}</td>
                <td>
                  {entrega
                    ? <Badge bg={entrega.nota != null ? 'success' : 'secondary'}>{entrega.nota != null ? `Calificado: ${entrega.nota}` : 'Entregado'}</Badge>
                    : <Badge bg="warning">Pendiente</Badge>}
                </td>
                <td>
                  {!entrega && (
                    <Button size="sm" onClick={() => { setSeleccion(ev); setContenido('') }}>
                      {ev.tipo === 'EXAMEN' ? 'Rendir examen' : 'Entregar tarea'}
                    </Button>
                  )}
                </td>
              </tr>
            )
          })}
          {evaluaciones.length === 0 && <tr><td colSpan={6} className="text-center small-muted">No hay evaluaciones disponibles</td></tr>}
        </tbody>
      </Table>

      <Modal show={!!seleccion} onHide={() => setSeleccion(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{seleccion?.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <p className="small-muted">{seleccion?.descripcion}</p>
          <Form.Label>{seleccion?.tipo === 'EXAMEN' ? 'Tus respuestas' : 'Enlace o contenido de tu entrega'}</Form.Label>
          <Form.Control as="textarea" rows={6} value={contenido} onChange={(e) => setContenido(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSeleccion(null)}>Cancelar</Button>
          <Button variant="primary" onClick={enviar} disabled={!contenido.trim()}>Enviar</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  )
}
