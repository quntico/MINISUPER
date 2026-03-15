
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from 'lucide-react';
import SettingsConfirmationModal from './SettingsConfirmationModal.jsx';
import { toast } from 'sonner';

const SettingsSistema = ({ data, onChange }) => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleReset = () => {
    toast.success('Configuración del sistema restaurada a valores por defecto');
    // In a real app, this would reset the state to defaults
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Configuración del Sistema</h3>
          <p className="text-sm text-muted-foreground">
            Ajusta las preferencias globales de la aplicación.
          </p>
        </div>
        <Button 
          variant="outline" 
          className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 gap-2"
          onClick={() => setIsResetModalOpen(true)}
        >
          <RotateCcw className="w-4 h-4" />
          Restaurar Valores
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {/* Regional Settings */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Regional y Formatos
          </h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idioma">Idioma</Label>
                <Select value={data.idioma} onValueChange={(v) => handleChange('idioma', v)}>
                  <SelectTrigger id="idioma">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Español">Español</SelectItem>
                    <SelectItem value="Inglés">Inglés</SelectItem>
                    <SelectItem value="Portugués">Portugués</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tema">Tema Visual</Label>
                <Select value={data.tema} onValueChange={(v) => handleChange('tema', v)}>
                  <SelectTrigger id="tema">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Claro">Claro</SelectItem>
                    <SelectItem value="Oscuro">Oscuro</SelectItem>
                    <SelectItem value="Auto">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="moneda">Moneda</Label>
                <Select value={data.moneda} onValueChange={(v) => handleChange('moneda', v)}>
                  <SelectTrigger id="moneda">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MXN">MXN Peso Mexicano</SelectItem>
                    <SelectItem value="USD">USD Dólar Estadounidense</SelectItem>
                    <SelectItem value="EUR">EUR Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="simbolo">Símbolo</Label>
                <Select value={data.simbolo} onValueChange={(v) => handleChange('simbolo', v)}>
                  <SelectTrigger id="simbolo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$">$</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="€">€</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="formatoFecha">Formato de Fecha</Label>
                <Select value={data.formatoFecha} onValueChange={(v) => handleChange('formatoFecha', v)}>
                  <SelectTrigger id="formatoFecha">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="formatoHora">Formato de Hora</Label>
                <Select value={data.formatoHora} onValueChange={(v) => handleChange('formatoHora', v)}>
                  <SelectTrigger id="formatoHora">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 Horas (AM/PM)</SelectItem>
                    <SelectItem value="24h">24 Horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="decimales">Decimales en Precios</Label>
              <Input 
                id="decimales" 
                type="number" 
                min="0" 
                max="4"
                value={data.decimales} 
                onChange={(e) => handleChange('decimales', parseInt(e.target.value))} 
              />
            </div>
          </div>
        </div>

        {/* Hardware & Behavior */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Hardware y Comportamiento
          </h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="impresora">Impresora Predeterminada</Label>
              <Select value={data.impresora} onValueChange={(v) => handleChange('impresora', v)}>
                <SelectTrigger id="impresora">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EPSON TM-T20III">EPSON TM-T20III</SelectItem>
                  <SelectItem value="Xprinter XP-80C">Xprinter XP-80C</SelectItem>
                  <SelectItem value="PDF">Guardar como PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="papel">Tamaño de Papel (Tickets)</Label>
              <Select value={data.papel} onValueChange={(v) => handleChange('papel', v)}>
                <SelectTrigger id="papel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="80mm">Ticket 80mm</SelectItem>
                  <SelectItem value="58mm">Ticket 58mm</SelectItem>
                  <SelectItem value="A4">Hoja A4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sesion">Cierre de Sesión Automático</Label>
              <Select value={data.sesion} onValueChange={(v) => handleChange('sesion', v)}>
                <SelectTrigger id="sesion">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutos de inactividad</SelectItem>
                  <SelectItem value="10">10 minutos de inactividad</SelectItem>
                  <SelectItem value="15">15 minutos de inactividad</SelectItem>
                  <SelectItem value="30">30 minutos de inactividad</SelectItem>
                  <SelectItem value="Nunca">Nunca</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones del Sistema</Label>
                  <p className="text-xs text-muted-foreground">Mostrar alertas emergentes</p>
                </div>
                <Switch 
                  checked={data.notificaciones} 
                  onCheckedChange={(v) => handleChange('notificaciones', v)} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sonidos de Alerta</Label>
                  <p className="text-xs text-muted-foreground">Reproducir sonido en errores/éxito</p>
                </div>
                <Switch 
                  checked={data.sonido} 
                  onCheckedChange={(v) => handleChange('sonido', v)} 
                />
              </div>

              {data.sonido && (
                <div className="space-y-3 pl-4 border-l-2 border-border">
                  <Label>Volumen de Alerta ({data.volumen}%)</Label>
                  <Slider 
                    value={[data.volumen]} 
                    onValueChange={(v) => handleChange('volumen', v[0])} 
                    max={100} 
                    step={1} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SettingsConfirmationModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
        title="Restaurar Valores por Defecto"
        message="¿Estás seguro de que deseas restaurar toda la configuración del sistema a sus valores originales? Esta acción no se puede deshacer."
        confirmLabel="Sí, Restaurar"
      />
    </div>
  );
};

export default SettingsSistema;
