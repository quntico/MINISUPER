
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const estadosMexico = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 
  'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 
  'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 
  'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 
  'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
];

const usuarios = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez'];

const SettingsSucursal = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h3 className="text-lg font-semibold">Configuración de Sucursal</h3>
        <p className="text-sm text-muted-foreground">
          Administra los detalles específicos de esta ubicación.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre de la Sucursal <span className="text-destructive">*</span></Label>
          <Input 
            id="nombre" 
            value={data.nombre} 
            onChange={(e) => handleChange('nombre', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="codigo">Código de Sucursal <span className="text-destructive">*</span></Label>
          <Input 
            id="codigo" 
            value={data.codigo} 
            onChange={(e) => handleChange('codigo', e.target.value)} 
            className="uppercase"
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
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input 
            id="email" 
            type="email"
            value={data.email} 
            onChange={(e) => handleChange('email', e.target.value)} 
          />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="direccion">Dirección Física</Label>
          <Textarea 
            id="direccion" 
            value={data.direccion} 
            onChange={(e) => handleChange('direccion', e.target.value)} 
            className="resize-none h-20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input 
            id="ciudad" 
            value={data.ciudad} 
            onChange={(e) => handleChange('ciudad', e.target.value)} 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select value={data.estado} onValueChange={(v) => handleChange('estado', v)}>
              <SelectTrigger id="estado">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {estadosMexico.map(estado => (
                  <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp">Código Postal</Label>
            <Input 
              id="cp" 
              value={data.cp} 
              onChange={(e) => handleChange('cp', e.target.value)} 
              maxLength={5}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gerente">Gerente de Sucursal</Label>
          <Select value={data.gerente} onValueChange={(v) => handleChange('gerente', v)}>
            <SelectTrigger id="gerente">
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {usuarios.map(user => (
                <SelectItem key={user} value={user}>{user}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estatus">Estatus</Label>
          <Select value={data.estatus} onValueChange={(v) => handleChange('estatus', v)}>
            <SelectTrigger id="estatus">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activa">Activa</SelectItem>
              <SelectItem value="Inactiva">Inactiva</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-2 grid grid-cols-2 gap-6 p-4 bg-muted/30 rounded-xl border border-border">
          <div className="space-y-2">
            <Label htmlFor="apertura">Horario de Apertura</Label>
            <Input 
              id="apertura" 
              type="time"
              value={data.apertura} 
              onChange={(e) => handleChange('apertura', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cierre">Horario de Cierre</Label>
            <Input 
              id="cierre" 
              type="time"
              value={data.cierre} 
              onChange={(e) => handleChange('cierre', e.target.value)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSucursal;
