import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(pb.authStore.model);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Sincronizar el estado del usuario cuando cambie PocketBase
    return pb.authStore.onChange((token, model) => {
      setUser(model);
    });
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      toast.success('¡Bienvenido de nuevo!');
      return authData;
    } catch (error) {
      toast.error('Error al iniciar sesión: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data) => {
    setIsLoading(true);
    try {
      const user = await pb.collection('users').create({
        ...data,
        emailVisibility: true,
      });
      // Iniciar sesión automático tras registro opcionalmente o redirigir
      return user;
    } catch (error) {
      toast.error('Error al registrarse: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      register, 
      logout 
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
