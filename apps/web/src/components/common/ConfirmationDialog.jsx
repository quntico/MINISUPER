
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/common/Button.jsx';

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = 'Confirmar', 
  cancelLabel = 'Cancelar',
  confirmVariant = 'primary'
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} onClick={() => {
            onConfirm();
            onClose();
          }}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
