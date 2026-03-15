
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useCompany } from './CompanyContext.jsx';

export const BranchContext = createContext(null);

export const BranchProvider = ({ children }) => {
  const { company } = useCompany();
  const [branch, setBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBranches = async () => {
      // ⚠️ MODO DESARROLLO: Permitir estado null sin bloquear ni lanzar errores
      if (!company) {
        setBranch(null);
        setBranches([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const records = await pb.collection('branches').getFullList({
          filter: `company_id = "${company.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        
        setBranches(records);

        if (records.length > 0) {
          const savedBranchId = localStorage.getItem('branch_id');
          const savedBranch = records.find(b => b.id === savedBranchId);
          
          if (savedBranch) {
            setBranch(savedBranch);
          } else {
            const mainBranch = records.find(b => b.is_main) || records[0];
            setBranch(mainBranch);
            localStorage.setItem('branch_id', mainBranch.id);
          }
        } else {
          setBranch(null);
          localStorage.removeItem('branch_id');
        }
      } catch (err) {
        console.error('Error loading branches:', err);
        setError(err.message);
        setBranch(null);
        setBranches([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBranches();
  }, [company]);

  const switchBranch = (branchId) => {
    const selected = branches.find(b => b.id === branchId);
    if (selected) {
      setBranch(selected);
      localStorage.setItem('branch_id', selected.id);
    }
  };

  const updateBranch = async (branchId, data) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await pb.collection('branches').update(branchId, data, { $autoCancel: false });
      setBranches(prev => prev.map(b => b.id === branchId ? updated : b));
      if (branch?.id === branchId) {
        setBranch(updated);
      }
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BranchContext.Provider value={{ 
      branch, 
      branches, 
      isLoading, 
      error, 
      switchBranch, 
      updateBranch 
    }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch debe usarse dentro de un BranchProvider');
  }
  return context;
};
