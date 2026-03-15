
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
import ImageUploadField from './ImageUploadField.jsx';

const estadosMexico = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 
  'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 
  'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 
  'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 
  'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
];

const SettingsNegocio = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h3 className="text-lg font-semibold">Información del Negocio</h3>
        <p className="text-sm text-muted-foreground">
          Estos datos aparecerán en los tickets y facturas emitidas a tus clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo Column */}
        <div className="md:col-span-1 space-y-4">
          <Label>Logo del Negocio</Label>
          <ImageUploadField 
            value={data.logo} 
            onChange={(url) => handleChange('logo', url)} 
            label="Subir Logo"
          />
          <p className="text-xs text-muted-foreground">
            Recomendado: 512x512px. Formatos: JPG, PNG.
          </p>
        </div>

        {/* Form Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Comercial <span className="text-destructive">*</span></Label>
              <Input 
                id="nombre" 
                value={data.nombre} 
                onChange={(e) => handleChange('nombre', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rfc">RFC <span className="text-destructive">*</span></Label>
              <Input 
                id="rfc" 
                value={data.rfc} 
                onChange={(e) => handleChange('rfc', e.target.value)} 
                className="uppercase"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="razonSocial">Razón Social</Label>
            <Input 
              id="razonSocial" 
              value={data.razonSocial} 
              onChange={(e) => handleChange('razonSocial', e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección Fiscal</Label>
            <Textarea 
              id="direccion" 
              value={data.direccion} 
              onChange={(e) => handleChange('direccion', e.target.value)} 
              className="resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input 
                id="ciudad" 
                value={data.ciudad} 
                onChange={(e) => handleChange('ciudad', e.target.value)} 
              />
            </div>
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
            <Label htmlFor="descripcion">Descripción / Lema (Opcional)</Label>
            <Input 
              id="descripcion" 
              value={data.descripcion} 
              onChange={(e) => handleChange('descripcion', e.target.value)} 
              placeholder="Ej. Los mejores productos al mejor precio"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsNegocio;
