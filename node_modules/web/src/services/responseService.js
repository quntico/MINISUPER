
export const addEmojis = (text) => {
  const emojiMap = {
    'ventas': '💰',
    'total': '💵',
    'ticket': '🧾',
    'producto': '📦',
    'stock': '📊',
    'agotado': '❌',
    'alerta': '⚠️',
    'resumen': '📋'
  };
  
  let result = text;
  Object.entries(emojiMap).forEach(([word, emoji]) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, `${word} ${emoji}`);
  });
  return result;
};

export const formatAsText = (data, intent) => {
  if (!data) return "Sin datos.";

  const formatCurrency = (val) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);

  switch (intent) {
    case 'sales_today':
      return `Hoy se han realizado ${data.ticketCount} ventas, sumando un total de ${formatCurrency(data.total)}. El ticket promedio es de ${formatCurrency(data.averageTicket)}.`;
    case 'inventory_value':
      return `El valor actual del inventario es de ${formatCurrency(data.byCost)} (costo) y ${formatCurrency(data.bySellingPrice)} (precio de venta).`;
    case 'average_ticket':
      return `El ticket promedio es de ${formatCurrency(data.average)}. (Mínimo: ${formatCurrency(data.minimum)}, Máximo: ${formatCurrency(data.maximum)})`;
    default:
      return JSON.stringify(data, null, 2);
  }
};

export const createTable = (data, columns) => {
  if (!data || data.length === 0) return "No hay datos para mostrar.";
  
  const headers = columns.join(' | ');
  const separator = columns.map(() => '---').join(' | ');
  
  const rows = data.map(row => {
    return columns.map(col => {
      const val = row[col];
      if (typeof val === 'number' && (col.toLowerCase().includes('revenue') || col.toLowerCase().includes('price') || col.toLowerCase().includes('cost'))) {
        return `$${val.toFixed(2)}`;
      }
      return val;
    }).join(' | ');
  });

  return `${headers}\n${separator}\n${rows.join('\n')}`;
};

export const formatAsTable = (data, columns) => {
  return createTable(data, columns);
};

export const formatAsJSON = (data) => {
  return JSON.stringify(data, null, 2);
};

export const formatAsSummary = (data) => {
  const formatCurrency = (val) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);
  
  let summary = "📊 **Resumen Ejecutivo**\n\n";
  
  if (data.sales) {
    summary += `💰 **Ventas:** ${formatCurrency(data.sales.total)} (${data.sales.ticketCount} tickets)\n`;
  }
  if (data.inventory) {
    summary += `📦 **Valor Inventario:** ${formatCurrency(data.inventory.byCost)}\n`;
  }
  if (data.top && data.top.length > 0) {
    summary += `\n⭐ **Top Producto:** ${data.top[0].name} (${data.top[0].quantity} uds)\n`;
  }
  
  return summary;
};
