
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from './AuthContext.jsx';

export const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCompany = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Si no hay usuario, intentar cargar la primera empresa de la DB (modo local/abierto)
        if (!user) {
          try {
            const firstCompany = await pb.collection('companies').getFirstListItem('', { $autoCancel: false });
            if (firstCompany) {
              setCompany(firstCompany);
              setCompanies([firstCompany]);
              localStorage.setItem('company_id', firstCompany.id);
            }
          } catch (e) {
            setCompany(null);
          }
          setIsLoading(false);
          return;
        }

        const targetCompanyId = user.company_id || localStorage.getItem('company_id');

        if (targetCompanyId) {
          const record = await pb.collection('companies').getOne(targetCompanyId, { $autoCancel: false });
          setCompany(record);
          setCompanies([record]);
          localStorage.setItem('company_id', record.id);
        } else {
          const roles = await pb.collection('user_roles').getFullList({
            filter: `user_id = "${user.id}"`,
            expand: 'company_id',
            $autoCancel: false
          });

          if (roles.length > 0 && roles[0].expand?.company_id) {
            const foundCompany = roles[0].expand.company_id;
            setCompany(foundCompany);
            setCompanies(roles.map(r => r.expand.company_id).filter(Boolean));
            localStorage.setItem('company_id', foundCompany.id);
          } else {
            setCompany(null);
            setCompanies([]);
          }
        }
      } catch (err) {
        console.error('Error loading company:', err);
        setError(err.message);
        setCompany(null);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompany();
  }, [user]);

  const switchCompany = async (companyId) => {
    setIsLoading(true);
    try {
      const record = await pb.collection('companies').getOne(companyId, { $autoCancel: false });
      setCompany(record);
      localStorage.setItem('company_id', record.id);
      localStorage.removeItem('branch_id');
    } catch (err) {
      console.error('Error switching company:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompany = async (companyId, data) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await pb.collection('companies').update(companyId, data, { $autoCancel: false });
      if (company?.id === companyId) {
        setCompany(updated);
      }
      setCompanies(prev => prev.map(c => c.id === companyId ? updated : c));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CompanyContext.Provider value={{ 
      company, 
      companies, 
      isLoading, 
      error, 
      switchCompany, 
      updateCompany 
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany debe usarse dentro de un CompanyProvider');
  }
  return context;
};
