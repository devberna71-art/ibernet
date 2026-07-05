import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/usuario/status');
      const usuarioData = response.data.usuario;
      if (usuarioData && usuarioData.funcao) {
        setUser(usuarioData);
        setRole(usuarioData.funcao);
      } else {
        setUser(null);
        setRole(null);
      }
    } catch {
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  const login = useCallback(async (token, userData) => {
    localStorage.setItem('token', token);
    if (userData) {
      localStorage.setItem('usuario', JSON.stringify(userData));
      setUser(userData);
      setRole(userData.funcao);
    }
    await verifyAuth();
  }, [verifyAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUser(null);
    setRole(null);
  }, []);

  const isAdmin = role !== 'usuario' && role !== null;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, role, loading, isAuthenticated, isAdmin, login, logout, verifyAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}