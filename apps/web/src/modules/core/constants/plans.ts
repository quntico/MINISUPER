
import { LicensePlan } from '../types/license';

export const SUBSCRIPTION_PLANS: Record<string, LicensePlan> = {
  BASIC: {
    id: 'BASIC',
    name: 'Basic',
    price_monthly: 29,
    price_yearly: 290,
    limits: {
      users: 2,
      branches: 1,
      products: 500
    },
    features: ['pos', 'basic_reports', 'inventory']
  },
  PRO: {
    id: 'PRO',
    name: 'Professional',
    price_monthly: 79,
    price_yearly: 790,
    limits: {
      users: 5,
      branches: 3,
      products: 5000
    },
    features: ['pos', 'advanced_reports', 'inventory', 'api_access', 'multi_branch']
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price_monthly: 199,
    price_yearly: 1990,
    limits: {
      users: 999999,
      branches: 999999,
      products: 999999
    },
    features: ['pos', 'advanced_reports', 'inventory', 'api_access', 'multi_branch', 'ai_intelligence', 'whatsapp_bot']
  }
};
