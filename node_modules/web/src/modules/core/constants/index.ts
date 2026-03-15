
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  GERENTE: 'GERENTE',
  CAJERO: 'CAJERO',
  INVENTARIO: 'INVENTARIO'
} as const;

export const PLANS = {
  BASIC: 'BASIC',
  PRO: 'PRO',
  ENTERPRISE: 'ENTERPRISE'
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
} as const;

export const CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || '/api',
  POCKETBASE_URL: import.meta.env.VITE_POCKETBASE_URL || '/',
  APP_NAME: 'MINISUPER SaaS',
  APP_VERSION: '2.0.0'
} as const;
