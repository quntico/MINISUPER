
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

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, product }) => {
  if (!product) return null;

  const hasStock = product.stock > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription className="pt-2">
            ¿Estás seguro de que deseas eliminar el producto <strong>{product.name}</strong> (SKU: {product.sku})?
          </DialogDescription>
        </DialogHeader>

        {hasStock && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mt-2">
            <p className="text-sm text-warning-foreground font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Advertencia: Este producto aún tiene {product.stock} unidades en existencia.
            </p>
          </div>
        )}

        <p className="text-sm text-muted-foreground mt-2">
          Esta acción no se puede deshacer. Los registros históricos de ventas se mantendrán, pero el producto ya no estará disponible para nuevas operaciones.
        </p>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => onConfirm(product.id)}>
            Eliminar Producto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
