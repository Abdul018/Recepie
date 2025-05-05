// contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);   // NEW

  /* ────────────────────────────────────────────────
     ❶  On first mount: pull any saved tokens
     ──────────────────────────────────────────────── */
  useEffect(() => {
    const access  = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');

    if (access && refresh) setUser({ access, refresh });
    setLoading(false);          // ◀︎ mark boot-strap complete
  }, []);

  /* ────────────────────────────────────────────────
     ❷  Auth helpers (save + clear localStorage)
     ──────────────────────────────────────────────── */
  const login = async (username, password) => {
    const { data } = await apiLogin(username, password);      // { access, refresh }
    const { access, refresh } = data;

    localStorage.setItem('accessToken',  access);
    localStorage.setItem('refreshToken', refresh);
    setUser({ access, refresh });
  };

  const signup = async (username, email, password) => {
    const { data } = await apiSignup(username, email, password);  // { access, refresh }
    const { access, refresh } = data;

    localStorage.setItem('accessToken',  access);
    localStorage.setItem('refreshToken', refresh);
    setUser({ access, refresh });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
