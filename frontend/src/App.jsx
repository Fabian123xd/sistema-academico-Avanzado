import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { FiHome, FiUsers, FiBookOpen, FiClipboard, FiBarChart2, FiClock, FiFileText, FiCheckSquare } from 'react-icons/fi'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './components/LandingPage'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'

import AdminHome       from './pages/admin/AdminHome'
import AdminUsuarios   from './pages/admin/AdminUsuarios'
import AdminCursos     from './pages/admin/AdminCursos'
import AdminMatriculas from './pages/admin/AdminMatriculas'

import DocenteHome   from './pages/docente/DocenteHome'
import DocenteCurso  from './pages/docente/DocenteCurso'

import EstudianteHome        from './pages/estudiante/EstudianteHome'
import EstudianteHorario     from './pages/estudiante/EstudianteHorario'
import EstudianteNotas       from './pages/estudiante/EstudianteNotas'
import EstudianteEvaluaciones from './pages/estudiante/EstudianteEvaluaciones'
import EstudianteHistorial   from './pages/estudiante/EstudianteHistorial'

/* ── Menús de navegación lateral por rol ───────────────────── */
const MENU_ADMIN = [
  { to: '/admin',            label: 'Dashboard',       icon: FiHome     },
  { to: '/admin/usuarios',   label: 'Usuarios',        icon: FiUsers    },
  { to: '/admin/cursos',     label: 'Cursos y periodos', icon: FiBookOpen },
  { to: '/admin/matriculas', label: 'Matrículas',      icon: FiClipboard },
]

const MENU_DOCENTE = [
  { to: '/docente', label: 'Mis cursos', icon: FiHome },
]

const MENU_ESTUDIANTE = [
  { to: '/estudiante',              label: 'Dashboard',         icon: FiHome        },
  { to: '/estudiante/horario',      label: 'Horario',           icon: FiClock       },
  { to: '/estudiante/notas',        label: 'Notas',             icon: FiBarChart2   },
  { to: '/estudiante/evaluaciones', label: 'Tareas y exámenes', icon: FiFileText    },
  { to: '/estudiante/historial',    label: 'Historial',         icon: FiCheckSquare },
]

/* ── Ruta raíz: muestra landing page pública ────────────────── */
function RutaRaiz() {
  const { user, loading } = useAuth()
  // Mientras carga la sesión, no redirigir
  if (loading) return null
  // Si ya hay sesión activa, ir directo al panel correspondiente
  if (user) {
    const destino = { ADMINISTRADOR: '/admin', DOCENTE: '/docente', ESTUDIANTE: '/estudiante' }[user.rol] || '/admin'
    return <Navigate to={destino} replace />
  }
  // Sin sesión → página principal pública
  return <LandingPage />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Página principal pública */}
          <Route path="/" element={<RutaRaiz />} />

          {/* Rutas protegidas — Administrador */}
          <Route element={<ProtectedRoute allowedRoles={['ADMINISTRADOR']} />}>
            <Route element={<AppLayout title="Administración — AcademiaPro" menuItems={MENU_ADMIN} />}>
              <Route path="/admin"            element={<AdminHome />} />
              <Route path="/admin/usuarios"   element={<AdminUsuarios />} />
              <Route path="/admin/cursos"     element={<AdminCursos />} />
              <Route path="/admin/matriculas" element={<AdminMatriculas />} />
            </Route>
          </Route>

          {/* Rutas protegidas — Docente */}
          <Route element={<ProtectedRoute allowedRoles={['DOCENTE']} />}>
            <Route element={<AppLayout title="Mis cursos — AcademiaPro" menuItems={MENU_DOCENTE} />}>
              <Route path="/docente"              element={<DocenteHome />} />
              <Route path="/docente/cursos/:id"   element={<DocenteCurso />} />
            </Route>
          </Route>

          {/* Rutas protegidas — Estudiante */}
          <Route element={<ProtectedRoute allowedRoles={['ESTUDIANTE']} />}>
            <Route element={<AppLayout title="Portal Estudiantil — AcademiaPro" menuItems={MENU_ESTUDIANTE} />}>
              <Route path="/estudiante"                element={<EstudianteHome />} />
              <Route path="/estudiante/horario"        element={<EstudianteHorario />} />
              <Route path="/estudiante/notas"          element={<EstudianteNotas />} />
              <Route path="/estudiante/evaluaciones"   element={<EstudianteEvaluaciones />} />
              <Route path="/estudiante/historial"      element={<EstudianteHistorial />} />
            </Route>
          </Route>

          {/* Cualquier otra ruta → página principal */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
