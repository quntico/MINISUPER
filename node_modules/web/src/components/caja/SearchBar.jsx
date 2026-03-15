
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePosStore } from '@/store/posStore.jsx';
import { searchProducts } from '@/services/productService.js';
import { formatCurrency } from '@/utils/formatters.js';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { addItem } = usePosStore();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Barcode scanner detection
  useEffect(() => {
    let barcodeString = '';
    let lastKeyTime = Date.now();

    const handleGlobalKeyDown = async (e) => {
      // Ignore if typing in an input field (unless it's our search input)
      if (e.target.tagName === 'INPUT' && e.target !== inputRef.current) return;

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 100) {
        barcodeString = '';
      }

      if (e.key === 'Enter' && barcodeString.length > 3) {
        e.preventDefault();
        try {
          const products = await searchProducts(barcodeString);
          if (products.length > 0) {
            addItem(products[0]);
            setQuery('');
            setResults([]);
            setIsOpen(false);
          }
        } catch (err) {
          console.error('Barcode search failed', err);
        }
        barcodeString = '';
      } else if (e.key.length === 1) {
        barcodeString += e.key;
      }
      lastKeyTime = currentTime;
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [addItem]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time search
  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      try {
        const data = await searchProducts(query);
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error', err);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (product) => {
    addItem(product);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar por nombre, SKU o código de barras..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pl-10 pr-10 h-12 text-base bg-background border-input focus-visible:ring-primary shadow-sm rounded-xl"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground rounded-lg"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 max-h-[300px] overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2">
          {results.map((product) => (
            <button
              key={product.id}
              className="w-full text-left px-4 py-3 hover:bg-muted/50 flex items-center justify-between transition-colors border-b border-border/50 last:border-0"
              onClick={() => handleSelect(product)}
              disabled={product.stock <= 0}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-medium ${product.stock <= 0 ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">{product.barcode || product.sku}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{formatCurrency(product.price)}</p>
                <p className={`text-[10px] font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                  {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
