
import pb from '@/lib/pocketbaseClient.js';

const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().replace('T', ' ');
};

const getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.toISOString().replace('T', ' ');
};

export const getSalesToday = async () => {
  try {
    const start = getStartOfDay();
    const end = getEndOfDay();
    
    const sales = await pb.collection('sales').getFullList({
      filter: `created >= "${start}" && created <= "${end}" && status = "completed"`,
      $autoCancel: false
    });

    const total = sales.reduce((sum, s) => sum + s.total, 0);
    const ticketCount = sales.length;
    const averageTicket = ticketCount > 0 ? total / ticketCount : 0;
    
    const byPaymentMethod = sales.reduce((acc, s) => {
      acc[s.payment_method] = (acc[s.payment_method] || 0) + s.total;
      return acc;
    }, {});

    return { total, ticketCount, averageTicket, byPaymentMethod };
  } catch (error) {
    console.error('Error in getSalesToday:', error);
    return { total: 0, ticketCount: 0, averageTicket: 0, byPaymentMethod: {} };
  }
};

export const getSalesSummary = async (startDate, endDate) => {
  try {
    const start = getStartOfDay(startDate);
    const end = getEndOfDay(endDate);
    
    const sales = await pb.collection('sales').getFullList({
      filter: `created >= "${start}" && created <= "${end}" && status = "completed"`,
      $autoCancel: false
    });

    const total = sales.reduce((sum, s) => sum + s.total, 0);
    const ticketCount = sales.length;
    const average = ticketCount > 0 ? total / ticketCount : 0;

    return { total, ticketCount, average, comparison: 0 };
  } catch (error) {
    console.error('Error in getSalesSummary:', error);
    return { total: 0, ticketCount: 0, average: 0, comparison: 0 };
  }
};

export const getTopProducts = async (limit = 10) => {
  try {
    const items = await pb.collection('sale_items').getFullList({
      $autoCancel: false
    });

    const productMap = {};
    let totalRevenue = 0;

    items.forEach(item => {
      if (!productMap[item.product_id]) {
        productMap[item.product_id] = { name: item.product_name, quantity: 0, revenue: 0 };
      }
      productMap[item.product_id].quantity += item.quantity;
      productMap[item.product_id].revenue += item.line_total;
      totalRevenue += item.line_total;
    });

    return Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit)
      .map(p => ({
        ...p,
        percentage: totalRevenue > 0 ? ((p.revenue / totalRevenue) * 100).toFixed(2) : 0
      }));
  } catch (error) {
    console.error('Error in getTopProducts:', error);
    return [];
  }
};

export const getLowStockProducts = async (threshold = 5) => {
  try {
    const products = await pb.collection('products').getFullList({
      filter: `stock <= ${threshold} && stock > 0 && active = true`,
      $autoCancel: false
    });
    return products.map(p => ({
      name: p.name,
      currentStock: p.stock,
      minimumStock: threshold,
      difference: threshold - p.stock
    }));
  } catch (error) {
    console.error('Error in getLowStockProducts:', error);
    return [];
  }
};

export const getOutOfStockProducts = async () => {
  try {
    const products = await pb.collection('products').getFullList({
      filter: `stock <= 0 && active = true`,
      $autoCancel: false
    });
    return products.map(p => ({
      name: p.name,
      lastSale: 'Desconocido', // Would require complex join in PB
      daysWithoutStock: 0
    }));
  } catch (error) {
    console.error('Error in getOutOfStockProducts:', error);
    return [];
  }
};

export const getInventoryValue = async () => {
  try {
    const products = await pb.collection('products').getFullList({
      filter: `active = true && stock > 0`,
      $autoCancel: false
    });
    
    let byCost = 0;
    let bySellingPrice = 0;

    products.forEach(p => {
      byCost += (p.cost || 0) * p.stock;
      bySellingPrice += (p.price || 0) * p.stock;
    });

    return { byCost, bySellingPrice, difference: bySellingPrice - byCost };
  } catch (error) {
    console.error('Error in getInventoryValue:', error);
    return { byCost: 0, bySellingPrice: 0, difference: 0 };
  }
};

export const getAverageTicket = async (startDate, endDate) => {
  try {
    const start = getStartOfDay(startDate);
    const end = getEndOfDay(endDate);
    
    const sales = await pb.collection('sales').getFullList({
      filter: `created >= "${start}" && created <= "${end}" && status = "completed"`,
      $autoCancel: false
    });

    if (sales.length === 0) return { average: 0, minimum: 0, maximum: 0 };

    const totals = sales.map(s => s.total);
    const average = totals.reduce((a, b) => a + b, 0) / totals.length;
    const minimum = Math.min(...totals);
    const maximum = Math.max(...totals);

    return { average, minimum, maximum };
  } catch (error) {
    console.error('Error in getAverageTicket:', error);
    return { average: 0, minimum: 0, maximum: 0 };
  }
};

export const getSalesByCashier = async (startDate, endDate) => {
  try {
    const start = getStartOfDay(startDate);
    const end = getEndOfDay(endDate);
    
    const sales = await pb.collection('sales').getFullList({
      filter: `created >= "${start}" && created <= "${end}" && status = "completed"`,
      $autoCancel: false
    });

    const cashiers = {};
    sales.forEach(s => {
      if (!cashiers[s.cashier]) cashiers[s.cashier] = { totalSales: 0, ticketCount: 0 };
      cashiers[s.cashier].totalSales += s.total;
      cashiers[s.cashier].ticketCount += 1;
    });

    return Object.entries(cashiers).map(([cashierName, data]) => ({
      cashierName,
      totalSales: data.totalSales,
      ticketCount: data.ticketCount,
      average: data.ticketCount > 0 ? data.totalSales / data.ticketCount : 0
    }));
  } catch (error) {
    console.error('Error in getSalesByCashier:', error);
    return [];
  }
};

export const getProductsWithoutMovement = async (days = 30) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const startStr = getStartOfDay(date);

    const recentSales = await pb.collection('sale_items').getFullList({
      filter: `created >= "${startStr}"`,
      $autoCancel: false
    });
    
    const soldProductIds = new Set(recentSales.map(s => s.product_id));
    
    const allProducts = await pb.collection('products').getFullList({
      filter: `active = true && stock > 0`,
      $autoCancel: false
    });

    return allProducts
      .filter(p => !soldProductIds.has(p.id))
      .map(p => ({
        name: p.name,
        lastSale: 'Hace más de ' + days + ' días',
        daysWithoutMovement: days,
        stock: p.stock
      }));
  } catch (error) {
    console.error('Error in getProductsWithoutMovement:', error);
    return [];
  }
};

export const getSalesTrend = async (days = 7) => {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days + 1);
    
    const startStr = getStartOfDay(start);
    const endStr = getEndOfDay(end);

    const sales = await pb.collection('sales').getFullList({
      filter: `created >= "${startStr}" && created <= "${endStr}" && status = "completed"`,
      $autoCancel: false
    });

    const trend = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      trend[d.toISOString().split('T')[0]] = { total: 0, ticketCount: 0 };
    }

    sales.forEach(s => {
      const dateStr = s.created.split(' ')[0];
      if (trend[dateStr]) {
        trend[dateStr].total += s.total;
        trend[dateStr].ticketCount += 1;
      }
    });

    return Object.entries(trend).map(([date, data]) => ({
      date,
      total: data.total,
      ticketCount: data.ticketCount
    }));
  } catch (error) {
    console.error('Error in getSalesTrend:', error);
    return [];
  }
};

export const getInventoryByCategory = async () => {
  try {
    const products = await pb.collection('products').getFullList({
      filter: `active = true`,
      $autoCancel: false
    });

    const categories = {};
    let totalValue = 0;

    products.forEach(p => {
      const cat = p.category || 'Sin Categoría';
      if (!categories[cat]) categories[cat] = { quantity: 0, value: 0 };
      categories[cat].quantity += p.stock;
      const val = (p.price || 0) * p.stock;
      categories[cat].value += val;
      totalValue += val;
    });

    return Object.entries(categories).map(([category, data]) => ({
      category,
      quantity: data.quantity,
      value: data.value,
      percentage: totalValue > 0 ? ((data.value / totalValue) * 100).toFixed(2) : 0
    }));
  } catch (error) {
    console.error('Error in getInventoryByCategory:', error);
    return [];
  }
};

export const getExecutiveSummary = async () => {
  const [salesToday, inventory, lowStock, topProducts] = await Promise.all([
    getSalesToday(),
    getInventoryValue(),
    getLowStockProducts(5),
    getTopProducts(5)
  ]);

  return {
    sales: salesToday,
    inventory,
    alerts: { lowStockCount: lowStock.length },
    topProducts,
    lowStockProducts: lowStock
  };
};
