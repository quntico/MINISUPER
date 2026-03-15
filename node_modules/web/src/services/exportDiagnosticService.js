
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateDiagnosticHTML } from '../templates/diagnosticTemplate.js';

const getFilename = (extension) => {
  const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
  return `minisuper-diagnostic-${timestamp}.${extension}`;
};

export const exportDiagnosticAsJSON = (diagnostic) => {
  const dataStr = JSON.stringify(diagnostic, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = getFilename('json');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportDiagnosticAsHTML = (diagnostic) => {
  const htmlContent = generateDiagnosticHTML(diagnostic);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = getFilename('html');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportDiagnosticAsPDF = async (diagnostic) => {
  // Create a temporary container to render the HTML
  const container = document.createElement('div');
  container.innerHTML = generateDiagnosticHTML(diagnostic);
  
  // Style the container for PDF rendering (fixed width, hidden from view)
  Object.assign(container.style, {
    position: 'absolute',
    left: '-9999px',
    top: '0',
    width: '1000px',
    backgroundColor: '#f8fafc',
    padding: '20px'
  });
  
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { 
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    let heightLeft = pdfHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    // Add subsequent pages if content overflows
    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(getFilename('pdf'));
  } finally {
    document.body.removeChild(container);
  }
};
