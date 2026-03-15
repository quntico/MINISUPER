
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePOS } from '@/hooks/usePOSStore.jsx';
import { cn } from '@/lib/utils';

const categories = ['Todos', 'Bebidas', 'Snacks', 'Lacteos', 'Abarrotes'];

const CategoryFilter = () => {
  const { selectedCategory, setSelectedCategory } = usePOS();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={selectedCategory === cat ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(cat)}
          className={cn(
            "whitespace-nowrap rounded-full transition-all duration-200",
            selectedCategory === cat 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "bg-background hover:bg-muted"
          )}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
