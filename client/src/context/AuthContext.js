import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          axios.defaults.headers.common['x-auth-token'] = token;
          const res = await axios.get('http://localhost:5000/api/auth/verify');
          setUser(res.data.user);
        } catch (error) {
          console.error('Token validation error:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['x-auth-token'];
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Login payload:', { username, password });
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      setUser(res.data.user);
      return true;
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  const register = async (username, password) => {
    try {
      console.log('Register payload:', { username, password });
      const res = await axios.post('http://localhost:5000/api/auth/register', { username, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      setUser(res.data.user);
      return true;
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};