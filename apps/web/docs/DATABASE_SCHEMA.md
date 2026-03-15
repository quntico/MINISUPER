
# Database Schema & Migration Plan

This document outlines the database schema for the Multi-Company (SaaS) architecture using PocketBase.

## 1. New Collections

### `companies`
Stores tenant (company) information and subscription details.
- `id` (text, primary key)
- `name` (text, required)
- `slug` (text, unique)
- `logo` (file, max: 1, maxSize: 20MB)
- `description` (text)
- `email` (email)
- `phone` (text)
- `address`, `city`, `state`, `postal_code`, `country` (text)
- `tax_id` (text)
- `industry` (text)
- `subscription_plan` (text)
- `subscription_status` (text)
- `subscription_start`, `subscription_end` (datetime)
- `max_users`, `max_branches`, `max_products` (number)
- `features` (json)
- `settings` (json)
- `created`, `updated` (autodate)
**Rules**: Public read, Authenticated create.

### `branches`
Stores branch locations for each company.
- `id` (text, primary key)
- `company_id` (relation to companies, required)
- `name` (text, required)
- `code` (text, unique)
- `address`, `city`, `state`, `postal_code`, `phone`, `email` (text)
- `manager` (text)
- `is_main`, `is_active` (bool)
- `created`, `updated` (autodate)
**Rules**: Company-scoped access (`company_id.id != ""`).

### `roles`
Defines roles within a company.
- `id` (text, primary key)
- `company_id` (relation to companies, required)
- `name` (text, required)
- `description` (text)
- `permissions` (json array)
- `is_system` (bool)
- `created`, `updated` (autodate)
**Rules**: Company-scoped access.

### `permissions`
System-wide available permissions.
- `id` (text, primary key)
- `name` (text, required, unique)
- `description`, `module`, `action` (text)
- `created`, `updated` (autodate)
**Rules**: Public read, Authenticated write.

### `licenses`
Tracks subscription licenses and billing.
- `id` (text, primary key)
- `company_id` (relation to companies, required)
- `plan`, `status` (text)
- `start_date`, `end_date` (datetime)
- `max_users`, `max_branches`, `max_products` (number)
- `features` (json)
- `price` (number)
- `billing_cycle` (text)
- `auto_renew` (bool)
- `created`, `updated` (autodate)
**Rules**: Company-scoped access.

### `user_roles`
Maps users to roles within specific companies/branches.
- `id` (text, primary key)
- `user_id` (relation to users, required)
- `role_id` (relation to roles, required)
- `company_id` (relation to companies, required)
- `branch_id` (relation to branches, optional)
- `created`, `updated` (autodate)
**Rules**: User-specific access (`user_id.id = @request.auth.id`).

## 2. Modified Existing Collections

- **`products`**: Added `company_id` (relation, required).
- **`sales`**: Added `company_id` (relation, required), `branch_id` (relation, optional).
- **`sale_items`**: Added `company_id` (relation, required).
- **`cash_registers`**: Added `company_id` (relation, required), `branch_id` (relation, optional).

## 3. Indexes
- `idx_companies_slug` on `companies (slug)`
- `idx_branches_code` on `branches (code)`
- `idx_permissions_name` on `permissions (name)`
