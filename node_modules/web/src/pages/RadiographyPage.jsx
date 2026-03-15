
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Activity, 
  Server, 
  Database, 
  Box, 
  DollarSign, 
  Wifi, 
  Clock, 
  CheckCircle2,
  FileJson,
  FileCode2,
  FileText,
  Loader2,
  Search,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateSystemDiagnostic } from '@/services/diagnosticService.js';
import { exportDiagnosticAsJSON, exportDiagnosticAsHTML, exportDiagnosticAsPDF } from '@/services/exportDiagnosticService.js';

const RadiographyPage = () => {
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await generateSystemDiagnostic();
        setDiagnosticData(data);
      } catch (error) {
        toast.error('Error al cargar los datos de diagnóstico');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleExport = async (format) => {
    if (!diagnosticData) return;
    
    setExporting(format);
    try {
      switch (format) {
        case 'json':
          exportDiagnosticAsJSON(diagnosticData);
          break;
        case 'html':
          exportDiagnosticAsHTML(diagnosticData);
          break;
        case 'pdf':
          await exportDiagnosticAsPDF(diagnosticData);
          break;
        default:
          throw new Error('Formato no soportado');
      }
      toast.success(`Diagnóstico exportado exitosamente en formato ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Error al generar el diagnóstico. Intente nuevamente.');
    } finally {
      setExporting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Analizando sistema...</p>
      </div>
    );
  }

  if (!diagnosticData) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <Activity className="w-12 h-12 text-destructive opacity-50" />
        <p className="text-muted-foreground font-medium">No se pudo cargar la información del sistema.</p>
      </div>
    );
  }

  const formatCurrency = (val) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);
  const formatDate = (dateStr) => new Date(dateStr).toLocaleString('es-MX');

  const activeModulesCount = Object.values(diagnosticData.modules).filter(m => m.status === 'active').length;

  return (
    <>
      <Helmet>
        <title>Radiografía del Sistema - MINISUPER</title>
      </Helmet>

      <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-balance">
              <Search className="w-8 h-8 text-primary" />
              Radiografía del Sistema
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-balance">
              Diagnóstico completo del estado actual, configuración, módulos activos y estadísticas generales. 
              Los datos sensibles han sido omitidos por seguridad.
            </p>
          </div>
        </div>

        {/* Export Options */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Opciones de Exportación</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden group hover:border-slate-500/50 transition-all duration-300 hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  <FileJson className="w-8 h-8 text-slate-600 dark:text-slate-300" />
                </div>
                <h3 className="font-bold text-lg mb-2">Formato JSON</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">
                  Formato técnico ideal para desarrolladores, integraciones y análisis de datos estructurados.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors"
                  onClick={() => handleExport('json')}
                  disabled={exporting !== null}
                >
                  {exporting === 'json' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {exporting === 'json' ? 'Generando...' : 'Descargar JSON'}
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300 hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  <FileCode2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Formato HTML</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">
                  Documento web interactivo y visual. Excelente para visualizar en cualquier navegador.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
                  onClick={() => handleExport('html')}
                  disabled={exporting !== null}
                >
                  {exporting === 'html' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {exporting === 'html' ? 'Generando...' : 'Descargar HTML'}
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:border-red-500/50 transition-all duration-300 hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Formato PDF</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">
                  Documento profesional listo para imprimir o compartir con gerencia y auditoría.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors"
                  onClick={() => handleExport('pdf')}
                  disabled={exporting !== null}
                >
                  {exporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {exporting === 'pdf' ? 'Generando...' : 'Descargar PDF'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* System Information KPIs */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Información General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                  <Server className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Versión del Sistema</p>
                  <p className="text-xl font-bold">{diagnosticData.metadata.version}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl shrink-0">
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entorno</p>
                  <p className="text-xl font-bold capitalize">{diagnosticData.metadata.environment}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl shrink-0">
                  <Cpu className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Módulos Activos</p>
                  <p className="text-xl font-bold">{activeModulesCount} / {Object.keys(diagnosticData.modules).length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl shrink-0">
                  <Wifi className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado Conexión</p>
                  <p className="text-xl font-bold capitalize">{diagnosticData.connections.internet.status}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl shrink-0">
                  <Box className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Productos</p>
                  <p className="text-xl font-bold">{diagnosticData.statistics.totalProducts}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-rose-500/10 rounded-xl shrink-0">
                  <DollarSign className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ventas Registradas</p>
                  <p className="text-xl font-bold">{diagnosticData.statistics.totalSales}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl shrink-0">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor Inventario</p>
                  <p className="text-xl font-bold">{formatCurrency(diagnosticData.statistics.inventoryValue)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-slate-500/10 rounded-xl shrink-0">
                  <Clock className="w-6 h-6 text-slate-600" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-muted-foreground">Última Actualización</p>
                  <p className="text-sm font-bold truncate mt-1">{formatDate(diagnosticData.maintenance.lastUpdate)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technical Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              Stack Tecnológico
            </h2>
            <Card className="shadow-sm border-border/50 h-full">
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {Object.entries(diagnosticData.technology).map(([key, value]) => (
                    <li key={key} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                      <span className="text-muted-foreground capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <Badge variant="secondary" className="font-mono text-xs">{value}</Badge>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-6 border-t border-border/50">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Seguridad
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Autenticación</span>
                      <span className="text-sm font-medium">{diagnosticData.security.authentication}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Conexión Segura (HTTPS)</span>
                      <Badge variant={diagnosticData.security.https ? "default" : "destructive"} className={diagnosticData.security.https ? "bg-emerald-500" : ""}>
                        {diagnosticData.security.https ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Box className="w-5 h-5 text-primary" />
              Módulos del Sistema
            </h2>
            <Card className="shadow-sm border-border/50 h-full">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(diagnosticData.modules).map(([key, module]) => (
                    <div key={key} className="p-4 rounded-xl border border-border/50 bg-muted/30 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold capitalize text-sm mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {module.features.join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

      </div>
    </>
  );
};

export default RadiographyPage;
