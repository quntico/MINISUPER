
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
  tipo: 'Efectivo',
  comision: '0',
  cuentaBancaria: '',
  referencia: '',
  estatus: 'Activo'
};

const SettingsMetodoPagoModal = ({ isOpen, onClose, onSave, metodo }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (metodo) {
        setFormData({ ...metodo, comision: metodo.comision.toString() });
      } else {
        setFormData(initialFormState);
      }
      setErrors({});
    }
  }, [isOpen, metodo]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    
    const val = parseFloat(formData.comision);
    if (isNaN(val) || val < 0 || val > 100) {
      newErrors.comision = 'Comisión inválida (0-100)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        id: metodo?.id || Math.random().toString(36).substr(2, 9),
        comision: parseFloat(formData.comision)
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
          <DialogTitle>{metodo ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre <span className="text-destructive">*</span></Label>
            <Input 
              id="nombre" 
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={errors.nombre ? 'border-destructive' : ''}
              placeholder="Ej. Tarjeta de Crédito Banamex"
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
                  <SelectItem value="Efectivo">Efectivo</SelectItem>
                  <SelectItem value="Tarjeta de Crédito">Tarjeta de Crédito</SelectItem>
                  <SelectItem value="Tarjeta de Débito">Tarjeta de Débito</SelectItem>
                  <SelectItem value="Transferencia">Transferencia</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comision">Comisión (%) <span className="text-destructive">*</span></Label>
              <Input 
                id="comision" 
                type="number"
                step="0.01"
                value={formData.comision}
                onChange={(e) => setFormData({ ...formData, comision: e.target.value })}
                className={errors.comision ? 'border-destructive' : ''}
              />
              {errors.comision && <p className="text-xs text-destructive">{errors.comision}</p>}
            </div>
          </div>

          {(formData.tipo === 'Transferencia' || formData.tipo === 'Cheque') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cuentaBancaria">Cuenta Bancaria (Opcional)</Label>
                <Input 
                  id="cuentaBancaria" 
                  value={formData.cuentaBancaria}
                  onChange={(e) => setFormData({ ...formData, cuentaBancaria: e.target.value })}
                  placeholder="Número de cuenta o CLABE"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referencia">Instrucciones / Referencia (Opcional)</Label>
                <Input 
                  id="referencia" 
                  value={formData.referencia}
                  onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
                  placeholder="Ej. Concepto de pago"
                />
              </div>
            </>
          )}

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

export default SettingsMetodoPagoModal;
