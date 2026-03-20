import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('dsystem_token'))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dsystem_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (tokenValue, userData) => {
    setToken(tokenValue)
    setUser(userData)
    localStorage.setItem('dsystem_token', tokenValue)
    localStorage.setItem('dsystem_user', JSON.stringify(userData))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('dsystem_token')
    localStorage.removeItem('dsystem_user')
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
