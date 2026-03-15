
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { getInventoryByCategory, getSalesSummary } from './intelligence/queryService.js';

export const exportQueryResultToExcel = (queryResult, filename) => {
  if (!queryResult || !Array.isArray(queryResult) || queryResult.length === 0) return;
  
  const worksheet = XLSX.utils.json_to_sheet(queryResult);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados');
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportQueryResultToPDF = (queryResult, filename, title) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  pdf.setFontSize(16);
  pdf.text(title, 14, 15);
  pdf.setFontSize(10);
  pdf.text(`Generado: ${new Date().toLocaleString()}`, 14, 22);
  
  let yPos = 35;
  
  if (Array.isArray(queryResult)) {
    queryResult.forEach((item, i) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      const text = Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(' | ');
      pdf.text(`${i+1}. ${text}`, 14, yPos);
      yPos += 7;
    });
  } else {
    const lines = pdf.splitTextToSize(JSON.stringify(queryResult, null, 2), 180);
    pdf.text(lines, 14, yPos);
  }
  
  pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateInventoryExcelFromQuery = async () => {
  const data = await getInventoryByCategory();
  exportQueryResultToExcel(data, 'Inventario_Categorias');
};

export const generateSalesExcelFromQuery = async (startDate, endDate) => {
  const data = await getSalesSummary(startDate, endDate);
  exportQueryResultToExcel([data], 'Resumen_Ventas');
};
