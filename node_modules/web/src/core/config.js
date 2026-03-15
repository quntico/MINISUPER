
export const CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || '/api',
  POCKETBASE_URL: import.meta.env.VITE_POCKETBASE_URL || '/',
  APP_NAME: 'MINISUPER SaaS',
  APP_VERSION: '2.0.0',
  ENVIRONMENT: import.meta.env.MODE || 'development'
};

export default CONFIG;
