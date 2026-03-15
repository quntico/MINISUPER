
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50/50">
      <Loader2 className="w-10 h-10 animate-spin text-green-600 mb-4" />
      <p className="text-gray-600 font-medium animate-pulse">Cargando...</p>
    </div>
  );
};
