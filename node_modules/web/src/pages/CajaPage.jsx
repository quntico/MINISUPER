
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

import { PosProvider, usePosStore } from '@/store/posStore.jsx';
import { getProducts, getProductsByCategory } from '@/services/productService.js';

import SearchBar from '@/components/caja/SearchBar.jsx';
import CategoryFilter from '@/components/caja/CategoryFilter.jsx';
import ProductGrid from '@/components/caja/ProductGrid.jsx';
import TicketSummary from '@/components/caja/TicketSummary.jsx';
import PaymentModal from '@/components/caja/PaymentModal.jsx';
import FunctionKeyBar from '@/components/caja/FunctionKeyBar.jsx';

const CajaPageContent = () => {
  const { ticketItems, clearTicket } = usePosStore();
  
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        let data;
        if (selectedCategory === 'Todos') {
          data = await getProducts();
        } else {
          data = await getProductsByCategory(selectedCategory);
        }
        setProducts(data);
      } catch (error) {
        toast.error('Error al cargar productos');
        console.error(error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleF1 = () => {
    if (ticketItems.length > 0) {
      setIsPaymentOpen(true);
    } else {
      toast.error('El ticket está vacío');
    }
  };

  const handleF2 = () => {
    if (ticketItems.length > 0) {
      if (window.confirm('¿Estás seguro de vaciar el ticket?')) {
        clearTicket();
        toast.success('Ticket vaciado');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Caja - MINISUPER</title>
      </Helmet>

      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 pb-24 h-full flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-primary tracking-tight">PUNTO DE VENTA</h1>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">CAJA ABIERTA</Badge>
          </div>
          <div className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
            Turno Matutino
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* Left Column: Products & Search */}
          <div className="lg:col-span-7 flex flex-col gap-4 min-h-0">
            <Card className="p-4 shadow-sm shrink-0 space-y-4 rounded-2xl">
              <SearchBar />
              <CategoryFilter 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
              />
            </Card>

            <div className="flex-1 overflow-y-auto pr-2 pb-2">
              <ProductGrid products={products} isLoading={isLoadingProducts} />
            </div>
          </div>

          {/* Right Column: Ticket & Summary */}
          <div className="lg:col-span-5 flex flex-col min-h-0">
            <TicketSummary onOpenPayment={() => setIsPaymentOpen(true)} />
          </div>
        </div>

        {/* Function Keys Section */}
        <div className="shrink-0">
          <FunctionKeyBar onF1={handleF1} onF2={handleF2} />
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
      />
    </>
  );
};

const CajaPage = () => {
  return (
    <PosProvider>
      <CajaPageContent />
    </PosProvider>
  );
};

export default CajaPage;
