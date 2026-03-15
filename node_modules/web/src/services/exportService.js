
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToExcel = (data, filename, sheetName = 'Sheet1') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToPDF = async (elementId, filename, title) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.setFontSize(16);
    pdf.text(title, 14, 15);
    pdf.setFontSize(10);
    pdf.text(`Generado: ${new Date().toLocaleString()}`, 14, 22);
    
    pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth - 20, pdfHeight - 20);
    pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const exportInventoryToExcel = (products) => {
  const data = products.map(p => ({
    SKU: p.sku,
    Barcode: p.barcode,
    Producto: p.name,
    Categoría: p.category,
    Costo: p.cost || 0,
    Precio: p.price,
    Stock: p.stock,
    'Valor Total': p.stock * p.price
  }));
  exportToExcel(data, 'Inventario');
};

export const exportSalesReport = (sales) => {
  const data = sales.map(s => ({
    Folio: s.folio,
    Fecha: new Date(s.created).toLocaleString(),
    Cajero: s.cashier,
    'Método Pago': s.payment_method,
    Subtotal: s.subtotal,
    IVA: s.tax_total,
    Total: s.total
  }));
  exportToExcel(data, 'Reporte_Ventas');
};
