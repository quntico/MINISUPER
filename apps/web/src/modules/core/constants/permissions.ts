
export const PERMISSIONS = {
  // Products
  PRODUCTS_VIEW: 'products.view',
  PRODUCTS_CREATE: 'products.create',
  PRODUCTS_EDIT: 'products.edit',
  PRODUCTS_DELETE: 'products.delete',
  
  // Sales
  SALES_VIEW: 'sales.view',
  SALES_CREATE: 'sales.create',
  SALES_REFUND: 'sales.refund',
  
  // Inventory
  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_ADJUST: 'inventory.adjust',
  INVENTORY_RECEIVE: 'inventory.receive',
  
  // Reports
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',
  
  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_EDIT: 'settings.edit',
  
  // Users
  USERS_VIEW: 'users.view',
  USERS_MANAGE: 'users.manage',
} as const;
