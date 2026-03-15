
/**
 * Represents a tenant/company in the SaaS platform.
 */
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
  subscription_plan: SubscriptionPlan;
  subscription_status: 'active' | 'past_due' | 'canceled' | 'trialing';
  subscription_start?: string;
  subscription_end?: string;
  max_users: number;
  max_branches: number;
  max_products: number;
  features: Record<string, boolean>;
  settings: CompanySettings;
  created: string;
  updated: string;
}

/**
 * Company-specific configuration settings.
 */
export interface CompanySettings {
  currency: string;
  timezone: string;
  date_format: string;
  tax_rate: number;
  receipt_footer?: string;
}

export type SubscriptionPlan = 'BASIC' | 'PRO' | 'ENTERPRISE';
