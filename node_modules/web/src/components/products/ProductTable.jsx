
import React from 'react';
import { Edit, Trash2, Eye, ArrowUpDown, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters.js';
import StatusBadge from './StatusBadge.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductTable = ({ 
  products, 
  onEdit, 
  onDelete, 
  onView, 
  selectedIds, 
  onSelectChange, 
  sortConfig, 
  onSort,
  paginationConfig,
  onPageChange,
  onLimitChange
}) => {
  
  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectChange(products.map(p => p.id));
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectOne = (checked, id) => {
    if (checked) {
      onSelectChange([...selectedIds, id]);
    } else {
      onSelectChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-3 h-3 ml-1 text-primary" /> 
      : <ArrowDown className="w-3 h-3 ml-1 text-primary" />;
  };

  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < products.length;

  return (
    <div className="space-y-4">
      <div className="table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="table-header-cell w-12 text-center">
                <Checkbox 
                  checked={allSelected} 
                  onCheckedChange={handleSelectAll}
                  className={someSelected ? "data-[state=unchecked]:bg-primary data-[state=unchecked]:border-primary" : ""}
                />
              </th>
              <th className="table-header-cell w-16">Img</th>
              <th className="table-header-cell" onClick={() => onSort('sku')}>
                <div className="flex items-center">SKU {renderSortIcon('sku')}</div>
              </th>
              <th className="table-header-cell" onClick={() => onSort('name')}>
                <div className="flex items-center">Nombre {renderSortIcon('name')}</div>
              </th>
              <th className="table-header-cell" onClick={() => onSort('category')}>
                <div className="flex items-center">Categoría {renderSortIcon('category')}</div>
              </th>
              <th className="table-header-cell text-right" onClick={() => onSort('price')}>
                <div className="flex items-center justify-end">Precio {renderSortIcon('price')}</div>
              </th>
              <th className="table-header-cell text-right" onClick={() => onSort('stock')}>
                <div className="flex items-center justify-end">Stock {renderSortIcon('stock')}</div>
              </th>
              <th className="table-header-cell text-center" onClick={() => onSort('status')}>
                <div className="flex items-center justify-center">Estatus {renderSortIcon('status')}</div>
              </th>
              <th className="table-header-cell text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-muted-foreground">
                  No se encontraron productos con los filtros actuales.
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id} className="table-row group">
                  <td className="table-cell text-center">
                    <Checkbox 
                      checked={selectedIds.includes(product.id)}
                      onCheckedChange={(c) => handleSelectOne(c, product.id)}
                    />
                  </td>
                  <td className="table-cell">
                    <div className="w-10 h-10 rounded-md bg-muted overflow-hidden border border-border flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-muted-foreground opacity-50" />
                      )}
                    </div>
                  </td>
                  <td className="table-cell font-medium text-xs text-muted-foreground">{product.sku}</td>
                  <td className="table-cell font-medium">{product.name}</td>
                  <td className="table-cell text-muted-foreground">{product.category}</td>
                  <td className="table-cell text-right font-medium">{formatCurrency(product.price)}</td>
                  <td className="table-cell text-right">
                    <span className={`font-medium ${product.stock <= 5 ? 'text-destructive' : ''}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onView(product)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-info" onClick={() => onEdit(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(product)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>
          Mostrando {products.length > 0 ? (paginationConfig.page - 1) * paginationConfig.limit + 1 : 0} - {Math.min(paginationConfig.page * paginationConfig.limit, paginationConfig.total)} de {paginationConfig.total} productos
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Filas por página:</span>
            <Select value={paginationConfig.limit.toString()} onValueChange={(v) => onLimitChange(Number(v))}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2" 
              disabled={paginationConfig.page === 1}
              onClick={() => onPageChange(paginationConfig.page - 1)}
            >
              Anterior
            </Button>
            <div className="px-2 font-medium text-foreground">
              {paginationConfig.page} / {Math.max(1, Math.ceil(paginationConfig.total / paginationConfig.limit))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2"
              disabled={paginationConfig.page >= Math.ceil(paginationConfig.total / paginationConfig.limit)}
              onClick={() => onPageChange(paginationConfig.page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
