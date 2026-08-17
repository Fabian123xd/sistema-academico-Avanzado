import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Alumnos from './components/Alumnos'
import Cursos from './components/Cursos'
import Notas from './components/Notas'
import Horarios from './components/Horarios'

export default function App(){
  const [view, setView] = useState('dashboard')
  return (
    <Container fluid className="p-4">
      <Header />
      <div className="container-main">
        <h1 className="mb-4">Sistema Académico</h1>
        <Layout view={view} onChange={setView}>
        {view==='dashboard' && <Dashboard onNavigate={setView} />}
        {view==='alumnos' && <Alumnos />}
        {view==='cursos' && <Cursos />}
        {view==='notas' && <Notas />}
        {view==='horarios' && <Horarios />}
        </Layout>
      </div>
      <Footer />
    </Container>
  )
}
