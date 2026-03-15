
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KeyRound, ShieldCheck, Clock, CalendarDays } from 'lucide-react';
import ImageUploadField from './ImageUploadField.jsx';
import ChangePasswordModal from './ChangePasswordModal.jsx';

const SettingsUsuario = ({ data, onChange }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h3 className="text-lg font-semibold">Perfil de Usuario</h3>
        <p className="text-sm text-muted-foreground">
          Gestiona tu información personal y credenciales de acceso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="space-y-4">
            <Label>Foto de Perfil</Label>
            <ImageUploadField 
              value={data.foto} 
              onChange={(url) => handleChange('foto', url)} 
              label="Subir Foto"
              className="w-32 h-32 rounded-full overflow-hidden"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium">Seguridad</h4>
            <Button 
              variant="outline" 
              className="w-full gap-2 text-info hover:text-info hover:bg-info/10 border-info/20"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              <KeyRound className="w-4 h-4" />
              Cambiar Contraseña
            </Button>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo <span className="text-destructive">*</span></Label>
              <Input 
                id="nombre" 
                value={data.nombre} 
                onChange={(e) => handleChange('nombre', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input 
                id="username" 
                value={data.username} 
                disabled
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                type="email"
                value={data.email} 
                onChange={(e) => handleChange('email', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input 
                id="telefono" 
                value={data.telefono} 
                onChange={(e) => handleChange('telefono', e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol">Rol del Sistema</Label>
              <Select value={data.rol} disabled>
                <SelectTrigger id="rol" className="bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Cajero">Cajero</SelectItem>
                  <SelectItem value="Gerente">Gerente</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Solo un administrador puede cambiar roles.</p>
            </div>
          </div>

          {/* Read-only Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
            <div className="p-4 rounded-xl bg-muted/30 border border-border flex flex-col gap-1">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-medium">Estatus</span>
              </div>
              <span className="text-sm font-semibold text-emerald-500">{data.estatus}</span>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border flex flex-col gap-1">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <CalendarDays className="w-4 h-4" />
                <span className="text-xs font-medium">Miembro desde</span>
              </div>
              <span className="text-sm font-semibold">{data.fechaCreacion}</span>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border flex flex-col gap-1">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Último acceso</span>
              </div>
              <span className="text-sm font-semibold">{data.ultimoAcceso}</span>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
};

export default SettingsUsuario;
