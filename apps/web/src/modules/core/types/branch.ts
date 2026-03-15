
/**
 * Represents a physical or logical branch within a company.
 */
export interface Branch {
  id: string;
  company_id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  manager?: string;
  is_main: boolean;
  is_active: boolean;
  created: string;
  updated: string;
}

/**
 * Branch-specific configuration settings.
 */
export interface BranchSettings {
  receipt_printer?: string;
  cash_register_count: number;
  operating_hours?: {
    open: string;
    close: string;
  };
}
