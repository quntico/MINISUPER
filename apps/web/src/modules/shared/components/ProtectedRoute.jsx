
// ⚠️ MODO DESARROLLO: Bypass de autenticación temporal
import React from 'react';

export const ProtectedRoute = ({ children }) => {
  // En modo desarrollo, simplemente renderizamos los hijos sin verificar autenticación
  // Esto permite trabajar en la UI sin necesidad de iniciar sesión
  return <>{children}</>;
};
