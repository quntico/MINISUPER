
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

  const createCompany = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Crear la empresa
      const newCompany = await pb.collection('companies').create(data, { $autoCancel: false });
      
      // 2. Crear una sucursal matriz por defecto
      const mainBranch = await pb.collection('branches').create({
        company_id: newCompany.id,
        name: 'Matriz',
        code: 'MAT',
        is_main: true
      }, { $autoCancel: false });

      // 3. Vincular al usuario con la empresa si existe un usuario logueado
      if (user?.id) {
        await pb.collection('users').update(user.id, {
          company_id: newCompany.id
        });
      }

      setCompany(newCompany);
      setCompanies(prev => [...prev, newCompany]);
      localStorage.setItem('company_id', newCompany.id);
      localStorage.setItem('branch_id', mainBranch.id);
      
      return newCompany;
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
      updateCompany,
      createCompany 
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
