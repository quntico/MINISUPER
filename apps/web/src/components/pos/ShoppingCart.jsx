
import React, { useState, useRef, useEffect } from 'react';
import { Trash2, ShoppingCart as CartIcon, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters.js';
import { usePOS } from '@/hooks/usePOSStore.jsx';

const ShoppingCart = ({ onOpenPayment }) => {
  const { currentTicket, updateQuantity, removeProductFromTicket, calculateTotals, clearTicket } = usePOS();
  const { subtotal, tax, total } = calculateTotals();
  
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const handleEditStart = (item) => {
    setEditingId(item.id);
    setEditValue(item.quantity.toString());
  };

  const handleEditConfirm = (id) => {
    const newQty = parseFloat(editValue);
    if (!isNaN(newQty) && newQty >= 0) {
      updateQuantity(id, newQty);
    }
    setEditingId(null);
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleEditConfirm(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CartIcon className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg">Ticket Actual</h2>
        </div>
        <span className="text-sm font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border border-border">
          {currentTicket.length} items
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/50 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-28">Cant.</th>
              <th className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Producto</th>
              <th className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Precio</th>
              <th className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Subtotal</th>
              <th className="p-3 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {currentTicket.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-muted-foreground">
                  <CartIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No hay productos en el ticket</p>
                  <p className="text-xs mt-1">Escanea o selecciona un producto</p>
                </td>
              </tr>
            ) : (
              currentTicket.map(item => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
                  <td className="p-3">
                    {editingId === item.id ? (
                      <input
                        ref={editInputRef}
                        type="number"
                        min="0"
                        step="any"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleEditConfirm(item.id)}
                        onKeyDown={(e) => handleEditKeyDown(e, item.id)}
                        className="w-16 text-center bg-background border-2 border-primary rounded px-1 py-1 outline-none text-sm font-medium"
                      />
                    ) : (
                      <div className="flex items-center gap-1 bg-background rounded-md border border-border p-0.5 w-fit">
                        <Button size="icon" variant="ghost" className="h-6 w-6 rounded-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span 
                          className="w-8 text-center font-medium text-sm cursor-pointer hover:text-primary"
                          onClick={() => handleEditStart(item)}
                        >
                          {item.quantity}
                        </span>
                        <Button size="icon" variant="ghost" className="h-6 w-6 rounded-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                    {item.discount > 0 && (
                      <p className="text-xs text-destructive">Desc: -{formatCurrency(item.discount)}</p>
                    )}
                  </td>
                  <td className="p-3 text-right text-sm text-muted-foreground">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="p-3 text-right font-bold text-primary">
                    {formatCurrency(item.lineTotal)}
                  </td>
                  <td className="p-3 text-center">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all" 
                      onClick={() => removeProductFromTicket(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-auto border-t border-border bg-card">
        <div className="p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">IVA (16%)</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
        </div>
        <div className="p-6 bg-primary/5 flex flex-col items-center justify-center border-y border-border/50">
          <p className="text-sm text-muted-foreground font-medium mb-1 uppercase tracking-wider">Total a Pagar</p>
          <p className="text-5xl font-black text-primary tracking-tight">{formatCurrency(total)}</p>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3 bg-muted/20">
          <Button 
            variant="destructive" 
            className="h-14 font-bold text-base shadow-sm"
            disabled={currentTicket.length === 0}
            onClick={clearTicket}
          >
            CANCELAR (F2)
          </Button>
          <Button 
            className="h-14 font-bold text-base bg-primary hover:bg-primary-hover text-primary-foreground shadow-md"
            disabled={currentTicket.length === 0}
            onClick={onOpenPayment}
          >
            COBRAR (F1)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
