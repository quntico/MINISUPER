
import React from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateInventoryExcelFromQuery, generateSalesExcelFromQuery } from '@/services/exportFromQueryService.js';
import { toast } from 'sonner';

const ExportButtons = () => {
  
  const handleExportInventory = async () => {
    try {
      await generateInventoryExcelFromQuery();
      toast.success('Inventario exportado correctamente');
    } catch (e) {
      toast.error('Error al exportar inventario');
    }
  };

  const handleExportSales = async () => {
    try {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      await generateSalesExcelFromQuery(lastWeek, today);
      toast.success('Ventas exportadas correctamente');
    } catch (e) {
      toast.error('Error al exportar ventas');
    }
  };

  return (
    <Card className="shadow-sm border-border/50">
      <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex-1 justify-start h-12" onClick={handleExportInventory}>
          <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
          Excel Inventario
        </Button>
        <Button variant="outline" className="flex-1 justify-start h-12" onClick={handleExportSales}>
          <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
          Excel Ventas (7d)
        </Button>
        <Button variant="outline" className="flex-1 justify-start h-12" onClick={() => toast.info('Generando PDF...')}>
          <FileText className="w-4 h-4 mr-2 text-red-500" />
          Reporte PDF
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportButtons;
