
import { 
  getSalesToday, 
  getTopProducts, 
  getLowStockProducts, 
  getOutOfStockProducts, 
  getInventoryValue,
  getAverageTicket
} from '../intelligence/queryService.js';
import { formatAsText, formatAsTable, formatAsSummary } from '../responseService.js';

export const interpretQuery = (question) => {
  const q = question.toLowerCase();
  
  if (q.includes('venta') && (q.includes('hoy') || q.includes('dia') || q.includes('día'))) {
    return { intent: 'sales_today', parameters: {}, confidence: 0.9 };
  }
  if (q.includes('top') || q.includes('mas vendidos') || q.includes('más vendidos')) {
    return { intent: 'top_products', parameters: { limit: 5 }, confidence: 0.8 };
  }
  if (q.includes('bajo') && (q.includes('stock') || q.includes('inventario'))) {
    return { intent: 'low_stock', parameters: { threshold: 5 }, confidence: 0.9 };
  }
  if (q.includes('agotado') || q.includes('sin stock')) {
    return { intent: 'out_of_stock', parameters: {}, confidence: 0.9 };
  }
  if (q.includes('valor') && q.includes('inventario')) {
    return { intent: 'inventory_value', parameters: {}, confidence: 0.9 };
  }
  if (q.includes('ticket promedio')) {
    return { intent: 'average_ticket', parameters: {}, confidence: 0.9 };
  }
  if (q.includes('resumen') || q.includes('ejecutivo')) {
    return { intent: 'summary', parameters: {}, confidence: 0.8 };
  }

  return { intent: 'unknown', parameters: {}, confidence: 0 };
};

export const queryRouter = async (intent, parameters) => {
  switch (intent) {
    case 'sales_today':
      return await getSalesToday();
    case 'top_products':
      return await getTopProducts(parameters.limit || 5);
    case 'low_stock':
      return await getLowStockProducts(parameters.threshold || 5);
    case 'out_of_stock':
      return await getOutOfStockProducts();
    case 'inventory_value':
      return await getInventoryValue();
    case 'average_ticket':
      const today = new Date();
      return await getAverageTicket(today, today);
    case 'summary':
      const sales = await getSalesToday();
      const top = await getTopProducts(3);
      const inv = await getInventoryValue();
      return { sales, top, inventory: inv };
    default:
      return null;
  }
};

export const generateResponse = (queryResult, intent, format = 'text') => {
  if (!queryResult) return "Lo siento, no pude entender la consulta o no hay datos disponibles.";

  if (format === 'table' && Array.isArray(queryResult)) {
    if (intent === 'top_products') return formatAsTable(queryResult, ['name', 'quantity', 'revenue']);
    if (intent === 'low_stock') return formatAsTable(queryResult, ['name', 'currentStock', 'minimumStock']);
  }

  if (format === 'summary' || intent === 'summary') {
    return formatAsSummary(queryResult);
  }

  return formatAsText(queryResult, intent);
};

export const processQuery = async (question) => {
  const { intent, parameters, confidence } = interpretQuery(question);
  
  if (confidence < 0.5) {
    return {
      success: false,
      message: "No estoy seguro de lo que necesitas. Intenta preguntar sobre 'ventas de hoy', 'productos agotados' o 'top productos'.",
      data: null
    };
  }

  try {
    const data = await queryRouter(intent, parameters);
    const format = Array.isArray(data) ? 'table' : 'text';
    const responseText = generateResponse(data, intent, format);
    
    return {
      success: true,
      intent,
      message: responseText,
      data,
      format
    };
  } catch (error) {
    console.error("Error processing query:", error);
    return {
      success: false,
      message: "Ocurrió un error al procesar tu consulta.",
      data: null
    };
  }
};
