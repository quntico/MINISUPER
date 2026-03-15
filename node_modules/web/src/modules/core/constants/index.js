
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  GERENTE: 'gerente',
  CAJERO: 'cajero',
  INVENTARIO: 'inventario'
};

export const PLANS = {
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
};

export const CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || '/api',
  POCKETBASE_URL: import.meta.env.VITE_POCKETBASE_URL || '/',
  APP_NAME: 'MINISUPER SaaS',
  APP_VERSION: '2.0.0'
};

export const PERMISSIONS = {
  // POS
  POS_ACCESS: 'pos.access',
  POS_DISCOUNT: 'pos.discount',
  POS_PRICE_CHANGE: 'pos.price_change',
  POS_VOID_SALE: 'pos.void_sale',
  
  // Products
  PRODUCTS_VIEW: 'products.view',
  PRODUCTS_CREATE: 'products.create',
  PRODUCTS_EDIT: 'products.edit',
  PRODUCTS_DELETE: 'products.delete',
  
  // Inventory
  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_ADJUST: 'inventory.adjust',
  INVENTORY_RECEIVE: 'inventory.receive',
  INVENTORY_TRANSFER: 'inventory.transfer',
  
  // Reports
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',
  
  // Users
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  
  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_EDIT: 'settings.edit'
};
