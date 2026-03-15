
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from './Button.jsx';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children,
  footer,
  size = 'default'
}) => {
  const sizes = {
    sm: 'max-w-md',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={sizes[size]}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className="py-4">
          {children}
        </div>
        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
