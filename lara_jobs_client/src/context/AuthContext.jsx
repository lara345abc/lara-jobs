import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user information (e.g., role, auth token)
  const [loading, setLoading] = useState(true);

  // Simulating an API call to fetch user authentication state
  useEffect(() => {
    // Read the role and token from localStorage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      setUser({
        token,
        role
      });
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    // Store token and role separately in localStorage
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    
    // Update user state
    setUser(userData);
  };

  const logout = () => {
    // Remove token and role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // Clear user state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
