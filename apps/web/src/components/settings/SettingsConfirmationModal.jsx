
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SettingsConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Acción", 
  message = "¿Estás seguro de que deseas realizar esta acción?",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "destructive"
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${variant === 'destructive' ? 'text-destructive' : 'text-primary'}`}>
            <AlertTriangle className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button 
            variant={variant === 'destructive' ? 'destructive' : 'default'} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={variant !== 'destructive' ? 'bg-primary hover:bg-primary-hover text-primary-foreground' : ''}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsConfirmationModal;
