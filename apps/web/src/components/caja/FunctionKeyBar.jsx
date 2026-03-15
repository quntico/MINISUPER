
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const FunctionKeyBar = ({ onF1, onF2 }) => {
  const keys = [
    { key: 'F1', label: 'Cobrar', action: onF1, active: true, color: 'bg-primary text-primary-foreground hover:bg-primary/90' },
    { key: 'F2', label: 'Vaciar', action: onF2, active: true, color: 'bg-destructive text-destructive-foreground hover:bg-destructive/90' },
    { key: 'F3', label: 'Cliente', active: false },
    { key: 'F4', label: 'Descuento', active: false },
    { key: 'F5', label: 'Precio', active: false },
    { key: 'F6', label: 'Cantidad', active: false },
    { key: 'F7', label: 'Buscar', active: false },
    { key: 'F8', label: 'Cajón', active: false },
    { key: 'F9', label: 'Corte', active: false },
    { key: 'F10', label: 'Salir', active: false },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.startsWith('F') && parseInt(e.key.substring(1)) >= 1 && parseInt(e.key.substring(1)) <= 10) {
        e.preventDefault();
        const keyObj = keys.find(k => k.key === e.key);
        if (keyObj && keyObj.active && keyObj.action) {
          keyObj.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys]);

  return (
    <TooltipProvider>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 p-2 bg-card border-t border-border rounded-xl shadow-sm">
        {keys.map((k) => (
          <Tooltip key={k.key}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                disabled={!k.active}
                className={cn(
                  "h-14 flex flex-col items-center justify-center p-1 rounded-lg shadow-sm transition-all",
                  k.active ? "active:scale-95 cursor-pointer" : "cursor-not-allowed opacity-50 bg-muted",
                  k.color
                )}
                onClick={() => k.active && k.action && k.action()}
              >
                <span className="font-bold text-sm">{k.key}</span>
                <span className="text-[10px] leading-tight text-center truncate w-full px-1">{k.label}</span>
              </Button>
            </TooltipTrigger>
            {!k.active && (
              <TooltipContent>
                <p>Función futura</p>
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default FunctionKeyBar;
