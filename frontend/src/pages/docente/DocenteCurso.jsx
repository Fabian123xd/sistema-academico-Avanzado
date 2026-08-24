import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Tabs, Tab, Table, Form, Button, Row, Col, Alert, Badge } from 'react-bootstrap'
import docenteService from '../../services/docenteService'

export default function DocenteCurso() {
  const { id } = useParams()
  const cursoId = Number(id)

  const [matriculas, setMatriculas] = useState([])
  const [notas, setNotas] = useState([])
  const [asistencias, setAsistencias] = useState([])
  const [materiales, setMateriales] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])
  const [evaluacionSel, setEvaluacionSel] = useState(null)
  const [entregas, setEntregas] = useState([])
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)

  const [notaForm, setNotaForm] = useState({ matriculaId: '', concepto: '', valor: '', comentario: '' })
  const [asistenciaForm, setAsistenciaForm] = useState({ matriculaId: '', fecha: '', estado: 'PRESENTE', observacion: '' })
  const [materialForm, setMaterialForm] = useState({ titulo: '', descripcion: '', urlArchivo: '' })
  const [evalForm, setEvalForm] = useState({ titulo: '', descripcion: '', tipo: 'TAREA', fechaEntrega: '', puntajeMaximo: 20 })

  const cargarTodo = () => {
    docenteService.matriculasDeCurso(cursoId).then(setMatriculas)
    docenteService.notasDeCurso(cursoId).then(setNotas)
    docenteService.asistenciaDeCurso(cursoId).then(setAsistencias)
    docenteService.materialesDeCurso(cursoId).then(setMateriales)
    docenteService.evaluacionesDeCurso(cursoId).then(setEvaluaciones)
  }

  useEffect(() => { cargarTodo() }, [cursoId])

  const notificar = (fn) => async (e) => {
    e.preventDefault()
    setError(null)
    setMensaje(null)
    try {
      await fn()
      setMensaje('Guardado correctamente.')
      cargarTodo()
    } catch (err) {
      setError(err?.response?.data?.mensaje || 'Ocurrió un error.')
    }
  }

  const guardarNota = notificar(async () => {
    await docenteService.registrarNota({ ...notaForm, valor: Number(notaForm.valor) })
    setNotaForm({ matriculaId: '', concepto: '', valor: '', comentario: '' })
  })

  const guardarAsistencia = notificar(async () => {
    await docenteService.registrarAsistencia(asistenciaForm)
    setAsistenciaForm({ matriculaId: '', fecha: '', estado: 'PRESENTE', observacion: '' })
  })

  const guardarMaterial = notificar(async () => {
    await docenteService.subirMaterial(cursoId, materialForm)
    setMaterialForm({ titulo: '', descripcion: '', urlArchivo: '' })
  })

  const guardarEvaluacion = notificar(async () => {
    await docenteService.crearEvaluacion(cursoId, { ...evalForm, puntajeMaximo: Number(evalForm.puntajeMaximo) })
    setEvalForm({ titulo: '', descripcion: '', tipo: 'TAREA', fechaEntrega: '', puntajeMaximo: 20 })
  })

  const verEntregas = async (evaluacion) => {
    setEvaluacionSel(evaluacion)
    const data = await docenteService.entregasDeEvaluacion(evaluacion.id)
    setEntregas(data)
  }

  const calificar = async (entregaId, nota, comentarioDocente) => {
    await docenteService.calificarEntrega(entregaId, { nota: Number(nota), comentarioDocente })
    verEntregas(evaluacionSel)
  }

  const nombreEstudiante = (matriculaId) => {
    const m = matriculas.find((x) => x.id === matriculaId)
    return m ? `${m.estudiante?.usuario?.nombres || ''} ${m.estudiante?.usuario?.apellidos || ''}`.trim() : matriculaId
  }

  return (
    <>
      {mensaje && <Alert variant="success" onClose={() => setMensaje(null)} dismissible>{mensaje}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <Tabs defaultActiveKey="estudiantes" className="mb-3">
        <Tab eventKey="estudiantes" title="Estudiantes">
          <Card className="card-custom p-3">
            <Table striped hover responsive>
              <thead><tr><th>Código</th><th>Nombre</th><th>Estado</th></tr></thead>
              <tbody>
                {matriculas.map((m) => (
                  <tr key={m.id}>
                    <td>{m.estudiante?.usuario?.codigo}</td>
                    <td>{m.estudiante?.usuario?.nombres} {m.estudiante?.usuario?.apellidos}</td>
                    <td><Badge bg="info">{m.estado}</Badge></td>
                  </tr>
                ))}
                {matriculas.length === 0 && <tr><td colSpan={3} className="text-center small-muted">Sin estudiantes matriculados</td></tr>}
              </tbody>
            </Table>
          </Card>
        </Tab>

        <Tab eventKey="notas" title="Notas">
          <Card className="card-custom p-3 mb-3">
            <h6>Registrar nota</h6>
            <Form onSubmit={guardarNota}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <Form.Label>Estudiante</Form.Label>
                  <Form.Select required value={notaForm.matriculaId} onChange={(e) => setNotaForm({ ...notaForm, matriculaId: e.target.value })}>
                    <option value="">Selecciona...</option>
                    {matriculas.map((m) => <option key={m.id} value={m.id}>{m.estudiante?.usuario?.nombres} {m.estudiante?.usuario?.apellidos}</option>)}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label>Concepto</Form.Label>
                  <Form.Control required placeholder="Ej. Examen Parcial" value={notaForm.concepto} onChange={(e) => setNotaForm({ ...notaForm, concepto: e.target.value })} />
                </Col>
                <Col md={2}>
                  <Form.Label>Valor</Form.Label>
                  <Form.Control required type="number" step="0.1" min="0" max="20" value={notaForm.valor} onChange={(e) => setNotaForm({ ...notaForm, valor: e.target.value })} />
                </Col>
                <Col md={3}>
                  <Button type="submit" className="w-100">Guardar nota</Button>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card className="card-custom p-3">
            <Table striped hover responsive>
              <thead><tr><th>Estudiante</th><th>Concepto</th><th>Valor</th><th>Fecha</th></tr></thead>
              <tbody>
                {notas.map((n) => (
                  <tr key={n.id}>
                    <td>{nombreEstudiante(n.matricula?.id)}</td>
                    <td>{n.concepto}</td>
                    <td>{n.valor}</td>
                    <td>{n.fecha}</td>
                  </tr>
                ))}
                {notas.length === 0 && <tr><td colSpan={4} className="text-center small-muted">Sin notas registradas</td></tr>}
              </tbody>
            </Table>
          </Card>
        </Tab>

        <Tab eventKey="asistencia" title="Asistencia">
          <Card className="card-custom p-3 mb-3">
            <h6>Registrar asistencia</h6>
            <Form onSubmit={guardarAsistencia}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <Form.Label>Estudiante</Form.Label>
                  <Form.Select required value={asistenciaForm.matriculaId} onChange={(e) => setAsistenciaForm({ ...asistenciaForm, matriculaId: e.target.value })}>
                    <option value="">Selecciona...</option>
                    {matriculas.map((m) => <option key={m.id} value={m.id}>{m.estudiante?.usuario?.nombres} {m.estudiante?.usuario?.apellidos}</option>)}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control type="date" required value={asistenciaForm.fecha} onChange={(e) => setAsistenciaForm({ ...asistenciaForm, fecha: e.target.value })} />
                </Col>
                <Col md={3}>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select value={asistenciaForm.estado} onChange={(e) => setAsistenciaForm({ ...asistenciaForm, estado: e.target.value })}>
                    <option value="PRESENTE">Presente</option>
                    <option value="AUSENTE">Ausente</option>
                    <option value="TARDANZA">Tardanza</option>
                    <option value="JUSTIFICADO">Justificado</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Button type="submit" className="w-100">Guardar</Button>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card className="card-custom p-3">
            <Table striped hover responsive>
              <thead><tr><th>Estudiante</th><th>Fecha</th><th>Estado</th></tr></thead>
              <tbody>
                {asistencias.map((a) => (
                  <tr key={a.id}>
                    <td>{nombreEstudiante(a.matricula?.id)}</td>
                    <td>{a.fecha}</td>
                    <td><Badge bg={a.estado === 'PRESENTE' ? 'success' : a.estado === 'AUSENTE' ? 'danger' : 'warning'}>{a.estado}</Badge></td>
                  </tr>
                ))}
                {asistencias.length === 0 && <tr><td colSpan={3} className="text-center small-muted">Sin registros</td></tr>}
              </tbody>
            </Table>
          </Card>
        </Tab>

        <Tab eventKey="material" title="Material">
          <Card className="card-custom p-3 mb-3">
            <h6>Subir material de estudio</h6>
            <Form onSubmit={guardarMaterial}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <Form.Label>Título</Form.Label>
                  <Form.Control required value={materialForm.titulo} onChange={(e) => setMaterialForm({ ...materialForm, titulo: e.target.value })} />
                </Col>
                <Col md={4}>
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control value={materialForm.descripcion} onChange={(e) => setMaterialForm({ ...materialForm, descripcion: e.target.value })} />
                </Col>
                <Col md={3}>
                  <Form.Label>Enlace / URL</Form.Label>
                  <Form.Control required value={materialForm.urlArchivo} onChange={(e) => setMaterialForm({ ...materialForm, urlArchivo: e.target.value })} />
                </Col>
                <Col md={2}>
                  <Button type="submit" className="w-100">Subir</Button>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card className="card-custom p-3">
            <Table striped hover responsive>
              <thead><tr><th>Título</th><th>Descripción</th><th>Enlace</th></tr></thead>
              <tbody>
                {materiales.map((m) => (
                  <tr key={m.id}>
                    <td>{m.titulo}</td>
                    <td>{m.descripcion}</td>
                    <td><a href={m.urlArchivo} target="_blank" rel="noreferrer">Abrir</a></td>
                  </tr>
                ))}
                {materiales.length === 0 && <tr><td colSpan={3} className="text-center small-muted">Sin material</td></tr>}
              </tbody>
            </Table>
          </Card>
        </Tab>

        <Tab eventKey="evaluaciones" title="Tareas y exámenes">
          <Card className="card-custom p-3 mb-3">
            <h6>Nueva evaluación</h6>
            <Form onSubmit={guardarEvaluacion}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <Form.Label>Título</Form.Label>
                  <Form.Control required value={evalForm.titulo} onChange={(e) => setEvalForm({ ...evalForm, titulo: e.target.value })} />
                </Col>
                <Col md={3}>
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select value={evalForm.tipo} onChange={(e) => setEvalForm({ ...evalForm, tipo: e.target.value })}>
                    <option value="TAREA">Tarea</option>
                    <option value="EXAMEN">Examen</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label>Fecha límite</Form.Label>
                  <Form.Control type="datetime-local" value={evalForm.fechaEntrega} onChange={(e) => setEvalForm({ ...evalForm, fechaEntrega: e.target.value })} />
                </Col>
                <Col md={2}>
                  <Form.Label>Puntaje máx.</Form.Label>
                  <Form.Control type="number" value={evalForm.puntajeMaximo} onChange={(e) => setEvalForm({ ...evalForm, puntajeMaximo: e.target.value })} />
                </Col>
                <Col md={1}>
                  <Button type="submit" className="w-100">Crear</Button>
                </Col>
              </Row>
            </Form>
          </Card>

          <Row>
            <Col md={5}>
              <Card className="card-custom p-3">
                <h6>Evaluaciones del curso</h6>
                <Table striped hover responsive size="sm">
                  <thead><tr><th>Título</th><th>Tipo</th><th></th></tr></thead>
                  <tbody>
                    {evaluaciones.map((ev) => (
                      <tr key={ev.id}>
                        <td>{ev.titulo}</td>
                        <td><Badge bg={ev.tipo === 'EXAMEN' ? 'danger' : 'primary'}>{ev.tipo}</Badge></td>
                        <td><Button size="sm" variant="outline-secondary" onClick={() => verEntregas(ev)}>Ver entregas</Button></td>
                      </tr>
                    ))}
                    {evaluaciones.length === 0 && <tr><td colSpan={3} className="text-center small-muted">Sin evaluaciones</td></tr>}
                  </tbody>
                </Table>
              </Card>
            </Col>
            <Col md={7}>
              <Card className="card-custom p-3">
                <h6>Entregas {evaluacionSel && `— ${evaluacionSel.titulo}`}</h6>
                <Table striped hover responsive size="sm">
                  <thead><tr><th>Estudiante</th><th>Contenido</th><th>Nota</th><th>Calificar</th></tr></thead>
                  <tbody>
                    {entregas.map((en) => (
                      <FilaEntrega key={en.id} entrega={en} onCalificar={calificar} />
                    ))}
                    {evaluacionSel && entregas.length === 0 && <tr><td colSpan={4} className="text-center small-muted">Sin entregas aún</td></tr>}
                    {!evaluacionSel && <tr><td colSpan={4} className="text-center small-muted">Selecciona una evaluación</td></tr>}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </>
  )
}

function FilaEntrega({ entrega, onCalificar }) {
  const [nota, setNota] = useState(entrega.nota ?? '')
  const [comentario, setComentario] = useState(entrega.comentarioDocente ?? '')
  return (
    <tr>
      <td>{entrega.estudiante?.usuario?.nombres} {entrega.estudiante?.usuario?.apellidos}</td>
      <td style={{ maxWidth: 220 }} className="text-truncate">{entrega.contenido}</td>
      <td style={{ width: 90 }}>
        <Form.Control size="sm" type="number" value={nota} onChange={(e) => setNota(e.target.value)} />
      </td>
      <td style={{ width: 140 }}>
        <Button size="sm" onClick={() => onCalificar(entrega.id, nota, comentario)}>Guardar</Button>
      </td>
    </tr>
  )
}
