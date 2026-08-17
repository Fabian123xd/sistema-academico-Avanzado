import React, { useEffect, useState } from 'react'
import { Table, Button, Form, Row, Col, Modal, Card, InputGroup, Badge } from 'react-bootstrap'
import alumnoService from '../services/alumnoService'

export default function Alumnos() {
  const [alumnos, setAlumnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', fechaNacimiento: '' })
  const [editingId, setEditingId] = useState(null)
  const [query, setQuery] = useState('')

  const fetch = async () => {
    setLoading(true)
    const res = await alumnoService.list()
    setAlumnos(res.data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm({ nombre: '', email: '', fechaNacimiento: '' })
    setShowModal(true)
  }

  const openEdit = (a) => {
    setEditingId(a.id)
    setForm({ nombre: a.nombre, email: a.email, fechaNacimiento: a.fechaNacimiento?.split('T')[0] || '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (editingId) {
      await alumnoService.update(editingId, form)
    } else {
      await alumnoService.create(form)
    }
    setShowModal(false)
    fetch()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Borrar alumno?')) return
    await alumnoService.deleteById(id)
    fetch()
  }

  return (
    <Card className="card-custom p-3">
      <div className="app-header">
        <div>
          <h4 className="app-title">Alumnos</h4>
          <div className="small-muted">Administrar estudiantes registrados</div>
        </div>
        <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
          <InputGroup style={{width:260}}>
            <Form.Control placeholder="Buscar nombre o email" value={query} onChange={e=>setQuery(e.target.value)} />
          </InputGroup>
          <Button onClick={openCreate} variant="success">+ Nuevo</Button>
        </div>
      </div>

      {loading ? <div className="empty-state">Cargando alumnos…</div> : (
        <div className="table-wrap">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="small-muted">Total: <Badge bg="secondary">{alumnos.length}</Badge></div>
          </div>
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Fecha Nac.</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.filter(a => (a.nombre || '').toLowerCase().includes(query.toLowerCase()) || (a.email||'').toLowerCase().includes(query.toLowerCase())).map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.nombre}</td>
                  <td className="small-muted">{a.email}</td>
                  <td>{a.fechaNacimiento ? a.fechaNacimiento.split('T')[0] : ''}</td>
                  <td className="actions-col">
                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openEdit(a)}>Editar</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(a.id)}>Borrar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {alumnos.length===0 && <div className="empty-state">No hay alumnos. Crea uno con "Nuevo".</div>}
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Editar alumno' : 'Nuevo alumno'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control type="date" value={form.fechaNacimiento} onChange={e => setForm({ ...form, fechaNacimiento: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  )
}
