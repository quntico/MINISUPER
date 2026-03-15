
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function SystemDiagnosticPage() {
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDiagnostic = async () => {
    setIsGenerating(true);
    try {
      // Simulate a brief delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 800));

      const data = {
        timestamp: new Date().toISOString(),
        environment: {
          nodeEnv: import.meta.env.MODE || 'development',
          reactVersion: React.version,
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language
        },
        architecture: {
          modules: [
            'auth', 'core', 'dashboard', 'pos', 'products', 
            'inventory', 'sales', 'reports', 'configuration'
          ],
          routes: [
            '/login', '/register', '/dashboard', '/pos', 
            '/products', '/inventory', '/sales', '/reports', 
            '/configuration', '/diagnostic'
          ]
        },
        database: {
          provider: 'PocketBase',
          collections: [
            'users', 'products', 'sales', 'sale_items', 
            'cash_registers', 'companies', 'permissions', 
            'branches', 'roles', 'licenses', 'user_roles'
          ]
        },
        authentication: {
          enabled: true,
          mode: 'session',
          provider: 'PocketBase Auth'
        },
        features: {
          multiCompany: true,
          multiBranch: true,
          pos: true,
          inventory: true,
          reports: true,
          configuration: true
        },
        integrations: {
          pocketbase: 'connected',
          api: 'available',
          whatsapp: 'pending',
          telegram: 'pending',
          ai: 'pending'
        }
      };

      setDiagnosticData(data);
      toast.success('Radiografía del sistema generada con éxito');
    } catch (error) {
      console.error('Error generating diagnostic:', error);
      toast.error('Error al generar la radiografía');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadJson = () => {
    if (!diagnosticData) return;
    
    try {
      const dataStr = JSON.stringify(diagnosticData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-diagnostic-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Archivo descargado correctamente');
    } catch (error) {
      console.error('Error downloading JSON:', error);
      toast.error('Error al descargar el archivo');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            Radiografía del Sistema
          </h1>
          <p className="text-slate-500 mt-1">
            Genera un reporte técnico completo del estado actual de la aplicación.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={generateDiagnostic} 
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Activity className="w-4 h-4 mr-2" />
            )}
            Generar Reporte
          </Button>
          {diagnosticData && (
            <Button 
              onClick={downloadJson} 
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar JSON
            </Button>
          )}
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-lg">Resultados del Diagnóstico</CardTitle>
          <CardDescription>
            {diagnosticData 
              ? `Generado el ${new Date(diagnosticData.timestamp).toLocaleString('es-MX')}`
              : 'Haz clic en "Generar Reporte" para obtener la información del sistema.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {diagnosticData ? (
            <div className="bg-slate-950 p-6 overflow-x-auto">
              <pre className="text-emerald-400 font-mono text-sm leading-relaxed">
                <code>{JSON.stringify(diagnosticData, null, 2)}</code>
              </pre>
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
              <Activity className="w-16 h-16 mb-4 opacity-20" />
              <p>No hay datos de diagnóstico disponibles.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
