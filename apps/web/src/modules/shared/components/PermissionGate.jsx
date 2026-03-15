
import React from 'react';
import { usePermissions } from '../../core/contexts/PermissionsContext.jsx';

export const PermissionGate = ({ permission, children, fallback = null }) => {
  const { hasPermission, isLoading } = usePermissions();

  if (isLoading) return null;

  if (!hasPermission(permission)) {
    return fallback;
  }

  return <>{children}</>;
};
