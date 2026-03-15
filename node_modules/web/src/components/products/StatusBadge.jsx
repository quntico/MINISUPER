
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const StatusBadge = ({ status, className }) => {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'activo':
        return 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20';
      case 'inactivo':
        return 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/20';
      case 'descontinuado':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Badge variant="outline" className={cn("font-medium", getStatusStyles(status), className)}>
      {status || 'Desconocido'}
    </Badge>
  );
};

export default StatusBadge;
