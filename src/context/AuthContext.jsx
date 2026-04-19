import { createContext, useContext, useState } from "react";
import {login as apiLogin} from '../api'

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('auth_token'))
  
    async function login(email, password) {
      const data = await apiLogin(email, password)
      const t = data.access_token
      localStorage.setItem('auth_token', t)
      setToken(t)
      return data
    }
  
    function logout() {
      localStorage.removeItem('auth_token')
      setToken(null)
    }
  
    const isAuthenticated = !!token
  
    return (
      <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
        {children}
      </AuthContext.Provider>
    )
}
  
export function useAuth() {
    return useContext(AuthContext)
}