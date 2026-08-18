import React, { useEffect, useState } from 'react'
import { Card, Table, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import adminService from '../../services/adminService'

const CURSO_VACIO = { codigo: '', nombre: '', creditos: '', docenteId: '', periodoId: '' }
const PERIODO_VACIO = { nombre: '', fechaInicio: '', fechaFin: '' }

export default function AdminCursos() {
  const [cursos, setCursos] = useState([])
  const [docentes, setDocentes] = useState([])
  const [periodos, setPeriodos] = useState([])
  const [cursoForm, setCursoForm] = useState(CURSO_VACIO)
  const [periodoForm, setPeriodoForm] = useState(PERIODO_VACIO)
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  const cargar = async () => {
    const [c, d, p] = await Promise.all([
      adminService.listarCursos(),
      adminService.listarDocentes(),
      adminService.listarPeriodos()
    ])
    setCursos(c)
    setDocentes(d)
    setPeriodos(p)
  }

  useEffect(() => { cargar() }, [])

  const crearPeriodo = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await adminService.crearPeriodo(periodoForm)
      setPeriodoForm(PERIODO_VACIO)
      setMensaje('Periodo académico creado.')
      cargar()
    } catch (err) {
      setError(err?.response?.data?.mensaje || 'No se pudo crear el periodo.')
    }
  }

  const crearCurso = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await adminService.crearCurso({
        ...cursoForm,
        creditos: cursoForm.creditos ? Number(cursoForm.creditos) : null,
        docenteId: cursoForm.docenteId || null,
        periodoId: cursoForm.periodoId || null
      })
      setCursoForm(CURSO_VACIO)
      setMensaje('Curso creado correctamente.')
      cargar()
    } catch (err) {
      setError(err?.response?.data?.mensaje || 'No se pudo crear el curso.')
    }
  }

  const asignarDocente = async (cursoId, docenteId) => {
    if (!docenteId) return
    await adminService.asignarDocente(cursoId, docenteId)
    cargar()
  }

  return (
    <>
      {mensaje && <Alert variant="success" onClose={() => setMensaje(null)} dismissible>{mensaje}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <Row className="mb-3">
        <Col md={5}>
          <Card className="card-custom p-3">
            <h5>Nuevo periodo académico</h5>
            <Form onSubmit={crearPeriodo}>
              <Form.Label>Nombre (ej. 2026-I)</Form.Label>
              <Form.Control required className="mb-2" value={periodoForm.nombre}
                onChange={(e) => setPeriodoForm({ ...periodoForm, nombre: e.target.value })} />
              <Form.Label>Fecha inicio</Form.Label>
              <Form.Control type="date" className="mb-2" value={periodoForm.fechaInicio}
                onChange={(e) => setPeriodoForm({ ...periodoForm, fechaInicio: e.target.value })} />
              <Form.Label>Fecha fin</Form.Label>
              <Form.Control type="date" className="mb-3" value={periodoForm.fechaFin}
                onChange={(e) => setPeriodoForm({ ...periodoForm, fechaFin: e.target.value })} />
              <Button type="submit">Crear periodo</Button>
            </Form>
            <hr />
            <ul className="small-muted">
              {periodos.map((p) => <li key={p.id}>{p.nombre} ({p.fechaInicio} — {p.fechaFin})</li>)}
            </ul>
          </Card>
        </Col>

        <Col md={7}>
          <Card className="card-custom p-3">
            <h5>Nuevo curso</h5>
            <Form onSubmit={crearCurso}>
              <Row className="g-2">
                <Col md={4}>
                  <Form.Label>Código</Form.Label>
                  <Form.Control required value={cursoForm.codigo} onChange={(e) => setCursoForm({ ...cursoForm, codigo: e.target.value })} />
                </Col>
                <Col md={8}>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control required value={cursoForm.nombre} onChange={(e) => setCursoForm({ ...cursoForm, nombre: e.target.value })} />
                </Col>
                <Col md={4}>
                  <Form.Label>Créditos</Form.Label>
                  <Form.Control type="number" value={cursoForm.creditos} onChange={(e) => setCursoForm({ ...cursoForm, creditos: e.target.value })} />
                </Col>
                <Col md={4}>
                  <Form.Label>Docente</Form.Label>
                  <Form.Select value={cursoForm.docenteId} onChange={(e) => setCursoForm({ ...cursoForm, docenteId: e.target.value })}>
                    <option value="">Sin asignar</option>
                    {docentes.map((d) => <option key={d.id} value={d.id}>{d.nombres} {d.apellidos}</option>)}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Label>Periodo</Form.Label>
                  <Form.Select value={cursoForm.periodoId} onChange={(e) => setCursoForm({ ...cursoForm, periodoId: e.target.value })}>
                    <option value="">Sin asignar</option>
                    {periodos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </Form.Select>
                </Col>
              </Row>
              <Button type="submit" className="mt-3">Crear curso</Button>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card className="card-custom p-3">
        <h5>Cursos registrados</h5>
        <Table striped hover responsive>
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Créditos</th><th>Periodo</th><th>Docente asignado</th></tr>
          </thead>
          <tbody>
            {cursos.map((c) => (
              <tr key={c.id}>
                <td>{c.codigo}</td>
                <td>{c.nombre}</td>
                <td>{c.creditos}</td>
                <td>{c.periodo?.nombre || '—'}</td>
                <td style={{ minWidth: 220 }}>
                  <Form.Select size="sm" defaultValue={c.docente?.id || ''} onChange={(e) => asignarDocente(c.id, e.target.value)}>
                    <option value="">Sin asignar</option>
                    {docentes.map((d) => <option key={d.id} value={d.id}>{d.nombres} {d.apellidos}</option>)}
                  </Form.Select>
                </td>
              </tr>
            ))}
            {cursos.length === 0 && <tr><td colSpan={5} className="text-center small-muted">Sin cursos</td></tr>}
          </tbody>
        </Table>
      </Card>
    </>
  )
}
