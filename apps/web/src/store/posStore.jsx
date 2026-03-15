
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const PosContext = createContext(null);

export const PosProvider = ({ children }) => {
  const [ticketItems, setTicketItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [cashierName, setCashierName] = useState('Cajero');
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotals = useCallback(() => {
    let newSubtotal = 0;
    ticketItems.forEach(item => {
      newSubtotal += (item.quantity * item.price) - (item.discount || 0);
    });
    
    newSubtotal -= discount;
    if (newSubtotal < 0) newSubtotal = 0;
    
    const newTax = newSubtotal * 0.16;
    const newTotal = newSubtotal + newTax;

    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [ticketItems, discount]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const addItem = useCallback((product) => {
    if (product.stock <= 0) {
      toast.error('Producto agotado');
      return;
    }

    setTicketItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity + 1 > product.stock) {
          toast.error(`Stock insuficiente. Máximo: ${product.stock}`);
          return prev;
        }
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, discount: 0 }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setTicketItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  const increaseQty = useCallback((productId) => {
    setTicketItems(prev => prev.map(item => {
      if (item.id === productId) {
        if (item.quantity + 1 > item.stock) {
          toast.error(`Stock insuficiente. Máximo: ${item.stock}`);
          return item;
        }
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    }));
  }, []);

  const decreaseQty = useCallback((productId) => {
    setTicketItems(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity <= 1) {
        return prev.filter(item => item.id !== productId);
      }
      return prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      );
    });
  }, []);

  const setQuantity = useCallback((productId, qty) => {
    const numQty = parseInt(qty, 10);
    if (isNaN(numQty) || numQty < 0) return;

    if (numQty === 0) {
      removeItem(productId);
      return;
    }

    setTicketItems(prev => prev.map(item => {
      if (item.id === productId) {
        if (numQty > item.stock) {
          toast.error(`Stock insuficiente. Máximo: ${item.stock}`);
          return { ...item, quantity: item.stock };
        }
        return { ...item, quantity: numQty };
      }
      return item;
    }));
  }, [removeItem]);

  const applyDiscount = useCallback((productId, itemDiscount) => {
    const numDiscount = parseFloat(itemDiscount) || 0;
    setTicketItems(prev => prev.map(item => {
      if (item.id === productId) {
        const maxDiscount = item.price * item.quantity;
        return { ...item, discount: Math.min(numDiscount, maxDiscount) };
      }
      return item;
    }));
  }, []);

  const applyGeneralDiscount = useCallback((amount) => {
    setDiscount(parseFloat(amount) || 0);
  }, []);

  const clearTicket = useCallback(() => {
    setTicketItems([]);
    setDiscount(0);
    setPaymentMethod('Efectivo');
  }, []);

  const getTicketData = useCallback(() => {
    return {
      items: ticketItems,
      subtotal,
      tax,
      total,
      discount,
      paymentMethod,
      cashierName
    };
  }, [ticketItems, subtotal, tax, total, discount, paymentMethod, cashierName]);

  const value = {
    ticketItems,
    subtotal,
    tax,
    total,
    discount,
    paymentMethod,
    cashierName,
    isLoading,
    setIsLoading,
    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    setQuantity,
    applyDiscount,
    applyGeneralDiscount,
    setPaymentMethod,
    setCashierName,
    calculateTotals,
    clearTicket,
    getTicketData
  };

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
};

export const usePosStore = () => {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error('usePosStore must be used within a PosProvider');
  }
  return context;
};
