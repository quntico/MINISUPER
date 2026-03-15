
import pb from '@/lib/pocketbase.js';
import { getSalesByDateRange } from './analytics/salesAnalytics.js';
import { getTopProducts } from './analytics/productAnalytics.js';

export const generateSalesReport = async (startDate, endDate, filters = {}) => {
  let sales = await getSalesByDateRange(startDate, endDate);
  
  if (filters.cashier) {
    sales = sales.filter(s => s.cashier === filters.cashier);
  }
  if (filters.paymentMethod) {
    sales = sales.filter(s => s.payment_method === filters.paymentMethod);
  }
  
  return sales.map(s => ({
    Folio: s.folio,
    Fecha: new Date(s.created).toLocaleString(),
    Cajero: s.cashier,
    'Método Pago': s.payment_method,
    Subtotal: s.subtotal,
    IVA: s.tax_total,
    Total: s.total
  }));
};

export const generateProductReport = async (startDate, endDate) => {
  const topProducts = await getTopProducts(1000, startDate, endDate);
  return topProducts.map(p => ({
    Producto: p.name,
    Cantidad: p.quantity,
    Ingresos: p.revenue
  }));
};

export const generateInventoryReport = async () => {
  const products = await pb.collection('products').getFullList({
    filter: 'active = true',
    sort: 'category,name',
    $autoCancel: false,
  });
  
  return products.map(p => ({
    SKU: p.sku,
    Producto: p.name,
    Categoría: p.category,
    Stock: p.stock,
    Costo: p.cost || 0,
    Precio: p.price,
    'Valor Total': p.stock * p.price
  }));
};

export const generateCategoryReport = async (startDate, endDate) => {
  const topProducts = await getTopProducts(1000, startDate, endDate);
  const products = await pb.collection('products').getFullList({ $autoCancel: false });
  
  const productMap = {};
  products.forEach(p => productMap[p.id] = p.category);
  
  const categories = {};
  topProducts.forEach(p => {
    const cat = productMap[p.id] || 'Sin Categoría';
    if (!categories[cat]) categories[cat] = { quantity: 0, revenue: 0 };
    categories[cat].quantity += p.quantity;
    categories[cat].revenue += p.revenue;
  });
  
  return Object.entries(categories).map(([Categoría, data]) => ({
    Categoría,
    Cantidad: data.quantity,
    Ingresos: data.revenue
  }));
};

export const generateCashierReport = async (startDate, endDate) => {
  const sales = await getSalesByDateRange(startDate, endDate);
  const cashiers = {};
  
  sales.forEach(s => {
    if (!cashiers[s.cashier]) cashiers[s.cashier] = { tickets: 0, total: 0 };
    cashiers[s.cashier].tickets += 1;
    cashiers[s.cashier].total += s.total;
  });
  
  return Object.entries(cashiers).map(([Cajero, data]) => ({
    Cajero,
    Tickets: data.tickets,
    Total: data.total,
    Promedio: data.total / data.tickets
  }));
};
