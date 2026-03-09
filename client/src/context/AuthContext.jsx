import React, { createContext, useState, useEffect } from 'react';

// 1. Create the Context
export const AuthContext = createContext();

// 2. Create the Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        // Attempt to safely parse the data
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // IF IT FAILS: Don't crash! Just clear the corrupted data.
        console.error("Corrupt data found in local storage. Clearing session.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (token, userData) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  setUser(userData);
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser,
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};