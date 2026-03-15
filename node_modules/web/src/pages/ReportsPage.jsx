
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FileText, Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { generateSalesReport, generateProductReport, generateInventoryReport, generateCategoryReport, generateCashierReport } from '@/services/reportService.js';
import { exportToExcel, exportToPDF } from '@/services/exportService.js';
import { formatCurrency } from '@/utils/formatters.js';

const reportTypes = [
  { id: 'sales', name: 'Ventas por Fecha' },
  { id: 'products', name: 'Ventas por Producto' },
  { id: 'categories', name: 'Ventas por Categoría' },
  { id: 'cashiers', name: 'Ventas por Cajero' },
  { id: 'inventory', name: 'Inventario Actual' },
];

const ReportsPage = () => {
  const [reportType, setReportType] = useState('sales');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      let result = [];
      const start = new Date(startDate);
      const end = new Date(endDate);

      switch (reportType) {
        case 'sales':
          result = await generateSalesReport(start, end);
          break;
        case 'products':
          result = await generateProductReport(start, end);
          break;
        case 'categories':
          result = await generateCategoryReport(start, end);
          break;
        case 'cashiers':
          result = await generateCashierReport(start, end);
          break;
        case 'inventory':
          result = await generateInventoryReport();
          break;
      }
      setData(result);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (data.length === 0) return;
    exportToExcel(data, `Reporte_${reportType}`);
  };

  const handleExportPDF = () => {
    if (data.length === 0) return;
    exportToPDF('report-table-container', `Reporte_${reportType}`, `Reporte: ${reportTypes.find(r => r.id === reportType)?.name}`);
  };

  return (
    <>
      <Helmet>
        <title>Reportes - MINISUPER</title>
      </Helmet>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
            <p className="text-muted-foreground">Genera y exporta información del negocio</p>
          </div>
        </div>

        <Card className="shadow-sm border-border/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Tipo de Reporte</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecciona un reporte" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {reportType !== 'inventory' && (
                <>
                  <div className="space-y-2">
                    <Label>Fecha Inicio</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha Fin</Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-background" />
                  </div>
                </>
              )}

              <Button className="w-full md:w-auto" onClick={handleGenerate} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                Generar
              </Button>
            </div>
          </CardContent>
        </Card>

        {data.length > 0 && (
          <Card className="shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Resultados ({data.length} registros)</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportExcel}>
                  <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                  <Download className="w-4 h-4 mr-2 text-red-500" />
                  PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div id="report-table-container" className="rounded-md border overflow-x-auto bg-card">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      {Object.keys(data[0]).map((key) => (
                        <TableHead key={key} className="font-semibold">{key}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, i) => (
                      <TableRow key={i} className="hover:bg-muted/30">
                        {Object.entries(row).map(([key, value], j) => (
                          <TableCell key={j}>
                            {typeof value === 'number' && (key.includes('Total') || key.includes('Ingresos') || key.includes('Precio') || key.includes('Costo') || key.includes('Subtotal') || key.includes('IVA') || key.includes('Promedio')) 
                              ? formatCurrency(value) 
                              : value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default ReportsPage;
