
import { storageService } from './storageService';

export const contextService = {
  getCurrentCompanyId: () => storageService.get('company_id'),
  setCurrentCompanyId: (id) => storageService.set('company_id', id),
  
  getCurrentBranchId: () => storageService.get('branch_id'),
  setCurrentBranchId: (id) => storageService.set('branch_id', id),
  
  clearContext: () => {
    storageService.remove('company_id');
    storageService.remove('branch_id');
  }
};
