
import pb from '@/lib/pocketbase.js';

const formatDateForPB = (date, endOfDay = false) => {
  const d = new Date(date);
  if (endOfDay) {
    d.setHours(23, 59, 59, 999);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  return d.toISOString().replace('T', ' ');
};

export const getSalesByDateRange = async (startDate, endDate) => {
  try {
    const startStr = formatDateForPB(startDate);
    const endStr = formatDateForPB(endDate, true);

    return await pb.collection('sales').getFullList({
      filter: `created >= "${startStr}" && created <= "${endStr}" && status = "completed"`,
      sort: '-created',
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error fetching sales by date range:', error);
    return [];
  }
};

export const getDailySales = async (date = new Date()) => {
  return await getSalesByDateRange(date, date);
};

export const getSalesByCashier = async (cashierName, startDate, endDate) => {
  try {
    const startStr = formatDateForPB(startDate);
    const endStr = formatDateForPB(endDate, true);

    return await pb.collection('sales').getFullList({
      filter: `created >= "${startStr}" && created <= "${endStr}" && cashier = "${cashierName}" && status = "completed"`,
      sort: '-created',
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error fetching sales by cashier:', error);
    return [];
  }
};

export const getSalesByPaymentMethod = async (startDate, endDate) => {
  const sales = await getSalesByDateRange(startDate, endDate);
  const breakdown = { Efectivo: 0, Tarjeta: 0, Transferencia: 0 };
  
  sales.forEach(sale => {
    if (breakdown[sale.payment_method] !== undefined) {
      breakdown[sale.payment_method] += sale.total;
    } else {
      breakdown[sale.payment_method] = sale.total;
    }
  });
  
  return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
};

export const getTotalSalesAmount = async (startDate, endDate) => {
  const sales = await getSalesByDateRange(startDate, endDate);
  return sales.reduce((sum, sale) => sum + sale.total, 0);
};

export const getTicketCount = async (startDate, endDate) => {
  const sales = await getSalesByDateRange(startDate, endDate);
  return sales.length;
};

export const getAverageTicket = async (startDate, endDate) => {
  const sales = await getSalesByDateRange(startDate, endDate);
  if (sales.length === 0) return 0;
  const total = sales.reduce((sum, sale) => sum + sale.total, 0);
  return total / sales.length;
};
