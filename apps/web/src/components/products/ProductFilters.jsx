
import React from 'react';
import { Search, SlidersHorizontal, Download, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductFilters = ({ onFilterChange, categories, currentFilters }) => {
  
  const handleChange = (key, value) => {
    onFilterChange({ ...currentFilters, [key]: value });
  };

  const handleClear = () => {
    onFilterChange({
      search: '',
      category: 'Todas',
      status: 'Todos',
      minPrice: '',
      maxPrice: ''
    });
  };

  const hasActiveFilters = currentFilters.search || 
                           currentFilters.category !== 'Todas' || 
                           currentFilters.status !== 'Todos' || 
                           currentFilters.minPrice || 
                           currentFilters.maxPrice;

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre, SKU o código de barras..." 
            className="pl-9 bg-background"
            value={currentFilters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={handleClear} className="text-muted-foreground hover:text-foreground gap-2">
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Limpiar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Categoría</label>
          <Select value={currentFilters.category} onValueChange={(v) => handleChange('category', v)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas las categorías</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Estatus</label>
          <Select value={currentFilters.status} onValueChange={(v) => handleChange('status', v)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos los estatus</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
              <SelectItem value="Descontinuado">Descontinuado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Precio Mínimo</label>
          <Input 
            type="number" 
            placeholder="$ 0.00" 
            className="bg-background"
            value={currentFilters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Precio Máximo</label>
          <Input 
            type="number" 
            placeholder="$ 0.00" 
            className="bg-background"
            value={currentFilters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
