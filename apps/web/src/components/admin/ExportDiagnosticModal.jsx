
import React, { useState } from 'react';
import { FileJson, FileCode2, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateSystemDiagnostic } from '@/services/diagnosticService.js';
import { exportDiagnosticAsJSON, exportDiagnosticAsHTML, exportDiagnosticAsPDF } from '@/services/exportDiagnosticService.js';
import { toast } from 'sonner';

const ExportDiagnosticModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = async (format) => {
    setLoading(true);
    setSuccess(false);
    
    try {
      const diagnosticData = await generateSystemDiagnostic();
      
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
      
      setSuccess(true);
      toast.success(`Diagnóstico exportado exitosamente en formato ${format.toUpperCase()}`);
      
      // Close modal after short delay on success
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Error al generar el diagnóstico. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Exportar Radiografía del Sistema</DialogTitle>
          <DialogDescription>
            Descarga un diagnóstico completo del sistema. Los datos sensibles (contraseñas, tokens) son omitidos automáticamente por seguridad.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-700">¡Exportación Exitosa!</h3>
              <p className="text-muted-foreground">El archivo ha sido descargado a tu dispositivo.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            {/* JSON Option */}
            <Card className="relative overflow-hidden group hover:border-primary/50 transition-colors">
              <CardContent className="p-5 flex flex-col items-center text-center h-full">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <FileJson className="w-8 h-8 text-slate-600 dark:text-slate-300" />
                </div>
                <h3 className="font-bold mb-2">JSON</h3>
                <p className="text-xs text-muted-foreground mb-4 flex-1">
                  Formato técnico ideal para desarrolladores, integraciones y análisis de datos estructurados.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-slate-100 dark:group-hover:bg-slate-800"
                  onClick={() => handleExport('json')}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Descargar JSON'}
                </Button>
              </CardContent>
            </Card>

            {/* HTML Option */}
            <Card className="relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <CardContent className="p-5 flex flex-col items-center text-center h-full">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <FileCode2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold mb-2">HTML</h3>
                <p className="text-xs text-muted-foreground mb-4 flex-1">
                  Documento web interactivo y visual. Excelente para visualizar en cualquier navegador.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-700 dark:group-hover:text-blue-300"
                  onClick={() => handleExport('html')}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Descargar HTML'}
                </Button>
              </CardContent>
            </Card>

            {/* PDF Option */}
            <Card className="relative overflow-hidden group hover:border-red-500/50 transition-colors">
              <CardContent className="p-5 flex flex-col items-center text-center h-full">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-bold mb-2">PDF</h3>
                <p className="text-xs text-muted-foreground mb-4 flex-1">
                  Documento profesional listo para imprimir o compartir con gerencia y auditoría.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:text-red-700 dark:group-hover:text-red-300"
                  onClick={() => handleExport('pdf')}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Descargar PDF'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDiagnosticModal;
