
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FunctionKeyBar = ({ onFunctionKeyPress }) => {
  const keys = [
    { key: 'F1', label: 'Cobrar', color: 'bg-primary hover:bg-primary-hover text-primary-foreground', active: true },
    { key: 'F2', label: 'Cancelar Venta', color: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground', active: true },
    { key: 'F3', label: 'Suspender (Próx)', color: 'bg-muted text-muted-foreground opacity-50', active: false },
    { key: 'F4', label: 'Recuperar (Próx)', color: 'bg-muted text-muted-foreground opacity-50', active: false },
    { key: 'F5', label: 'Reimprimir (Próx)', color: 'bg-muted text-muted-foreground opacity-50', active: false },
    { key: 'F6', label: 'Cliente (Próx)', color: 'bg-muted text-muted-foreground opacity-50', active: false },
    { key: 'F7', label: 'Manual (Próx)', color: 'bg-muted text-muted-foreground opacity-50', active: false },
    { key: 'F8', label: 'Cantidad (Próx)', color: 'bg-muted text-muted-foreground opacity-50', active: false },
    { key: 'F9', label: 'Descuento (Próx)', color: 'bg-muted text-muted-foreground opacity-50', active: false },
    { key: 'F10', label: 'Precio (Próx)', color: 'bg-muted text-muted-foreground opacity-50', active: false },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.startsWith('F') && parseInt(e.key.substring(1)) >= 1 && parseInt(e.key.substring(1)) <= 10) {
        e.preventDefault(); // Prevent default browser behavior for F keys
        const keyObj = keys.find(k => k.key === e.key);
        if (keyObj && keyObj.active) {
          onFunctionKeyPress(e.key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFunctionKeyPress, keys]);

  return (
    <div className="grid grid-cols-5 md:grid-cols-10 gap-2 p-2 bg-card border-t border-border rounded-xl shadow-sm">
      {keys.map((k) => (
        <Button
          key={k.key}
          variant="custom"
          disabled={!k.active}
          className={cn(
            "h-14 flex flex-col items-center justify-center p-1 rounded-lg shadow-sm transition-all",
            k.active ? "active:scale-95 cursor-pointer" : "cursor-not-allowed",
            k.color
          )}
          onClick={() => k.active && onFunctionKeyPress(k.key)}
        >
          <span className="font-bold text-sm">{k.key}</span>
          <span className="text-[10px] leading-tight text-center truncate w-full px-1">{k.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default FunctionKeyBar;
