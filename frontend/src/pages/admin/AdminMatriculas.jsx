import React, { useEffect, useState } from 'react'
import { Card, Form, Button, Row, Col, Table, Alert } from 'react-bootstrap'
import adminService from '../../services/adminService'

export default function AdminMatriculas() {
  const [estudiantes, setEstudiantes] = useState([])
  const [cursos, setCursos] = useState([])
  const [estudianteId, setEstudianteId] = useState('')
  const [cursoId, setCursoId] = useState('')
  const [matriculas, setMatriculas] = useState([])
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  const cargarBase = async () => {
    const [e, c] = await Promise.all([adminService.listarEstudiantes(), adminService.listarCursos()])
    setEstudiantes(e)
    setCursos(c)
  }

  useEffect(() => { cargarBase() }, [])

  useEffect(() => {
    if (cursoId) {
      adminService.matriculasDeCurso(cursoId).then(setMatriculas)
    } else {
      setMatriculas([])
    }
  }, [cursoId])

  const matricular = async (e) => {
    e.preventDefault()
    setError(null)
    setMensaje(null)
    if (!estudianteId || !cursoId) return
    try {
      await adminService.matricular(estudianteId, cursoId)
      setMensaje('Estudiante matriculado correctamente.')
      adminService.matriculasDeCurso(cursoId).then(setMatriculas)
    } catch (err) {
      setError(err?.response?.data?.mensaje || 'No se pudo matricular al estudiante.')
    }
  }

  return (
    <>
      <Card className="card-custom p-3 mb-3">
        <h5>Matricular estudiante en un curso</h5>
        {mensaje && <Alert variant="success" onClose={() => setMensaje(null)} dismissible>{mensaje}</Alert>}
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
        <Form onSubmit={matricular}>
          <Row className="g-3 align-items-end">
            <Col md={5}>
              <Form.Label>Estudiante</Form.Label>
              <Form.Select value={estudianteId} onChange={(e) => setEstudianteId(e.target.value)} required>
                <option value="">Selecciona...</option>
                {estudiantes.map((es) => <option key={es.id} value={es.id}>{es.codigo} — {es.nombres} {es.apellidos}</option>)}
              </Form.Select>
            </Col>
            <Col md={5}>
              <Form.Label>Curso</Form.Label>
              <Form.Select value={cursoId} onChange={(e) => setCursoId(e.target.value)} required>
                <option value="">Selecciona...</option>
                {cursos.map((c) => <option key={c.id} value={c.id}>{c.codigo} — {c.nombre}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button type="submit" className="w-100">Matricular</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card className="card-custom p-3">
        <h5>Estudiantes matriculados {cursoId && `en el curso seleccionado`}</h5>
        <Table striped hover responsive className="mt-2">
          <thead><tr><th>Código</th><th>Estudiante</th><th>Fecha matrícula</th><th>Estado</th></tr></thead>
          <tbody>
            {matriculas.map((m) => (
              <tr key={m.id}>
                <td>{m.estudiante?.usuario?.codigo}</td>
                <td>{m.estudiante?.usuario?.nombres} {m.estudiante?.usuario?.apellidos}</td>
                <td>{m.fechaMatricula}</td>
                <td>{m.estado}</td>
              </tr>
            ))}
            {matriculas.length === 0 && <tr><td colSpan={4} className="text-center small-muted">Selecciona un curso para ver sus matrículas</td></tr>}
          </tbody>
        </Table>
      </Card>
    </>
  )
}
