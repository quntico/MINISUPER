
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useCompany } from '../../core/contexts/CompanyContext';

export const LimitWarning = ({ type, current, max }) => {
  const { currentCompany } = useCompany();
  
  if (!currentCompany || !max) return null;

  const percentage = (current / max) * 100;
  
  if (percentage < 90) return null;

  return (
    <Alert variant="warning" className="mb-4 bg-warning/10 text-warning-foreground border-warning/20">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Approaching Limit</AlertTitle>
      <AlertDescription>
        You have used {current} of your {max} {type} limit. Please upgrade your plan to increase this limit.
      </AlertDescription>
    </Alert>
  );
};
