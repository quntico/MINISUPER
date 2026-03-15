
import React from 'react';
import { useCompany } from '../../core/contexts/CompanyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

export const CompanySelector = () => {
  const { companies, currentCompany, setCurrentCompany } = useCompany();

  if (!companies || companies.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <Building2 className="w-4 h-4 text-muted-foreground" />
      <Select 
        value={currentCompany?.id || ''} 
        onValueChange={(val) => setCurrentCompany(companies.find(c => c.id === val))}
      >
        <SelectTrigger className="w-[200px] h-8 text-sm border-none bg-transparent shadow-none focus:ring-0">
          <SelectValue placeholder="Select Company" />
        </SelectTrigger>
        <SelectContent>
          {companies.map(company => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
