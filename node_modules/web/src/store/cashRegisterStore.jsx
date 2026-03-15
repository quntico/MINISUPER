
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbase.js';
import { toast } from 'sonner';

const CashRegisterContext = createContext(null);

export const CashRegisterProvider = ({ children }) => {
  const [currentCashRegister, setCurrentCashRegister] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentRegister = useCallback(async () => {
    if (!pb.authStore.isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const records = await pb.collection('cash_registers').getFullList({
        filter: `status = "open" && user_id = "${pb.authStore.model.id}"`,
        sort: '-created',
        $autoCancel: false,
      });

      if (records.length > 0) {
        setCurrentCashRegister(records[0]);
        setIsOpen(true);
      } else {
        setCurrentCashRegister(null);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error fetching cash register:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentRegister();
  }, [fetchCurrentRegister]);

  const openCashRegister = async (openingAmount, branch = 'Principal') => {
    if (!pb.authStore.isValid) {
      toast.error('Debes iniciar sesión');
      return false;
    }

    try {
      setIsLoading(true);
      const record = await pb.collection('cash_registers').create({
        user_id: pb.authStore.model.id,
        branch,
        opening_amount: parseFloat(openingAmount),
        status: 'open',
        opened_at: new Date().toISOString(),
      }, { $autoCancel: false });

      setCurrentCashRegister(record);
      setIsOpen(true);
      toast.success('Caja abierta exitosamente');
      return true;
    } catch (error) {
      console.error('Error opening cash register:', error);
      toast.error('Error al abrir la caja');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getPartialCut = async () => {
    if (!currentCashRegister) return null;

    try {
      // Fetch sales since opening
      const sales = await pb.collection('sales').getFullList({
        filter: `created >= "${currentCashRegister.opened_at}" && user_id = "${pb.authStore.model.id}" && status = "completed"`,
        $autoCancel: false,
      });

      let cashSales = 0;
      let cardSales = 0;
      let transferSales = 0;

      sales.forEach(sale => {
        if (sale.payment_method === 'Efectivo') cashSales += sale.total;
        else if (sale.payment_method === 'Tarjeta') cardSales += sale.total;
        else if (sale.payment_method === 'Transferencia') transferSales += sale.total;
      });

      const expectedAmount = currentCashRegister.opening_amount + cashSales;

      return {
        openingAmount: currentCashRegister.opening_amount,
        cashSales,
        cardSales,
        transferSales,
        totalSales: cashSales + cardSales + transferSales,
        expectedAmountInDrawer: expectedAmount,
        openedAt: currentCashRegister.opened_at
      };
    } catch (error) {
      console.error('Error calculating partial cut:', error);
      return null;
    }
  };

  const closeCashRegister = async (closingAmount, notes = '') => {
    if (!currentCashRegister) return false;

    try {
      setIsLoading(true);
      const partialCut = await getPartialCut();
      const expectedAmount = partialCut.expectedAmountInDrawer;
      const difference = parseFloat(closingAmount) - expectedAmount;

      await pb.collection('cash_registers').update(currentCashRegister.id, {
        closing_amount: parseFloat(closingAmount),
        expected_amount: expectedAmount,
        difference,
        status: 'closed',
        closed_at: new Date().toISOString(),
        notes
      }, { $autoCancel: false });

      setCurrentCashRegister(null);
      setIsOpen(false);
      toast.success('Caja cerrada exitosamente');
      return true;
    } catch (error) {
      console.error('Error closing cash register:', error);
      toast.error('Error al cerrar la caja');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentCashRegister,
    isOpen,
    isLoading,
    openCashRegister,
    closeCashRegister,
    getPartialCut,
    refresh: fetchCurrentRegister
  };

  return (
    <CashRegisterContext.Provider value={value}>
      {children}
    </CashRegisterContext.Provider>
  );
};

export const useCashRegister = () => {
  const context = useContext(CashRegisterContext);
  if (!context) {
    throw new Error('useCashRegister must be used within a CashRegisterProvider');
  }
  return context;
};
