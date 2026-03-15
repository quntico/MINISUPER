
import React from 'react';
import { Receipt } from 'lucide-react';

export default function SalesPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
        <Receipt className="w-10 h-10 text-purple-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Historial de Ventas</h1>
      <p className="text-gray-500 max-w-md mx-auto">
        El módulo de ventas está en construcción. Pronto podrás consultar el historial de tickets, devoluciones y cortes de caja.
      </p>
    </div>
  );
}
