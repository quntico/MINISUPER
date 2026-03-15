
import pb from '@/lib/pocketbaseClient.js';
import { sanitizeDiagnostic } from './sanitizeDiagnosticService.js';

export const generateSystemDiagnostic = async () => {
  try {
    // Fetch statistics safely
    const products = await pb.collection('products').getFullList({ $autoCancel: false }).catch(() => []);
    const sales = await pb.collection('sales').getFullList({ $autoCancel: false }).catch(() => []);
    const users = await pb.collection('users').getFullList({ $autoCancel: false }).catch(() => []);
    
    const totalSalesAmount = sales.reduce((sum, s) => sum + (s.total || 0), 0);
    const inventoryValue = products.reduce((sum, p) => sum + ((p.cost || 0) * (p.stock || 0)), 0);
    const averageTicket = sales.length > 0 ? totalSalesAmount / sales.length : 0;

    const diagnosticData = {
      metadata: {
        systemName: 'MINISUPER',
        type: 'POS Comercial',
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        environment: import.meta.env.MODE || 'production',
        baseUrl: window.location.origin,
      },
      branding: {
        businessName: 'MINISUPER',
        primaryColor: '#16a34a',
        typography: 'DM Sans',
        theme: 'System Default (Light/Dark)',
      },
      navigation: {
        mainRoutes: ['/dashboard', '/caja', '/productos', '/control-caja', '/inventario', '/reportes', '/inteligencia', '/configuracion'],
      },
      modules: {
        pos: { status: 'active', features: ['Barcode scanning', 'Multiple payment methods', 'Ticket generation'] },
        products: { status: 'active', features: ['CRUD operations', 'Stock management', 'Categorization'] },
        inventory: { status: 'active', features: ['Stock alerts', 'Value calculation', 'Import/Export'] },
        reports: { status: 'active', features: ['Sales by date', 'Top products', 'Cashier performance'] },
        dashboard: { status: 'active', features: ['KPIs', 'Charts', 'Quick actions'] },
        cashRegister: { status: 'active', features: ['Opening', 'Closing', 'Partial cuts', 'Discrepancy tracking'] },
        intelligence: { status: 'active', features: ['AI Queries', 'Automated alerts', 'Executive summary'] },
        settings: { status: 'active', features: ['Business info', 'System preferences', 'Tax configuration'] },
      },
      storage: {
        collections: [
          { name: 'users', type: 'auth', recordCount: users.length },
          { name: 'products', type: 'base', recordCount: products.length },
          { name: 'sales', type: 'base', recordCount: sales.length },
          { name: 'sale_items', type: 'base', recordCount: 'Dynamic' },
          { name: 'cash_registers', type: 'base', recordCount: 'Dynamic' }
        ]
      },
      connections: {
        pocketbase: { status: pb.authStore.isValid ? 'connected' : 'disconnected', url: pb.baseUrl },
        internet: { status: navigator.onLine ? 'online' : 'offline' }
      },
      technology: {
        frontend: 'React 18.2.0',
        routing: 'React Router 6.16.0',
        styling: 'TailwindCSS 3.3.2',
        uiLibrary: 'shadcn/ui',
        backend: 'PocketBase ^0.25.0',
        buildTool: 'Vite'
      },
      statistics: {
        totalProducts: products.length,
        totalSales: sales.length,
        totalUsers: users.length,
        inventoryValue: inventoryValue,
        totalSalesAmount: totalSalesAmount,
        averageTicket: averageTicket
      },
      security: {
        authentication: 'PocketBase Auth',
        https: window.location.protocol === 'https:',
        dataValidation: 'Active (Client & Server)'
      },
      maintenance: {
        lastUpdate: new Date().toISOString(),
        logsAvailable: true
      }
    };

    return sanitizeDiagnostic(diagnosticData);
  } catch (error) {
    console.error('Error generating diagnostic:', error);
    throw new Error('Failed to generate system diagnostic');
  }
};
