
import React, { useState } from 'react';
import { Database, Download, UploadCloud, Trash2, HardDrive, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SettingsConfirmationModal from './SettingsConfirmationModal.jsx';
import { toast } from 'sonner';

const initialHistory = [
  { id: '1', fecha: '2023-10-25 02:00:00', tamaño: '45.2 MB', tipo: 'Automático' },
  { id: '2', fecha: '2023-10-24 02:00:00', tamaño: '44.8 MB', tipo: 'Automático' },
  { id: '3', fecha: '2023-10-23 15:30:00', tamaño: '44.5 MB', tipo: 'Manual' },
];

const SettingsRespaldo = () => {
  const [frecuencia, setFrecuencia] = useState('Diario');
  const [history, setHistory] = useState(initialHistory);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);

  const handleBackupNow = () => {
    const newBackup = {
      id: Math.random().toString(36).substr(2, 9),
      fecha: new Date().toLocaleString('sv-SE').replace('T', ' '),
      tamaño: '45.5 MB',
      tipo: 'Manual'
    };
    setHistory([newBackup, ...history]);
    toast.success('Respaldo creado exitosamente');
  };

  const handleDownload = (backup) => {
    toast.success(`Descargando respaldo del ${backup.fecha}...`);
  };

  const handleRestore = () => {
    toast.success(`Sistema restaurado al respaldo del ${selectedBackup.fecha}`);
  };

  const handleDelete = () => {
    setHistory(history.filter(h => h.id !== selectedBackup.id));
    toast.success('Respaldo eliminado');
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h3 className="text-lg font-semibold">Respaldo de Datos</h3>
        <p className="text-sm text-muted-foreground">
          Protege la información de tu negocio creando copias de seguridad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="p-6 rounded-2xl bg-card border border-border flex flex-col gap-2">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <Database className="w-5 h-5 text-primary" />
            <span className="font-medium">Tamaño de Base de Datos</span>
          </div>
          <span className="text-3xl font-bold">45.5 <span className="text-lg text-muted-foreground font-normal">MB</span></span>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border flex flex-col gap-2">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <HardDrive className="w-5 h-5 text-info" />
            <span className="font-medium">Último Respaldo</span>
          </div>
          <span className="text-lg font-bold">{history[0]?.fecha || 'Ninguno'}</span>
          <span className="text-sm text-muted-foreground">{history[0]?.tipo}</span>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <Label>Frecuencia Automática</Label>
            <Select value={frecuencia} onValueChange={setFrecuencia}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Diario">Diario (2:00 AM)</SelectItem>
                <SelectItem value="Semanal">Semanal (Domingo)</SelectItem>
                <SelectItem value="Mensual">Mensual (Día 1)</SelectItem>
                <SelectItem value="Nunca">Desactivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground gap-2"
            onClick={handleBackupNow}
          >
            <UploadCloud className="w-4 h-4" />
            Respaldar Ahora
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Historial de Respaldos
        </h4>
        
        <div className="table-container">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="table-header-cell">Fecha y Hora</th>
                <th className="table-header-cell">Tipo</th>
                <th className="table-header-cell text-right">Tamaño</th>
                <th className="table-header-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No hay respaldos disponibles.
                  </td>
                </tr>
              ) : (
                history.map(backup => (
                  <tr key={backup.id} className="table-row group">
                    <td className="table-cell font-medium">{backup.fecha}</td>
                    <td className="table-cell text-muted-foreground">
                      <Badge variant="secondary" className="font-normal">
                        {backup.tipo}
                      </Badge>
                    </td>
                    <td className="table-cell text-right text-muted-foreground">{backup.tamaño}</td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => handleDownload(backup)}>
                          <Download className="w-3.5 h-3.5" /> Descargar
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-warning hover:text-warning border-warning/20 hover:bg-warning/10" onClick={() => { setSelectedBackup(backup); setIsRestoreOpen(true); }}>
                          <RotateCcw className="w-3.5 h-3.5" /> Restaurar
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => { setSelectedBackup(backup); setIsDeleteOpen(true); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SettingsConfirmationModal 
        isOpen={isRestoreOpen}
        onClose={() => setIsRestoreOpen(false)}
        onConfirm={handleRestore}
        title="Restaurar Sistema"
        message={`¿Estás seguro de que deseas restaurar el sistema al respaldo del ${selectedBackup?.fecha}? Todos los datos actuales serán sobrescritos.`}
        confirmLabel="Sí, Restaurar"
        variant="warning"
      />

      <SettingsConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Respaldo"
        message={`¿Estás seguro de que deseas eliminar el respaldo del ${selectedBackup?.fecha}?`}
      />
    </div>
  );
};

export default SettingsRespaldo;
