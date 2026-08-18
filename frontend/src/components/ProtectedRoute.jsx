import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** Protege rutas por autenticacion y, opcionalmente, por rol permitido. */
export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
