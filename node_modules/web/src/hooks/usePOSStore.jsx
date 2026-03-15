
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getProducts } from '@/services/productService.js';

const POSContext = createContext(null);

export const POSProvider = ({ children }) => {
  const [currentTicket, setCurrentTicket] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar productos. Verifica tu conexión.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProductToTicket = useCallback((product) => {
    setCurrentTicket((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, lineTotal: (item.quantity + 1) * item.price }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, discount: 0, lineTotal: product.price }];
    });
  }, []);

  const removeProductFromTicket = useCallback((productId) => {
    setCurrentTicket((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeProductFromTicket(productId);
      return;
    }
    setCurrentTicket((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity, lineTotal: quantity * item.price - (item.discount || 0) }
          : item
      )
    );
  }, [removeProductFromTicket]);

  const applyDiscount = useCallback((productId, discountAmount) => {
    setCurrentTicket((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newDiscount = Math.min(discountAmount, item.price * item.quantity);
          return { ...item, discount: newDiscount, lineTotal: (item.price * item.quantity) - newDiscount };
        }
        return item;
      })
    );
  }, []);

  const clearTicket = useCallback(() => {
    setCurrentTicket([]);
  }, []);

  const calculateTotals = useCallback(() => {
    const subtotal = currentTicket.reduce((sum, item) => sum + item.lineTotal, 0);
    // Assuming prices include tax or tax is calculated on top. Let's calculate 16% IVA on top for this example.
    // If prices already include IVA, this logic would change. We'll add 16% on top as requested.
    const tax = subtotal * 0.16;
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  }, [currentTicket]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch = 
        !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const value = {
    currentTicket,
    searchQuery,
    selectedCategory,
    products,
    filteredProducts,
    loading,
    error,
    addProductToTicket,
    removeProductFromTicket,
    updateQuantity,
    clearTicket,
    applyDiscount,
    calculateTotals,
    setSearchQuery,
    setSelectedCategory,
    loadProducts,
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
