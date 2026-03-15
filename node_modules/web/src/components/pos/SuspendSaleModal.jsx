
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SuspendSaleModal = ({ isOpen, onClose, onConfirm }) => {
  const [reference, setReference] = useState('');

  const handleConfirm = () => {
    if (reference.trim()) {
      onConfirm(reference);
      setReference('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suspender Venta</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Nombre o Referencia</label>
          <Input 
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Ej. Cliente esperando..."
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="bg-warning hover:bg-warning/90 text-warning-foreground" onClick={handleConfirm}>
            Suspender
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendSaleModal;
