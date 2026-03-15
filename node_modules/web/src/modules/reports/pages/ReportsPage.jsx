
import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
        <BarChart3 className="w-10 h-10 text-indigo-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportes</h1>
      <p className="text-gray-500 max-w-md mx-auto">
        El módulo de reportes está en construcción. Pronto tendrás acceso a métricas detalladas y análisis de tu negocio.
      </p>
    </div>
  );
}
