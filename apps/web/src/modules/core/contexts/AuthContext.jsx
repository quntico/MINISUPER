
// ⚠️ MODO DESARROLLO: Autenticación deshabilitada temporalmente
import React, { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Mock methods that return null/undefined and log warnings
  const mockMethod = (methodName) => async (...args) => {
    console.warn(`⚠️ MODO DESARROLLO: El método de autenticación '${methodName}' está deshabilitado temporalmente.`);
    return null;
  };

  return (
    <AuthContext.Provider value={{ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false, 
      error: null,
      login: mockMethod('login'), 
      register: mockMethod('register'), 
      logout: mockMethod('logout'),
      changePassword: mockMethod('changePassword'),
      forgotPassword: mockMethod('forgotPassword')
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
