
import { SubscriptionPlan } from './company';

/**
 * Represents a company's license and billing details.
 */
export interface License {
  id: string;
  company_id: string;
  plan: SubscriptionPlan;
  status: 'active' | 'expired' | 'suspended';
  start_date: string;
  end_date: string;
  max_users: number;
  max_branches: number;
  max_products: number;
  features: Record<string, boolean>;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  auto_renew: boolean;
  created: string;
  updated: string;
}

export interface LicensePlan {
  id: SubscriptionPlan;
  name: string;
  price_monthly: number;
  price_yearly: number;
  limits: {
    users: number;
    branches: number;
    products: number;
  };
  features: string[];
}
