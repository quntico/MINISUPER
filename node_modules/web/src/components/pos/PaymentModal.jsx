
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters.js';
import NumericKeypad from './NumericKeypad.jsx';

const PaymentModal = ({ isOpen, onClose, totalAmount, onConfirm }) => {
  const [received, setReceived] = useState('');
  const [change, setChange] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setReceived('');
      setChange(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const receivedAmount = parseFloat(received) || 0;
    setChange(Math.max(0, receivedAmount - totalAmount));
  }, [received, totalAmount]);

  const handleInput = (val) => {
    if (val === 'Backspace') {
      setReceived(prev => prev.slice(0, -1));
    } else {
      setReceived(prev => prev + val);
    }
  };

  const handleConfirm = () => {
    const receivedAmount = parseFloat(received) || 0;
    if (receivedAmount >= totalAmount) {
      onConfirm({ received: receivedAmount, change });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">COBRO DE VENTA</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground font-medium">Total a Pagar</p>
            <p className="text-5xl font-black text-primary">{formatCurrency(totalAmount)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Efectivo Recibido</label>
              <Input 
                type="text" 
                value={received}
                readOnly
                className="text-3xl h-14 font-bold text-right mt-1 bg-background"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Cambio</label>
              <div className="h-14 rounded-md border border-border bg-muted/50 flex items-center justify-end px-3 text-3xl font-bold text-foreground mt-1">
                {formatCurrency(change)}
              </div>
            </div>
          </div>

          <NumericKeypad 
            onInput={handleInput} 
            onSubmit={handleConfirm} 
            onCancel={onClose} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
