
import { queryRouter, interpretQuery } from '../ai/aiService.js';
import { formatAsText, createTable, formatAsSummary, addEmojis } from '../responseService.js';

export const parseWhatsAppMessage = (message) => {
  const { intent, parameters } = interpretQuery(message);
  return { command: intent, parameters };
};

export const generateWhatsAppResponse = (queryResult, intent) => {
  let response = '';
  
  if (Array.isArray(queryResult)) {
    if (queryResult.length === 0) return "No se encontraron resultados 🤷‍♂️";
    
    response = "Aquí tienes la información solicitada:\n\n";
    queryResult.forEach((item, index) => {
      if (intent === 'top_products') {
        response += `${index + 1}. ${item.name} - ${item.quantity} uds ($${item.revenue})\n`;
      } else if (intent === 'low_stock' || intent === 'out_of_stock') {
        response += `🔸 ${item.name} - Stock: ${item.currentStock || 0}\n`;
      } else {
        response += `🔸 ${JSON.stringify(item)}\n`;
      }
    });
  } else {
    if (intent === 'summary') {
      response = formatAsSummary(queryResult);
    } else {
      response = formatAsText(queryResult, intent);
    }
  }

  return addEmojis(response);
};

export const handleWhatsAppCommand = async (message) => {
  const { command, parameters } = parseWhatsAppMessage(message);
  
  if (command === 'unknown') {
    return "Hola 👋 Soy tu asistente virtual. Puedes preguntarme sobre:\n- Ventas de hoy\n- Top productos\n- Inventario bajo\n- Resumen ejecutivo";
  }

  try {
    const result = await queryRouter(command, parameters);
    return generateWhatsAppResponse(result, command);
  } catch (error) {
    console.error("WhatsApp handler error:", error);
    return "Lo siento, ocurrió un error al procesar tu solicitud ❌";
  }
};
