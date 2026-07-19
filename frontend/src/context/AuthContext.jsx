import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('voicescribe_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('voicescribe_token')
    if (!token) return

    api.get('/auth/me')
      .then(({ data }) => {
        setUser(data.user)
        localStorage.setItem('voicescribe_user', JSON.stringify(data.user))
      })
      .catch(() => {
        localStorage.removeItem('voicescribe_token')
        localStorage.removeItem('voicescribe_user')
        setUser(null)
      })
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('voicescribe_token', data.token)
      localStorage.setItem('voicescribe_user', JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('voicescribe_token')
    localStorage.removeItem('voicescribe_user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, logout, loading, isAuthenticated: Boolean(user) }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
