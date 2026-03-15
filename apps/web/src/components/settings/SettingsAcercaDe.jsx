
import React from 'react';
import { ExternalLink, Mail, FileText, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";

const SettingsAcercaDe = () => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-card border border-border rounded-2xl">
        <div className="w-32 h-32 bg-primary/10 rounded-3xl flex items-center justify-center shrink-0 border border-primary/20">
          <span className="text-4xl font-black text-primary tracking-tighter">MS</span>
        </div>
        
        <div className="space-y-2 flex-1">
          <h2 className="text-3xl font-bold tracking-tight">MINISUPER POS</h2>
          <p className="text-lg text-muted-foreground">Sistema de Punto de Venta e Inventario</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <span className="px-3 py-1 bg-muted rounded-full text-sm font-medium">Versión 1.0.0</span>
            <span className="px-3 py-1 bg-muted rounded-full text-sm font-medium">Build 20231025</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
          <h3 className="font-semibold text-lg border-b border-border pb-2">Información de Licencia</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Titular:</span>
              <span className="font-medium">Mi Tienda S.A. de C.V.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo de Licencia:</span>
              <span className="font-medium">Pro Ilimitada</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha de Instalación:</span>
              <span className="font-medium">15 Oct 2023</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vencimiento:</span>
              <span className="font-medium text-emerald-500">Permanente</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
          <h3 className="font-semibold text-lg border-b border-border pb-2">Soporte y Contacto</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 h-11">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
              Visitar Sitio Web
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-11">
              <Mail className="w-4 h-4 text-muted-foreground" />
              soporte@minisuper.com
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 pt-8 border-t border-border text-sm">
        <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <FileText className="w-4 h-4" />
          Términos de Servicio
        </a>
        <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <Shield className="w-4 h-4" />
          Política de Privacidad
        </a>
      </div>
      
      <p className="text-center text-xs text-muted-foreground pt-4">
        &copy; {new Date().getFullYear()} MINISUPER. Todos los derechos reservados.
      </p>
    </div>
  );
};

export default SettingsAcercaDe;
