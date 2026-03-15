
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const DiscountModal = ({ isOpen, onClose, onConfirm }) => {
  const [type, setType] = useState('percent');
  const [amount, setAmount] = useState('');

  const handleConfirm = () => {
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      onConfirm({ type, value: val });
      setAmount('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aplicar Descuento</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <RadioGroup defaultValue="percent" value={type} onValueChange={setType} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percent" id="r1" />
              <Label htmlFor="r1">% Porcentaje</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="amount" id="r2" />
              <Label htmlFor="r2">$ Monto Fijo</Label>
            </div>
          </RadioGroup>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Cantidad</label>
            <Input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm}>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountModal;
