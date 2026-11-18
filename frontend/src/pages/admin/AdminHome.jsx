import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Button, Table, Badge, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import adminService from '../../services/adminService'

export default function AdminHome() {
  const navigate = useNavigate()
  const [carreras, setCarreras] = useState([])
  const [carreraSeleccionada, setCarreraSeleccionada] = useState('')
  const [cuadroMerito, setCuadroMerito] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    adminService.listarCarreras().then(setCarreras).catch(console.error)
    cargarCuadroMerito()
  }, [])

  const cargarCuadroMerito = (carreraId) => {
    setLoading(true)
    adminService.obtenerCuadroMerito(carreraId)
      .then((data) => setCuadroMerito(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleCarreraChange = (e) => {
    const val = e.target.value
    setCarreraSeleccionada(val)
    cargarCuadroMerito(val || null)
  }

  const getBadgeDistincion = (distincion) => {
    switch (distincion) {
      case 'DÉCIMO SUPERIOR':
        return <Badge bg="warning" text="dark" className="px-2 py-1">⭐ Décimo Superior</Badge>
      case 'QUINTO SUPERIOR':
        return <Badge bg="primary" className="px-2 py-1">Quinto Superior</Badge>
      case 'TERCIO SUPERIOR':
        return <Badge bg="info" className="px-2 py-1">Tercio Superior</Badge>
      default:
        return <Badge bg="secondary" className="px-2 py-1">Regular</Badge>
    }
  }

  const getPuestoIcon = (puesto) => {
    if (puesto === 1) return '🥇 1°'
    if (puesto === 2) return '🥈 2°'
    if (puesto === 3) return '🥉 3°'
    return `${puesto}°`
  }

  return (
    <>
      <Row className="mb-3">
        <Col md={12}>
          <Card className="card-custom mb-3 hero-card p-4">
            <h2 style={{ color: '#fff', marginTop: 0 }}>Panel de Administración Académica</h2>
            <p style={{ color: '#f0eefe', maxWidth: 700 }}>
              Gestiona carreras, malla curricular, control de cupos, horarios, matrículas y visualiza en tiempo real el rendimiento y cuadro de mérito institucional.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <Button variant="light" onClick={() => navigate('/admin/usuarios')}>Gestionar usuarios</Button>
              <Button variant="outline-light" onClick={() => navigate('/admin/cursos')}>Malla curricular y cursos</Button>
              <Button variant="outline-light" onClick={() => navigate('/admin/matriculas')}>Matrículas y cupos</Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Cuadro de Honor y Ranking PPA */}
      <Card className="card-custom p-4 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <div>
            <h4 className="mb-1 text-primary fw-bold">🏆 Cuadro de Honor y Orden de Mérito</h4>
            <p className="text-muted small mb-0">
              Ranking calculado mediante el Promedio Ponderado Acumulado (PPA) según créditos de cursos concluidos.
            </p>
          </div>
          <div style={{ minWidth: 260 }}>
            <Form.Select value={carreraSeleccionada} onChange={handleCarreraChange} size="sm">
              <option value="">Todas las carreras</option>
              {carreras.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </Form.Select>
          </div>
        </div>

        <Table striped hover responsive className="align-middle mt-2">
          <thead className="table-light">
            <tr>
              <th className="text-center" style={{ width: 80 }}>Puesto</th>
              <th>Código</th>
              <th>Estudiante</th>
              <th>Carrera / Especialidad</th>
              <th className="text-center">Créditos Aprobados</th>
              <th className="text-center">PPA</th>
              <th className="text-center">Distinción Académica</th>
            </tr>
          </thead>
          <tbody>
            {cuadroMerito.map((est) => (
              <tr key={est.estudianteId}>
                <td className="text-center fw-bold fs-6">
                  {getPuestoIcon(est.puesto)}
                </td>
                <td><Badge bg="light" text="dark" className="border">{est.codigo}</Badge></td>
                <td><strong>{est.nombreCompleto}</strong></td>
                <td>{est.carrera || 'General'}</td>
                <td className="text-center">{est.creditosAprobados || 0} cr.</td>
                <td className="text-center">
                  <span className={`fw-bold fs-6 ${est.ppa >= 14 ? 'text-success' : est.ppa >= 10.5 ? 'text-primary' : 'text-danger'}`}>
                    {Number(est.ppa || 0).toFixed(2)}
                  </span>
                </td>
                <td className="text-center">
                  {getBadgeDistincion(est.distincion)}
                </td>
              </tr>
            ))}
            {!loading && cuadroMerito.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  No hay estudiantes registrados con evaluaciones en el filtro seleccionado.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  Cargando cuadro de honor...
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </>
  )
}
