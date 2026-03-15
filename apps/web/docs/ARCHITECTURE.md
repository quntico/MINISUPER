
# SaaS Modular Architecture

## 1. Module Structure
The application is divided into feature-based modules under `src/modules/`:
- `core/`: Global contexts, types, constants, utils, and base services.
- `auth/`: Authentication, login, registration, password reset.
- `users/`: User management and profiles.
- `roles/`: RBAC, role definitions, and permission assignments.
- `pos/`: Point of Sale interface and logic.
- `products/`: Product catalog, categories, and pricing.
- `inventory/`: Stock management, movements, and suppliers.
- `sales/`: Sales history, receipts, and refunds.
- `reports/`: Analytics, charts, and data exports.
- `dashboard/`: Main KPIs and overview.
- `intelligence/`: AI queries and insights.
- `configuration/`: System and company settings.
- `licenses/`: Subscription and billing management.
- `shared/`: Reusable UI components, hooks, and generic services.

## 2. Context Hierarchy
Data flows top-down through React Contexts:
1. `AuthProvider`: Manages current user session.
2. `CompanyProvider`: Manages the active tenant (company).
3. `BranchProvider`: Manages the active branch within the company.
4. `PermissionsProvider`: Calculates effective permissions based on user + company + branch.

## 3. Service Layer
Services are singletons that handle API communication and business logic.
- `apiService`: Base wrapper around PocketBase client, injecting company/branch IDs automatically.
- Module-specific services (e.g., `productService`) use `apiService` to ensure tenant isolation.

## 4. Permission & Feature Checking
- `PermissionGate`: Component wrapper that hides UI elements if the user lacks specific permissions.
- `FeatureGate`: Component wrapper that hides UI elements if the company's license plan doesn't include the feature.
- `ProtectedRoute`: Route-level guard for authentication and authorization.

## 5. State Management
- Global state: React Context (Auth, Company, Branch, Permissions).
- Server state: PocketBase SDK with local caching/SWR patterns where applicable.
- Local UI state: React `useState` and `useReducer`.
