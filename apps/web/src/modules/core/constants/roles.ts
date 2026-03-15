
export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CASHIER: 'CASHIER',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
  VIEWER: 'VIEWER'
} as const;

export const ROLE_DESCRIPTIONS = {
  [SYSTEM_ROLES.SUPER_ADMIN]: 'System administrator with full access to all companies (Internal use only).',
  [SYSTEM_ROLES.ADMIN]: 'Company administrator with full access to all branches and settings.',
  [SYSTEM_ROLES.MANAGER]: 'Branch manager with access to reports, inventory, and staff management for their branch.',
  [SYSTEM_ROLES.CASHIER]: 'Point of sale operator with access to sales and basic customer management.',
  [SYSTEM_ROLES.INVENTORY_MANAGER]: 'Staff responsible for stock counts, receiving orders, and product management.',
  [SYSTEM_ROLES.VIEWER]: 'Read-only access to reports and dashboards.'
};
