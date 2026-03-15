
/**
 * Represents a user in the system.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  verified: boolean;
  created: string;
  updated: string;
}

/**
 * Represents the mapping of a user to a role within a specific company/branch.
 */
export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  company_id: string;
  branch_id?: string;
  created: string;
  updated: string;
}
