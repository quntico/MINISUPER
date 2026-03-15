
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/formatters.js';
import { usePosStore } from '@/store/posStore.jsx';
import { createSale, createSaleItems } from '@/services/salesService.js';
import { updateStock } from '@/services/inventoryService.js';
import { toast } from 'sonner';
import { Loader2, Banknote, CreditCard, Smartphone } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose }) => {
  const { getTicketData, clearTicket } = usePosStore();
  const { items, subtotal, tax, total, cashierName } = getTicketData();
  
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [received, setReceived] = useState('');
  const [reference, setReference] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReceived('');
      setReference('');
      setPaymentMethod('Efectivo');
    }
  }, [isOpen]);

  const receivedAmount = parseFloat(received) || 0;
  const change = Math.max(0, receivedAmount - total);
  const isValid = paymentMethod !== 'Efectivo' || receivedAmount >= total;

  const handleConfirm = async () => {
    if (!isValid) {
      toast.error('El monto recibido es insuficiente.');
      return;
    }

    setIsProcessing(true);
    try {
      const saleData = {
        subtotal,
        tax,
        total,
        payment_method: paymentMethod,
        cashier: cashierName,
        status: 'completed'
      };
      
      const saleId = await createSale(saleData);
      await createSaleItems(saleId, items);

      // Update inventory (negative quantity to deduct)
      const stockPromises = items.map(item => 
        updateStock(item.id, -item.quantity)
      );
      await Promise.all(stockPromises);

      toast.success(`Pago procesado. ${paymentMethod === 'Efectivo' ? `Cambio: ${formatCurrency(change)}` : ''}`);
      clearTicket();
      onClose();
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const quickAmounts = [50, 100, 200, 500, 1000];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-center">Procesar Pago</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="text-center space-y-1 bg-primary/5 py-4 rounded-xl border border-primary/10">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total a Pagar</p>
            <p className="text-5xl font-black text-primary">{formatCurrency(total)}</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-muted-foreground">Método de Pago</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={paymentMethod === 'Efectivo' ? 'default' : 'outline'}
                className="h-14 flex flex-col gap-1"
                onClick={() => setPaymentMethod('Efectivo')}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs">Efectivo</span>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === 'Tarjeta' ? 'default' : 'outline'}
                className="h-14 flex flex-col gap-1"
                onClick={() => { setPaymentMethod('Tarjeta'); setReceived(total.toString()); }}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Tarjeta</span>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === 'Transferencia' ? 'default' : 'outline'}
                className="h-14 flex flex-col gap-1"
                onClick={() => { setPaymentMethod('Transferencia'); setReceived(total.toString()); }}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs">Transfer</span>
              </Button>
            </div>
          </div>

          {paymentMethod === 'Efectivo' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-muted-foreground">Dinero Recibido</Label>
                <Input 
                  type="number" 
                  value={received}
                  onChange={(e) => setReceived(e.target.value)}
                  className="text-3xl h-14 font-bold text-right bg-background"
                  placeholder="0.00"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <Button variant="outline" size="sm" onClick={() => setReceived(total.toString())} className="whitespace-nowrap">Exacto</Button>
                {quickAmounts.filter(a => a >= total).map(amount => (
                  <Button key={amount} variant="outline" size="sm" onClick={() => setReceived(amount.toString())}>
                    ${amount}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-muted-foreground">Cambio</Label>
                <div className={`h-14 rounded-lg border flex items-center justify-end px-4 text-3xl font-bold ${change > 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-muted/50 border-border text-muted-foreground'}`}>
                  {formatCurrency(change)}
                </div>
              </div>
            </div>
          )}

          {paymentMethod !== 'Efectivo' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-muted-foreground">Referencia (Opcional)</Label>
                <Input 
                  type="text" 
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="h-12 bg-background"
                  placeholder={paymentMethod === 'Tarjeta' ? 'Últimos 4 dígitos' : 'Folio de transferencia'}
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 pt-0 grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-12 font-semibold"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button 
            className="h-12 font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleConfirm}
            disabled={!isValid || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Procesando...
              </>
            ) : (
              'Confirmar Pago'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
