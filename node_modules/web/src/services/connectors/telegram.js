
import { queryRouter, interpretQuery } from '../ai/aiService.js';
import { formatAsText, createTable, formatAsSummary, addEmojis } from '../responseService.js';

export const parseTelegramMessage = (message) => {
  // Handle explicit slash commands
  if (message.startsWith('/')) {
    const cmd = message.split(' ')[0].substring(1).toLowerCase();
    const intentMap = {
      'ventas': 'sales_today',
      'topproductos': 'top_products',
      'inventario_bajo': 'low_stock',
      'agotados': 'out_of_stock',
      'resumen': 'summary'
    };
    return { command: intentMap[cmd] || 'unknown', parameters: {} };
  }
  
  // Fallback to NLP
  const { intent, parameters } = interpretQuery(message);
  return { command: intent, parameters };
};

export const generateTelegramResponse = (queryResult, intent) => {
  let response = '';
  
  if (Array.isArray(queryResult)) {
    if (queryResult.length === 0) return "No se encontraron resultados.";
    
    // Use markdown code blocks for tables in Telegram
    let columns = [];
    if (intent === 'top_products') columns = ['name', 'quantity', 'revenue'];
    else if (intent === 'low_stock') columns = ['name', 'currentStock'];
    else columns = Object.keys(queryResult[0]).slice(0, 3);
    
    response = `\`\`\`\n${createTable(queryResult, columns)}\n\`\`\``;
  } else {
    if (intent === 'summary') {
      response = formatAsSummary(queryResult);
    } else {
      response = formatAsText(queryResult, intent);
    }
  }

  return addEmojis(response);
};

export const handleTelegramCommand = async (message) => {
  const { command, parameters } = parseTelegramMessage(message);
  
  if (command === 'unknown') {
    return "Comandos disponibles:\n/ventas - Ventas de hoy\n/topproductos - Más vendidos\n/inventario_bajo - Stock crítico\n/resumen - Resumen ejecutivo";
  }

  try {
    const result = await queryRouter(command, parameters);
    return generateTelegramResponse(result, command);
  } catch (error) {
    console.error("Telegram handler error:", error);
    return "Error al procesar el comando.";
  }
};
