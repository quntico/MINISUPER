
import React from 'react';
import { Trash2, ShoppingCart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters.js';
import { usePosStore } from '@/store/posStore.jsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TicketSummary = ({ onOpenPayment }) => {
  const { 
    ticketItems, 
    subtotal, 
    tax, 
    total, 
    setQuantity, 
    applyDiscount, 
    removeItem, 
    clearTicket 
  } = usePosStore();

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg">Ticket Actual</h2>
        </div>
        <span className="text-sm font-medium text-muted-foreground bg-background px-2.5 py-1 rounded-md border border-border shadow-sm">
          {ticketItems.length} items
        </span>
      </div>
      
      {/* Table Area */}
      <div className="flex-1 overflow-y-auto min-h-[250px]">
        {ticketItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
            <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium text-lg">Ticket vacío</p>
            <p className="text-sm mt-1">Agrega productos para comenzar la venta</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead className="bg-muted/50 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-24">Cant.</th>
                  <th className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Producto</th>
                  <th className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right w-24">Precio</th>
                  <th className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right w-24">Desc.</th>
                  <th className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right w-28">Subtotal</th>
                  <th className="p-3 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {ticketItems.map(item => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
                    <td className="p-2">
                      <Input
                        type="number"
                        min="0"
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.id, e.target.value)}
                        className="w-16 h-9 text-center font-medium bg-background"
                      />
                    </td>
                    <td className="p-2">
                      <p className="font-medium text-sm line-clamp-2 leading-tight">{item.name}</p>
                    </td>
                    <td className="p-2 text-right text-sm text-muted-foreground">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="p-2 text-right">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.discount || ''}
                        onChange={(e) => applyDiscount(item.id, e.target.value)}
                        placeholder="0.00"
                        className="w-20 h-9 text-right text-sm bg-background ml-auto"
                      />
                    </td>
                    <td className="p-2 text-right font-bold text-primary">
                      {formatCurrency((item.quantity * item.price) - (item.discount || 0))}
                    </td>
                    <td className="p-2 text-center">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" 
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Totals & Actions */}
      <div className="mt-auto border-t border-border bg-card shrink-0">
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="h-14 font-bold text-base shadow-sm"
                disabled={ticketItems.length === 0}
              >
                VACIAR (F2)
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  ¿Vaciar ticket?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará todos los productos del ticket actual. No se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={clearTicket} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Sí, vaciar ticket
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button 
            className="h-14 font-bold text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
            disabled={ticketItems.length === 0}
            onClick={onOpenPayment}
          >
            COBRAR (F1)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketSummary;
