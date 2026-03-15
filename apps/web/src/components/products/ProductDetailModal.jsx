
import React from 'react';
import { Package, Tag, Barcode, DollarSign, Percent, Building2, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StatusBadge from './StatusBadge.jsx';
import { formatCurrency } from '@/utils/formatters.js';

const ProductDetailModal = ({ isOpen, onClose, product, onEdit, onDelete }) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-card">
        <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
          {/* Left side - Image */}
          <div className="w-full md:w-2/5 bg-muted/30 flex flex-col">
            <div className="aspect-square w-full relative bg-white">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Package className="w-16 h-16 opacity-20" />
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col justify-end gap-3 bg-card border-t border-border md:border-t-0 md:border-r">
              <Button 
                className="w-full gap-2" 
                onClick={() => { onClose(); onEdit(product); }}
              >
                <Edit className="w-4 h-4" /> Editar Producto
              </Button>
              <Button 
                variant="destructive" 
                className="w-full gap-2" 
                onClick={() => { onClose(); onDelete(product); }}
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </Button>
            </div>
          </div>

          {/* Right side - Details */}
          <div className="w-full md:w-3/5 flex flex-col overflow-y-auto">
            <DialogHeader className="p-6 pb-4 sticky top-0 bg-card/95 backdrop-blur z-10 border-b border-border">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <DialogTitle className="text-2xl font-bold leading-tight">{product.name}</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">{product.description || 'Sin descripción'}</p>
                </div>
                <StatusBadge status={product.status} />
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Precio de Venta</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(product.price)}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Existencia</p>
                  <p className={`text-2xl font-bold ${product.stock <= 5 ? 'text-destructive' : 'text-foreground'}`}>
                    {product.stock} <span className="text-sm font-normal text-muted-foreground">uds</span>
                  </p>
                </div>
              </div>

              <Separator />

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <DetailItem icon={Tag} label="SKU" value={product.sku} />
                <DetailItem icon={Barcode} label="Código de Barras" value={product.barcode || '-'} />
                <DetailItem icon={Package} label="Categoría" value={product.category} />
                <DetailItem icon={Building2} label="Proveedor" value={product.provider || '-'} />
                <DetailItem icon={DollarSign} label="Costo" value={formatCurrency(product.cost)} />
                <DetailItem icon={Percent} label="Impuesto" value={`${product.tax}%`} />
              </div>

              <Separator />

              {/* Margins */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Análisis de Margen</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Utilidad Bruta:</span>
                  <span className="font-medium text-emerald-500">
                    {formatCurrency(product.price - product.cost)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Margen (%):</span>
                  <span className="font-medium">
                    {product.price > 0 ? Math.round(((product.price - product.cost) / product.price) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-muted rounded-lg text-muted-foreground shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
    </div>
  </div>
);

export default ProductDetailModal;
