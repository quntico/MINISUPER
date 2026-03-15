
import React, { useState, useRef, useEffect } from 'react';
import { Search, Barcode } from 'lucide-react';
import { cn } from '@/lib/utils';

const BarcodeInput = ({ onAddProduct }) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus on mount and keep focus
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    const handleGlobalClick = () => {
      // Re-focus if clicking outside doesn't hit another input
      if (document.activeElement?.tagName !== 'INPUT' && inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onAddProduct(inputValue.trim());
      setInputValue('');
    } else if (e.key === 'Escape') {
      setInputValue('');
    }
  };

  return (
    <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
      <label htmlFor="barcode-input" className="text-lg font-semibold whitespace-nowrap">
        Código del Producto:
      </label>
      <div className="relative flex-1">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Barcode className={cn("w-6 h-6 transition-colors", isFocused && "text-primary")} />
        </div>
        <input
          ref={inputRef}
          id="barcode-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Escanea o escribe el código y presiona ENTER..."
          className={cn(
            "w-full h-14 pl-12 pr-4 text-xl font-medium rounded-lg bg-background border-2 transition-colors outline-none",
            isFocused ? "border-primary ring-4 ring-primary/20" : "border-input",
            "placeholder:text-muted-foreground/50 placeholder:font-normal"
          )}
          autoComplete="off"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default BarcodeInput;
