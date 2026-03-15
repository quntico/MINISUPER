
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters.js';

const PriceChangeModal = ({ isOpen, onClose, onConfirm, originalPrice }) => {
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewPrice(originalPrice?.toString() || '');
    }
  }, [isOpen, originalPrice]);

  const handleConfirm = () => {
    const val = parseFloat(newPrice);
    if (!isNaN(val) && val >= 0) {
      onConfirm(val);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar Precio</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="text-sm text-muted-foreground">
            Precio Original: <span className="font-bold text-foreground">{formatCurrency(originalPrice || 0)}</span>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Nuevo Precio</label>
            <Input 
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="0.00"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm}>Cambiar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceChangeModal;
