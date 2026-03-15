
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

const initialFormState = {
  nombre: '',
  porcentaje: '',
  tipo: 'Porcentaje',
  aplicarA: 'Todos los productos',
  estatus: 'Activo'
};

const SettingsImpuestoModal = ({ isOpen, onClose, onSave, impuesto }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (impuesto) {
        setFormData({ ...impuesto, porcentaje: impuesto.porcentaje.toString() });
      } else {
        setFormData(initialFormState);
      }
      setErrors({});
    }
  }, [isOpen, impuesto]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    
    const val = parseFloat(formData.porcentaje);
    if (isNaN(val) || val < 0) {
      newErrors.porcentaje = 'Valor inválido';
    } else if (formData.tipo === 'Porcentaje' && val > 100) {
      newErrors.porcentaje = 'No puede ser mayor a 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        id: impuesto?.id || Math.random().toString(36).substr(2, 9),
        porcentaje: parseFloat(formData.porcentaje)
      });
      onClose();
    } else {
      toast.error('Por favor, corrige los errores');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{impuesto ? 'Editar Impuesto' : 'Nuevo Impuesto'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Impuesto <span className="text-destructive">*</span></Label>
            <Input 
              id="nombre" 
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={errors.nombre ? 'border-destructive' : ''}
              placeholder="Ej. IVA"
            />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(v) => setFormData({ ...formData, tipo: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Porcentaje">Porcentaje (%)</SelectItem>
                  <SelectItem value="Monto fijo">Monto Fijo ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="porcentaje">Valor <span className="text-destructive">*</span></Label>
              <Input 
                id="porcentaje" 
                type="number"
                step="0.01"
                value={formData.porcentaje}
                onChange={(e) => setFormData({ ...formData, porcentaje: e.target.value })}
                className={errors.porcentaje ? 'border-destructive' : ''}
              />
              {errors.porcentaje && <p className="text-xs text-destructive">{errors.porcentaje}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aplicarA">Aplicar a</Label>
            <Select 
              value={formData.aplicarA} 
              onValueChange={(v) => setFormData({ ...formData, aplicarA: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos los productos">Todos los productos</SelectItem>
                <SelectItem value="Categoría específica">Categoría específica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estatus">Estatus</Label>
            <Select 
              value={formData.estatus} 
              onValueChange={(v) => setFormData({ ...formData, estatus: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover text-primary-foreground">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsImpuestoModal;
