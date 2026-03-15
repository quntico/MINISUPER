
/**
 * Represents a role definition within a company.
 */
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

/**
 * Represents a system-wide available permission.
 */
export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
  created: string;
  updated: string;
}
