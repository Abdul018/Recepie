import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  console.log('AuthProvider render, user =', user);
  useEffect(() => {
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    if (access && refresh) {
      setUser({ access, refresh });
    }
  }, []);

  const login = async (username, password) => {
    const { data } = await apiLogin(username, password);
    const { access, refresh } = data;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    setUser({ access, refresh });
  };

  const signup = async (username, email, password) => {
    const { data } = await apiSignup(username, email, password);
    const { access, refresh } = data.token;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    setUser({ access, refresh });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
