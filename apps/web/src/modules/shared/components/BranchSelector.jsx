
import React from 'react';
import { useBranch } from '../../core/contexts/BranchContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

export const BranchSelector = () => {
  const { branches, currentBranch, setCurrentBranch } = useBranch();

  if (!branches || branches.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <MapPin className="w-4 h-4 text-muted-foreground" />
      <Select 
        value={currentBranch?.id || ''} 
        onValueChange={(val) => setCurrentBranch(branches.find(b => b.id === val))}
      >
        <SelectTrigger className="w-[180px] h-8 text-sm border-none bg-transparent shadow-none focus:ring-0">
          <SelectValue placeholder="Select Branch" />
        </SelectTrigger>
        <SelectContent>
          {branches.map(branch => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
