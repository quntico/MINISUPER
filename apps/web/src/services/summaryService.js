
import { getSalesToday, getTopProducts, getLowStockProducts, getAverageTicket } from './intelligence/queryService.js';
import { formatAsSummary } from './responseService.js';

export const generateDailySummary = async () => {
  const sales = await getSalesToday();
  const top = await getTopProducts(3);
  const lowStock = await getLowStockProducts(5);
  
  return {
    title: "Resumen Diario",
    date: new Date().toLocaleDateString(),
    metrics: {
      salesTotal: sales.total,
      ticketCount: sales.ticketCount,
      averageTicket: sales.averageTicket
    },
    highlights: top,
    alertsCount: lowStock.length,
    recommendation: sales.total < 1000 ? "Considera lanzar una promoción rápida para aumentar el flujo." : "Excelente ritmo de ventas. Asegura el stock de los productos top."
  };
};

export const generateExecutiveSummary = async () => {
  const daily = await generateDailySummary();
  return formatAsSummary({
    sales: { total: daily.metrics.salesTotal, ticketCount: daily.metrics.ticketCount },
    top: daily.highlights
  });
};
