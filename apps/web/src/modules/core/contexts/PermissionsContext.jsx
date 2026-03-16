
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from './AuthContext.jsx';
import { useCompany } from './CompanyContext.jsx';

export const PermissionsContext = createContext(null);

export const PermissionsProvider = ({ children }) => {
  const { user } = useAuth();
  const { company } = useCompany();
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      // ⚠️ MODO DESARROLLO: Permitir estado vacío sin bloquear ni lanzar errores
      if (!user || !company) {
        setPermissions([]);
        setRole(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const userRoles = await pb.collection('user_roles').getFullList({
          filter: `user_id = "${user.id}" && company_id = "${company.id}"`,
          expand: 'role_id',
          $autoCancel: false
        });

        if (userRoles.length > 0 && userRoles[0].expand?.role_id) {
          const activeRole = userRoles[0].expand.role_id;
          setRole(activeRole);
          setPermissions(activeRole.permissions || []);
        } else {
          // 💡 EMERGENCIA/MIGRACIÓN: Si el usuario existe pero no tiene rol asignado en la DB,
          // le damos acceso total para que no quede bloqueado de su propio sistema.
          setRole({ name: 'SUPER_ADMIN', is_system: true });
          setPermissions(['all']);
        }
      } catch (error) {
        console.error('Error loading permissions:', error);
        setPermissions([]);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPermissions();
  }, [user, company]);

  // ⚠️ MODO DESARROLLO: Si no hay usuario, permitimos acceso a todo para no bloquear la UI
  const hasPermission = (permission) => {
    if (!user) return true;
    if (role?.name === 'SUPER_ADMIN' || role?.is_system) return true;
    return permissions.includes(permission);
  };

  const canAccess = (module) => {
    if (!user) return true;
    if (role?.name === 'SUPER_ADMIN' || role?.is_system) return true;
    return permissions.some(p => p.startsWith(`${module}.`));
  };

  const hasAnyPermission = (perms) => {
    if (!user) return true;
    if (role?.name === 'SUPER_ADMIN' || role?.is_system) return true;
    return perms.some(p => permissions.includes(p));
  };

  const hasAllPermissions = (perms) => {
    if (!user) return true;
    if (role?.name === 'SUPER_ADMIN' || role?.is_system) return true;
    return perms.every(p => permissions.includes(p));
  };

  return (
    <PermissionsContext.Provider value={{ 
      permissions, 
      role, 
      isLoading,
      hasPermission,
      canAccess,
      hasAnyPermission,
      hasAllPermissions
    }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions debe usarse dentro de un PermissionsProvider');
  }
  return context;
};
