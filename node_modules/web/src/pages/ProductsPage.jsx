
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Package } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import ProductFilters from '@/components/products/ProductFilters.jsx';
import ProductTable from '@/components/products/ProductTable.jsx';
import ProductFormModal from '@/components/products/ProductFormModal.jsx';
import ProductDetailModal from '@/components/products/ProductDetailModal.jsx';
import DeleteConfirmationModal from '@/components/products/DeleteConfirmationModal.jsx';

import { getProducts, getCategories, getProviders } from '@/data/mockProducts.js';

const ProductsPage = () => {
  // Data State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  
  // UI State
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'Todas',
    status: 'Todos',
    minPrice: '',
    maxPrice: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Load initial data
  useEffect(() => {
    setProducts(getProducts());
    setCategories(getCategories());
    setProviders(getProviders());
  }, []);

  // Derived State: Filtered & Sorted Products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        (p.barcode && p.barcode.includes(q))
      );
    }
    if (filters.category !== 'Todas') {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.status !== 'Todos') {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.minPrice) {
      result = result.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    // 2. Sort
    result.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, filters, sortConfig]);

  // Pagination slice
  const paginatedProducts = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    return processedProducts.slice(start, start + pagination.limit);
  }, [processedProducts, pagination]);

  // Handlers
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter
  };

  // CRUD Operations
  const handleSaveProduct = (productData) => {
    if (currentProduct) {
      // Edit
      setProducts(prev => prev.map(p => p.id === currentProduct.id ? { ...productData, id: p.id } : p));
      toast.success('Producto actualizado exitosamente');
    } else {
      // Create
      const newProduct = {
        ...productData,
        id: Math.random().toString(36).substr(2, 9)
      };
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Producto creado exitosamente');
    }
    setIsFormOpen(false);
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    toast.success('Producto eliminado');
    setIsDeleteOpen(false);
  };

  // Modal Triggers
  const openCreate = () => {
    setCurrentProduct(null);
    setIsFormOpen(true);
  };

  const openEdit = (product) => {
    setCurrentProduct(product);
    setIsFormOpen(true);
  };

  const openDetail = (product) => {
    setCurrentProduct(product);
    setIsDetailOpen(true);
  };

  const openDelete = (product) => {
    setCurrentProduct(product);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Productos - MINISUPER</title>
      </Helmet>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              Catálogo de Productos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestiona el inventario, precios y detalles de tus artículos. Total: {products.length}
            </p>
          </div>
          <Button 
            onClick={openCreate}
            className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2 h-11 px-6 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </Button>
        </div>

        {/* Filters */}
        <ProductFilters 
          categories={categories}
          currentFilters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Bulk Actions (Visible only when items selected) */}
        {selectedIds.length > 0 && (
          <div className="bg-accent/50 border border-border rounded-lg p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span className="text-sm font-medium px-2">
              {selectedIds.length} producto(s) seleccionado(s)
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Cambiar Estatus</Button>
              <Button variant="destructive" size="sm">Eliminar Seleccionados</Button>
            </div>
          </div>
        )}

        {/* Table */}
        <ProductTable 
          products={paginatedProducts}
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
          sortConfig={sortConfig}
          onSort={handleSort}
          paginationConfig={{ ...pagination, total: processedProducts.length }}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          onLimitChange={(limit) => setPagination({ page: 1, limit })}
          onEdit={openEdit}
          onView={openDetail}
          onDelete={openDelete}
        />
      </div>

      {/* Modals */}
      <ProductFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProduct}
        product={currentProduct}
        categories={categories}
        providers={providers}
      />

      <ProductDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        product={currentProduct}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteProduct}
        product={currentProduct}
      />

    </>
  );
};

export default ProductsPage;
