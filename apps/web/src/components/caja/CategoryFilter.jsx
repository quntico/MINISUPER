
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = ['Todos', 'Bebidas', 'Snacks', 'Lácteos', 'Abarrotes'];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={selectedCategory === cat ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectCategory(cat)}
          className={cn(
            "whitespace-nowrap rounded-full transition-all duration-200 h-10 px-5 font-medium",
            selectedCategory === cat 
              ? "bg-primary text-primary-foreground shadow-md" 
              : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border"
          )}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
