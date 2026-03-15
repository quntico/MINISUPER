
import React, { useState, useEffect } from 'react';
import { calculateSubtotal, calculateTotal } from '@/utils/cartUtils.js';
import { formatCurrency } from '@/utils/formatters.js';
import { cn } from '@/lib/utils';

const PaymentSummary = ({ items, onCheckout }) => {
  const [pagoCon, setPagoCon] = useState('');
  
  const total = calculateTotal(items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const pagoAmount = parseFloat(pagoCon) || 0;
  const cambio = Math.max(0, pagoAmount - total);
  const isPaid = pagoAmount >= total && total > 0;

  // Reset pagoCon when items change significantly (e.g. cleared)
  useEffect(() => {
    if (items.length === 0) {
      setPagoCon('');
    }
  }, [items.length]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    onCheckout({ 
      paymentMethod: 'cash', 
      total, 
      pagoCon: pagoAmount, 
      cambio 
    });
    setPagoCon('');
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-6 shadow-lg">
      {/* Left Side: Totals & Payment */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div className="flex justify-between items-end">
          <div className="text-muted-foreground font-medium">
            Productos en la venta actual: <span className="text-foreground font-bold text-lg ml-2">{itemCount}</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground font-medium mb-1">Total a Pagar:</div>
            <div className="text-5xl font-black text-primary tracking-tight">
              {formatCurrency(total)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 bg-background p-4 rounded-lg border border-border/50">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Pagó Con:</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">$</span>
              <input
                type="number"
                min="0"
                step="any"
                value={pagoCon}
                onChange={(e) => setPagoCon(e.target.value)}
                className="w-full h-12 pl-8 pr-4 text-2xl font-bold bg-card border-2 border-input rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Cambio:</label>
            <div className={cn(
              "h-12 flex items-center px-4 text-2xl font-bold rounded-md border-2 border-transparent bg-muted/30",
              cambio > 0 ? "text-emerald-400" : "text-muted-foreground"
            )}>
              {formatCurrency(cambio)}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Actions */}
      <div className="w-full md:w-80 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <button className="f-key-btn py-3">
            <span className="text-primary font-bold">F5</span>
            <span>Cambiar</span>
          </button>
          <button className="f-key-btn py-3">
            <span className="text-primary font-bold">F6</span>
            <span>Pendiente</span>
          </button>
          <button className="f-key-btn py-3">
            <span className="text-primary font-bold">F7</span>
            <span>Eliminar</span>
          </button>
          <button className="f-key-btn py-3">
            <span className="text-primary font-bold">F9</span>
            <span>Asignar Cliente</span>
          </button>
        </div>

        <button
          onClick={handleCheckout}
          disabled={items.length === 0}
          className={cn(
            "flex-1 flex flex-col items-center justify-center rounded-lg border-b-4 transition-all active:border-b-0 active:translate-y-1 min-h-[80px]",
            items.length > 0 
              ? "bg-primary border-primary-active text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/20" 
              : "bg-muted border-muted-foreground/30 text-muted-foreground cursor-not-allowed"
          )}
        >
          <span className="text-xl font-black tracking-wider">F12 - COBRAR</span>
          {items.length > 0 && !isPaid && pagoAmount > 0 && (
            <span className="text-xs font-medium opacity-80 mt-1">Falta {formatCurrency(total - pagoAmount)}</span>
          )}
        </button>

        <div className="flex justify-between text-xs text-primary hover:text-primary-hover mt-1">
          <button className="hover:underline">Reimprimir Último Ticket</button>
          <button className="hover:underline">Ventas del día</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
