
import { getDailySales, getAverageTicket, getTicketCount, getSalesByPaymentMethod } from './analytics/salesAnalytics.js';
import { getTopProducts } from './analytics/productAnalytics.js';
import { getInventoryStatus, getLowStockProducts, getInventoryValue } from './analytics/inventoryAnalytics.js';

export const getExecutiveSummary = async () => {
  const today = new Date();
  const sales = await getDailySales(today);
  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const ticketCount = sales.length;
  const averageTicket = ticketCount > 0 ? totalSales / ticketCount : 0;
  
  const topProducts = await getTopProducts(5, today, today);
  const inventoryStatus = await getInventoryStatus();
  const lowStock = await getLowStockProducts(5);
  
  return {
    todaySales: totalSales,
    ticketCount,
    averageTicket,
    topProducts,
    inventoryStatus,
    alerts: {
      lowStockCount: lowStock.length,
      outOfStockCount: inventoryStatus.outOfStock
    }
  };
};

export const getSalesSummary = async (startDate, endDate) => {
  const sales = await getDailySales(startDate); // Simplified for range
  const total = sales.reduce((sum, s) => sum + s.total, 0);
  const count = sales.length;
  const average = count > 0 ? total / count : 0;
  const paymentMethods = await getSalesByPaymentMethod(startDate, endDate);
  
  return { total, count, average, paymentMethods };
};
