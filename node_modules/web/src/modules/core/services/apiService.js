
import pb from '@/lib/pocketbaseClient';
import { storageService } from './storageService';

/**
 * Centralized API service wrapper around PocketBase.
 * Automatically injects company and branch context into queries.
 */
export const apiService = {
  getCompanyId: () => storageService.get('company_id'),
  getBranchId: () => storageService.get('branch_id'),

  /**
   * Enhances filter string with company and branch isolation
   */
  enhanceFilter: (filter = '') => {
    const companyId = apiService.getCompanyId();
    if (!companyId) return filter;

    const companyFilter = `company_id = "${companyId}"`;
    return filter ? `(${filter}) && ${companyFilter}` : companyFilter;
  },

  /**
   * Enhances data payload with company and branch IDs
   */
  enhanceData: (data = {}) => {
    const companyId = apiService.getCompanyId();
    const branchId = apiService.getBranchId();
    
    return {
      ...data,
      ...(companyId && !data.company_id ? { company_id: companyId } : {}),
      ...(branchId && !data.branch_id ? { branch_id: branchId } : {})
    };
  },

  collection: (collectionName) => {
    const coll = pb.collection(collectionName);
    
    return {
      getFullList: async (options = {}) => {
        const enhancedOptions = {
          ...options,
          filter: apiService.enhanceFilter(options.filter),
          $autoCancel: false
        };
        return coll.getFullList(enhancedOptions);
      },
      
      getList: async (page = 1, perPage = 20, options = {}) => {
        const enhancedOptions = {
          ...options,
          filter: apiService.enhanceFilter(options.filter),
          $autoCancel: false
        };
        return coll.getList(page, perPage, enhancedOptions);
      },
      
      getOne: async (id, options = {}) => {
        return coll.getOne(id, { ...options, $autoCancel: false });
      },
      
      create: async (data, options = {}) => {
        return coll.create(apiService.enhanceData(data), { ...options, $autoCancel: false });
      },
      
      update: async (id, data, options = {}) => {
        return coll.update(id, data, { ...options, $autoCancel: false });
      },
      
      delete: async (id, options = {}) => {
        return coll.delete(id, { ...options, $autoCancel: false });
      }
    };
  }
};
