
import React from 'react';
import { Plus, PackageX } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters.js';
import { usePosStore } from '@/store/posStore.jsx';
import { cn } from '@/lib/utils';

const ProductGrid = ({ products, isLoading }) => {
  const { addItem, ticketItems } = usePosStore();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="h-36 animate-pulse bg-muted/50 border-border/50" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-card/50 rounded-2xl border border-dashed border-border">
        <PackageX className="w-12 h-12 mb-3 opacity-20" />
        <p className="text-lg font-medium">No se encontraron productos</p>
        <p className="text-sm mt-1">Intenta con otra categoría o búsqueda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map(product => {
        const isOutOfStock = product.stock <= 0;
        const isLowStock = product.stock > 0 && product.stock <= 5;
        const ticketItem = ticketItems.find(item => item.id === product.id);
        const qtyInTicket = ticketItem ? ticketItem.quantity : 0;

        return (
          <Card 
            key={product.id} 
            className={cn(
              "relative p-4 flex flex-col justify-between h-36 transition-all duration-200 select-none",
              isOutOfStock 
                ? "opacity-60 grayscale cursor-not-allowed bg-muted/30" 
                : "cursor-pointer hover:border-primary hover:shadow-md bg-card active:scale-[0.98]"
            )}
            onClick={() => !isOutOfStock && addItem(product)}
          >
            {/* Quantity Badge */}
            {qtyInTicket > 0 && (
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10 animate-in zoom-in">
                {qtyInTicket}
              </div>
            )}

            <div>
              <div className="flex justify-between items-start gap-2 mb-1">
                <p className="font-semibold text-sm line-clamp-2 leading-tight text-foreground">
                  {product.name}
                </p>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
            </div>

            <div className="flex justify-between items-end mt-2">
              <div>
                <p className="font-bold text-lg text-primary">{formatCurrency(product.price)}</p>
                <div className="mt-1">
                  {isOutOfStock ? (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">Agotado</Badge>
                  ) : isLowStock ? (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-amber-500 text-amber-600 bg-amber-500/10">Bajo stock: {product.stock}</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-emerald-500 text-emerald-600 bg-emerald-500/10">En stock: {product.stock}</Badge>
                  )}
                </div>
              </div>
              
              {!isOutOfStock && (
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="h-9 w-9 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(product);
                  }}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductGrid;
