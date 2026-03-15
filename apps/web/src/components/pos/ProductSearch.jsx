
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePOS } from '@/hooks/usePOSStore.jsx';

const ProductSearch = () => {
  const { searchQuery, setSearchQuery } = usePOS();

  return (
    <div className="relative flex items-center w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Buscar por nombre, SKU o código de barras..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-10 h-12 text-base bg-background border-input focus-visible:ring-primary"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground"
          onClick={() => setSearchQuery('')}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default ProductSearch;
