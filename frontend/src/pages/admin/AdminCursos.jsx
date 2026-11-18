import React, { useEffect, useState } from 'react'
import { Card, Table, Form, Button, Row, Col, Alert, Badge, Tabs, Tab, Modal } from 'react-bootstrap'
import adminService from '../../services/adminService'

const CURSO_VACIO = { codigo: '', nombre: '', creditos: '', docenteId: '', periodoId: '', carreraId: '', ciclo: '1', tipo: 'OBLIGATORIO' }
const PERIODO_VACIO = { nombre: '', fechaInicio: '', fechaFin: '' }
const CARRERA_VACIO = { codigo: '', nombre: '', descripcion: '', duracionCiclos: 10 }

export default function AdminCursos() {
  const [cursos, setCursos] = useState([])
  const [docentes, setDocentes] = useState([])
  const [periodos, setPeriodos] = useState([])
  const [carreras, setCarreras] = useState([])
  const [carreraFiltro, setCarreraFiltro] = useState('')
  const [cursoForm, setCursoForm] = useState(CURSO_VACIO)
  const [periodoForm, setPeriodoForm] = useState(PERIODO_VACIO)
  const [carreraForm, setCarreraForm] = useState(CARRERA_VACIO)
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  // Estado para gestión de prerrequisitos
  const [cursoPrereqSel, setCursoPrereqSel] = useState(null)
  const [prerrequisitosCurso, setPrerrequisitosCurso] = useState([])
  const [nuevoPrereqId, setNuevoPrereqId] = useState('')

  const abrirModalPrereq = async (curso) => {
    setCursoPrereqSel(curso)
    setNuevoPrereqId('')
    try {
      const data = await adminService.listarPrerrequisitos(curso.id)
      setPrerrequisitosCurso(data)
    } catch (err) {
      console.error(err)
    }
  }

  const agregarPrerrequisito = async (e) => {
    e.preventDefault()
    if (!nuevoPrereqId || !cursoPrereqSel) return
    try {
      await adminService.agregarPrerrequisito(cursoPrereqSel.id, nuevoPrereqId)
      setNuevoPrereqId('')
      const data = await adminService.listarPrerrequisitos(cursoPrereqSel.id)
      setPrerrequisitosCurso(data)
      setMensaje('Prerrequisito asignado correctamente.')
    } catch (err) {
      setError(err?.response?.data?.mensaje || 'Error al asignar prerrequisito.')
    }
  }

  const eliminarPrerrequisito = async (prereqId) => {
    if (!cursoPrereqSel) return
    try {
      await adminService.eliminarPrerrequisito(cursoPrereqSel.id, prereqId)
      const data = await adminService.listarPrerrequisitos(cursoPrereqSel.id)
      setPrerrequisitosCurso(data)
      setMensaje('Prerrequisito removido.')
    } catch (err) {
      setError(err?.response?.data?.mensaje || 'Error al eliminar prerrequisito.')
    }
  }

  const cargar = async () => {
    try {
      const [c, d, p, car] = await Promise.all([
        adminService.listarCursos(),
        adminService.listarDocentes(),
        adminService.listarPeriodos(),
        adminService.listarCarreras()
      ])
      setCursos(c)
      setDocentes(d)
      setPeriodos(p)
      setCarreras(car)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { cargar() }, [])

  const crearCarrera = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await adminService.crearCarrera({
        ...carreraForm,
        duracionCiclos: Number(carreraForm.duracionCiclos || 10)
      })
      setCarreraForm(CARRERA_VACIO)
      setMensaje('Carrera académica creada exitosamente.')
      cargar()
    } catch (err) {
      setError(err?.response?.data?.mensaje || 'No se pudo crear la carrera.')
    }
  }

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
        periodoId: cursoForm.periodoId || null,
        carreraId: cursoForm.carreraId ? Number(cursoForm.carreraId) : null,
        ciclo: Number(cursoForm.ciclo || 1),
        tipo: cursoForm.tipo || 'OBLIGATORIO'
      })
      setCursoForm(CURSO_VACIO)
      setMensaje('Curso creado correctamente en la malla curricular.')
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

  const cursosFiltrados = carreraFiltro
    ? cursos.filter(c => c.carrera?.id === Number(carreraFiltro))
    : cursos

  return (
    <>
      {mensaje && <Alert variant="success" onClose={() => setMensaje(null)} dismissible>{mensaje}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <Row className="mb-3">
        {/* Columna Izquierda: Pestañas para Carreras y Periodos */}
        <Col md={5}>
          <Card className="card-custom p-3 mb-3">
            <Tabs defaultActiveKey="carreras" className="mb-3">
              <Tab eventKey="carreras" title="Carreras">
                <h6>Nueva Carrera</h6>
                <Form onSubmit={crearCarrera}>
                  <Form.Label>Código (ej. ING-SIS)</Form.Label>
                  <Form.Control required className="mb-2" value={carreraForm.codigo}
                    onChange={(e) => setCarreraForm({ ...carreraForm, codigo: e.target.value })} />
                  <Form.Label>Nombre de la Carrera</Form.Label>
                  <Form.Control required className="mb-2" value={carreraForm.nombre}
                    onChange={(e) => setCarreraForm({ ...carreraForm, nombre: e.target.value })} />
                  <Form.Label>Total de Ciclos</Form.Label>
                  <Form.Control type="number" min="1" max="14" className="mb-2" value={carreraForm.duracionCiclos}
                    onChange={(e) => setCarreraForm({ ...carreraForm, duracionCiclos: e.target.value })} />
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control as="textarea" rows={2} className="mb-3" value={carreraForm.descripcion}
                    onChange={(e) => setCarreraForm({ ...carreraForm, descripcion: e.target.value })} />
                  <Button type="submit" size="sm">Registrar Carrera</Button>
                </Form>
                <hr />
                <div className="small-muted fw-bold mb-1">Carreras activas:</div>
                <ul className="small-muted ps-3 mb-0">
                  {carreras.map((car) => (
                    <li key={car.id}><strong>{car.codigo}</strong> — {car.nombre} ({car.duracionCiclos} ciclos)</li>
                  ))}
                  {carreras.length === 0 && <li>Sin carreras registradas</li>}
                </ul>
              </Tab>

              <Tab eventKey="periodos" title="Periodos">
                <h6>Nuevo Periodo Académico</h6>
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
                  <Button type="submit" size="sm">Crear periodo</Button>
                </Form>
                <hr />
                <ul className="small-muted ps-3 mb-0">
                  {periodos.map((p) => <li key={p.id}>{p.nombre} ({p.fechaInicio} — {p.fechaFin})</li>)}
                </ul>
              </Tab>
            </Tabs>
          </Card>
        </Col>

        {/* Columna Derecha: Formulario de Creación de Curso dentro de la Malla */}
        <Col md={7}>
          <Card className="card-custom p-3">
            <h5>Nuevo curso (Malla Curricular)</h5>
            <Form onSubmit={crearCurso}>
              <Row className="g-2">
                <Col md={4}>
                  <Form.Label>Código</Form.Label>
                  <Form.Control required placeholder="Ej. SIS101" value={cursoForm.codigo} onChange={(e) => setCursoForm({ ...cursoForm, codigo: e.target.value })} />
                </Col>
                <Col md={8}>
                  <Form.Label>Nombre de la Asignatura</Form.Label>
                  <Form.Control required placeholder="Ej. Algoritmos y Estructura de Datos" value={cursoForm.nombre} onChange={(e) => setCursoForm({ ...cursoForm, nombre: e.target.value })} />
                </Col>
                <Col md={6}>
                  <Form.Label>Carrera</Form.Label>
                  <Form.Select value={cursoForm.carreraId} onChange={(e) => setCursoForm({ ...cursoForm, carreraId: e.target.value })}>
                    <option value="">Selecciona carrera...</option>
                    {carreras.map((car) => <option key={car.id} value={car.id}>{car.codigo} — {car.nombre}</option>)}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label>Ciclo / Semestre</Form.Label>
                  <Form.Select value={cursoForm.ciclo} onChange={(e) => setCursoForm({ ...cursoForm, ciclo: e.target.value })}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                      <option key={num} value={num}>Ciclo {num}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select value={cursoForm.tipo} onChange={(e) => setCursoForm({ ...cursoForm, tipo: e.target.value })}>
                    <option value="OBLIGATORIO">Obligatorio</option>
                    <option value="ELECTIVO">Electivo</option>
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Label>Créditos</Form.Label>
                  <Form.Control type="number" min="1" max="10" value={cursoForm.creditos} onChange={(e) => setCursoForm({ ...cursoForm, creditos: e.target.value })} />
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
              <Button type="submit" className="mt-3">Crear curso en la malla</Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Tabla de Cursos con Filtro de Malla Curricular */}
      <Card className="card-custom p-3">
        <Row className="align-items-center mb-3">
          <Col md={6}>
            <h5 className="mb-0">Malla Curricular / Cursos Registrados</h5>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center justify-content-end gap-2">
              <span className="small-muted">Filtrar por Carrera:</span>
              <Form.Select
                size="sm"
                style={{ maxWidth: 280 }}
                value={carreraFiltro}
                onChange={(e) => setCarreraFiltro(e.target.value)}
              >
                <option value="">Todas las carreras</option>
                {carreras.map((car) => (
                  <option key={car.id} value={car.id}>{car.codigo} — {car.nombre}</option>
                ))}
              </Form.Select>
            </div>
          </Col>
        </Row>

        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre de Asignatura</th>
              <th>Carrera</th>
              <th>Ciclo</th>
              <th>Tipo</th>
              <th>Créditos</th>
              <th>Periodo</th>
              <th>Docente</th>
              <th className="text-center">Prerrequisitos</th>
            </tr>
          </thead>
          <tbody>
            {cursosFiltrados.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.codigo}</strong></td>
                <td>{c.nombre}</td>
                <td>{c.carrera?.codigo || 'General'}</td>
                <td>Ciclo {c.ciclo || 1}</td>
                <td>
                  <Badge bg={c.tipo === 'ELECTIVO' ? 'secondary' : 'primary'}>
                    {c.tipo || 'OBLIGATORIO'}
                  </Badge>
                </td>
                <td>{c.creditos} cr.</td>
                <td>{c.periodo?.nombre || '—'}</td>
                <td style={{ minWidth: 200 }}>
                  <Form.Select size="sm" defaultValue={c.docente?.usuario?.id || ''} onChange={(e) => asignarDocente(c.id, e.target.value)}>
                    <option value="">Sin asignar</option>
                    {docentes.map((d) => <option key={d.id} value={d.id}>{d.nombres} {d.apellidos}</option>)}
                  </Form.Select>
                </td>
                <td className="text-center">
                  <Button size="sm" variant="outline-info" onClick={() => abrirModalPrereq(c)}>
                    Gestionar
                  </Button>
                </td>
              </tr>
            ))}
            {cursosFiltrados.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center small-muted py-4">
                  No hay cursos registrados en esta categoría
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      {/* Modal de Prerrequisitos */}
      <Modal show={!!cursoPrereqSel} onHide={() => setCursoPrereqSel(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Prerrequisitos: {cursoPrereqSel?.codigo} — {cursoPrereqSel?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small-muted">
            Los cursos configurados aquí deberán haber sido aprobados previamente por el estudiante para poder matricularse en esta asignatura.
          </p>

          <Form onSubmit={agregarPrerrequisito} className="mb-3">
            <Form.Label>Agregar Curso Prerrequisito</Form.Label>
            <div className="d-flex gap-2">
              <Form.Select
                value={nuevoPrereqId}
                onChange={(e) => setNuevoPrereqId(e.target.value)}
                required
              >
                <option value="">Selecciona curso previo...</option>
                {cursos
                  .filter(c => c.id !== cursoPrereqSel?.id && !prerrequisitosCurso.some(p => p.id === c.id))
                  .map(c => (
                    <option key={c.id} value={c.id}>{c.codigo} — {c.nombre} (Ciclo {c.ciclo || 1})</option>
                  ))
                }
              </Form.Select>
              <Button type="submit" variant="primary" size="sm" style={{ whiteSpace: 'nowrap' }}>
                Agregar
              </Button>
            </div>
          </Form>

          <h6>Prerrequisitos actuales:</h6>
          <ul className="list-group">
            {prerrequisitosCurso.map(p => (
              <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center py-2">
                <div>
                  <strong>{p.codigo}</strong> — {p.nombre}
                  <span className="small-muted ms-2">(Ciclo {p.ciclo || 1})</span>
                </div>
                <Button size="sm" variant="outline-danger" onClick={() => eliminarPrerrequisito(p.id)}>
                  Quitar
                </Button>
              </li>
            ))}
            {prerrequisitosCurso.length === 0 && (
              <li className="list-group-item text-center small-muted py-3">
                Este curso no tiene prerrequisitos obligatorios.
              </li>
            )}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCursoPrereqSel(null)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
