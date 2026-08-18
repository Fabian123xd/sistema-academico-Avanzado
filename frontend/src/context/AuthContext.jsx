import React, { createContext, useContext, useEffect, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sa_token')
    const savedUser = localStorage.getItem('sa_user')
    if (token && savedUser) {
      try { setUser(JSON.parse(savedUser)) } catch (e) { /* sesion corrupta, se ignora */ }
    }
    setLoading(false)
  }, [])

  const login = async (identificador, password) => {
    const data = await authService.login(identificador, password)
    const sessionUser = {
      id: data.usuarioId,
      nombre: data.nombreCompleto,
      email: data.email,
      codigo: data.codigo,
      rol: data.rol
    }
    localStorage.setItem('sa_token', data.token)
    localStorage.setItem('sa_user', JSON.stringify(sessionUser))
    setUser(sessionUser)
    return sessionUser
  }

  const logout = () => {
    localStorage.removeItem('sa_token')
    localStorage.removeItem('sa_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
