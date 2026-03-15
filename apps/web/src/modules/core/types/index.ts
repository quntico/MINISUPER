
export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  industry?: string;
  subscription_plan: string;
  subscription_status: string;
  subscription_start?: string;
  subscription_end?: string;
  max_users: number;
  max_branches: number;
  max_products: number;
  features: Record<string, boolean>;
  settings: Record<string, any>;
  created: string;
  updated: string;
}

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

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  verified: boolean;
  created: string;
  updated: string;
}

export interface Role {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  permissions: string[];
  is_system: boolean;
  created: string;
  updated: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
  created: string;
  updated: string;
}

export interface License {
  id: string;
  company_id: string;
  plan: string;
  status: string;
  start_date: string;
  end_date: string;
  max_users: number;
  max_branches: number;
  max_products: number;
  features: Record<string, boolean>;
  price: number;
  billing_cycle: string;
  auto_renew: boolean;
  created: string;
  updated: string;
}

export interface CompanyContextType {
  companies: Company[];
  currentCompany: Company | null;
  setCurrentCompany: (company: Company | null) => void;
  isLoading: boolean;
}

export interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch | null) => void;
  isLoading: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

export interface PermissionsContextType {
  permissions: string[];
  role: Role | null;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}
