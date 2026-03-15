
import { 
  getLowStockProducts, 
  getOutOfStockProducts, 
  getProductsWithoutMovement, 
  getSalesToday, 
  getInventoryValue 
} from './intelligence/queryService.js';
import pb from '@/lib/pocketbaseClient.js';

export const checkLowStockProducts = async () => {
  const products = await getLowStockProducts(5);
  if (products.length === 0) return null;
  return {
    id: 'low_stock_' + Date.now(),
    type: 'low_stock',
    severity: 'warning',
    message: `Hay ${products.length} productos con stock bajo (<= 5 unidades).`,
    data: products
  };
};

export const checkOutOfStockProducts = async () => {
  const products = await getOutOfStockProducts();
  if (products.length === 0) return null;
  return {
    id: 'out_of_stock_' + Date.now(),
    type: 'out_of_stock',
    severity: 'critical',
    message: `Hay ${products.length} productos agotados que requieren reabastecimiento.`,
    data: products
  };
};

export const checkProductsWithoutMovement = async (days = 30) => {
  const products = await getProductsWithoutMovement(days);
  if (products.length === 0) return null;
  return {
    id: 'no_movement_' + Date.now(),
    type: 'no_movement',
    severity: 'info',
    message: `Hay ${products.length} productos sin movimiento en los últimos ${days} días.`,
    data: products
  };
};

export const checkLowSales = async (threshold = 500) => {
  const today = await getSalesToday();
  // Only alert if it's late in the day and sales are low
  const hour = new Date().getHours();
  if (hour > 18 && today.total < threshold) {
    return {
      id: 'low_sales_' + Date.now(),
      type: 'low_sales',
      severity: 'warning',
      message: `Las ventas de hoy (${today.total}) están por debajo del umbral esperado (${threshold}).`,
      data: today
    };
  }
  return null;
};

export const checkCashDifference = async () => {
  try {
    const registers = await pb.collection('cash_registers').getFullList({
      filter: `status = "closed"`,
      sort: '-closed_at',
      limit: 5,
      $autoCancel: false
    });
    
    const discrepancies = registers.filter(r => Math.abs(r.difference) > 50);
    if (discrepancies.length > 0) {
      return {
        id: 'cash_difference_' + Date.now(),
        type: 'cash_difference',
        severity: 'critical',
        message: `Se detectaron diferencias significativas en cortes de caja recientes.`,
        data: discrepancies
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const checkInventoryValue = async (threshold = 10000) => {
  const value = await getInventoryValue();
  if (value.byCost < threshold) {
    return {
      id: 'low_inventory_value_' + Date.now(),
      type: 'low_inventory_value',
      severity: 'warning',
      message: `El valor del inventario ($${value.byCost}) está por debajo del mínimo recomendado ($${threshold}).`,
      data: value
    };
  }
  return null;
};

export const generateAlerts = async () => {
  const checks = await Promise.all([
    checkOutOfStockProducts(),
    checkLowStockProducts(),
    checkCashDifference(),
    checkLowSales(),
    checkInventoryValue(),
    checkProductsWithoutMovement()
  ]);

  return checks.filter(alert => alert !== null);
};
