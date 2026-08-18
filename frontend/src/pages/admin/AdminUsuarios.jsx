import React, { useEffect, useState } from 'react'
import { Card, Table, Form, Button, Row, Col, Tabs, Tab, Badge, Alert } from 'react-bootstrap'
import adminService from '../../services/adminService'

const FORM_VACIO = { nombres: '', apellidos: '', email: '', password: '', codigo: '', especialidad: '', telefono: '', fechaNacimiento: '' }

export default function AdminUsuarios() {
  const [rol, setRol] = useState('docentes')
  const [docentes, setDocentes] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [form, setForm] = useState(FORM_VACIO)
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const cargar = async () => {
    const [d, e] = await Promise.all([adminService.listarDocentes(), adminService.listarEstudiantes()])
    setDocentes(d)
    setEstudiantes(e)
  }

  useEffect(() => { cargar() }, [])

  const handleChange = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMensaje(null)
    setGuardando(true)
    try {
      if (rol === 'docentes') {
        await adminService.crearDocente(form)
        setMensaje('Docente creado correctamente.')
      } else {
        await adminService.crearEstudiante(form)
        setMensaje('Estudiante creado correctamente.')
      }
      setForm(FORM_VACIO)
      cargar()
    } catch (err) {
      setError(err?.response?.data?.mensaje || 'No se pudo crear el usuario.')
    } finally {
      setGuardando(false)
    }
  }

  const toggleEstado = async (id, activo) => {
    await adminService.cambiarEstado(id, !activo)
    cargar()
  }

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return
    await adminService.eliminarUsuario(id)
    cargar()
  }

  const renderTabla = (lista) => (
    <Table striped hover responsive className="mt-3">
      <thead>
        <tr>
          <th>Código</th><th>Nombre</th><th>Email</th><th>Estado</th><th></th>
        </tr>
      </thead>
      <tbody>
        {lista.map((u) => (
          <tr key={u.id}>
            <td>{u.codigo}</td>
            <td>{u.nombres} {u.apellidos}</td>
            <td>{u.email}</td>
            <td><Badge bg={u.activo ? 'success' : 'secondary'}>{u.activo ? 'Activo' : 'Inactivo'}</Badge></td>
            <td className="text-end">
              <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => toggleEstado(u.id, u.activo)}>
                {u.activo ? 'Desactivar' : 'Activar'}
              </Button>
              <Button size="sm" variant="outline-danger" onClick={() => eliminar(u.id)}>Eliminar</Button>
            </td>
          </tr>
        ))}
        {lista.length === 0 && <tr><td colSpan={5} className="text-center small-muted">Sin registros</td></tr>}
      </tbody>
    </Table>
  )

  return (
    <>
      <Card className="card-custom p-3 mb-3">
        <h4>Crear nuevo usuario</h4>
        <p className="small-muted">El administrador da de alta docentes y estudiantes; ambos comparten la misma tabla de perfiles con un rol distinto.</p>
        <Tabs activeKey={rol} onSelect={(k) => { setRol(k); setForm(FORM_VACIO) }} className="mb-3">
          <Tab eventKey="docentes" title="Docente" />
          <Tab eventKey="estudiantes" title="Estudiante" />
        </Tabs>

        {mensaje && <Alert variant="success" onClose={() => setMensaje(null)} dismissible>{mensaje}</Alert>}
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label>Nombres</Form.Label>
              <Form.Control required value={form.nombres} onChange={handleChange('nombres')} />
            </Col>
            <Col md={6}>
              <Form.Label>Apellidos</Form.Label>
              <Form.Control required value={form.apellidos} onChange={handleChange('apellidos')} />
            </Col>
            <Col md={6}>
              <Form.Label>Correo</Form.Label>
              <Form.Control type="email" required value={form.email} onChange={handleChange('email')} />
            </Col>
            <Col md={6}>
              <Form.Label>Contraseña temporal</Form.Label>
              <Form.Control type="password" required value={form.password} onChange={handleChange('password')} />
            </Col>
            <Col md={6}>
              <Form.Label>Código de acceso (opcional)</Form.Label>
              <Form.Control placeholder="Se autogenera si se deja vacío" value={form.codigo} onChange={handleChange('codigo')} />
            </Col>
            {rol === 'docentes' ? (
              <>
                <Col md={6}>
                  <Form.Label>Especialidad</Form.Label>
                  <Form.Control value={form.especialidad} onChange={handleChange('especialidad')} />
                </Col>
                <Col md={6}>
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control value={form.telefono} onChange={handleChange('telefono')} />
                </Col>
              </>
            ) : (
              <>
                <Col md={6}>
                  <Form.Label>Fecha de nacimiento</Form.Label>
                  <Form.Control type="date" value={form.fechaNacimiento} onChange={handleChange('fechaNacimiento')} />
                </Col>
                <Col md={6}>
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control value={form.telefono} onChange={handleChange('telefono')} />
                </Col>
              </>
            )}
          </Row>
          <Button type="submit" className="mt-3" disabled={guardando}>
            {guardando ? 'Guardando...' : `Crear ${rol === 'docentes' ? 'docente' : 'estudiante'}`}
          </Button>
        </Form>
      </Card>

      <Row>
        <Col md={6}>
          <Card className="card-custom p-3">
            <h5>Docentes</h5>
            {renderTabla(docentes)}
          </Card>
        </Col>
        <Col md={6}>
          <Card className="card-custom p-3">
            <h5>Estudiantes</h5>
            {renderTabla(estudiantes)}
          </Card>
        </Col>
      </Row>
    </>
  )
}
