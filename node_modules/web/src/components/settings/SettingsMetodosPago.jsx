
import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SettingsMetodoPagoModal from './SettingsMetodoPagoModal.jsx';
import SettingsConfirmationModal from './SettingsConfirmationModal.jsx';
import { toast } from 'sonner';

const initialMethods = [
  { id: '1', nombre: 'Efectivo', tipo: 'Efectivo', comision: 0, estatus: 'Activo' },
  { id: '2', nombre: 'Tarjeta de Crédito', tipo: 'Tarjeta de Crédito', comision: 2.5, estatus: 'Activo' },
  { id: '3', nombre: 'Tarjeta de Débito', tipo: 'Tarjeta de Débito', comision: 1.5, estatus: 'Activo' },
  { id: '4', nombre: 'Transferencia SPEI', tipo: 'Transferencia', comision: 0, cuentaBancaria: '012345678901234567', estatus: 'Activo' },
  { id: '5', nombre: 'Cheque', tipo: 'Cheque', comision: 0, estatus: 'Inactivo' },
];

const SettingsMetodosPago = () => {
  const [methods, setMethods] = useState(initialMethods);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentMethod, setCurrentMethod] = useState(null);

  const handleSave = (methodData) => {
    if (currentMethod) {
      setMethods(methods.map(m => m.id === methodData.id ? methodData : m));
      toast.success('Método de pago actualizado');
    } else {
      setMethods([...methods, methodData]);
      toast.success('Método de pago creado');
    }
  };

  const handleDelete = () => {
    setMethods(methods.filter(m => m.id !== currentMethod.id));
    toast.success('Método de pago eliminado');
  };

  const openCreate = () => {
    setCurrentMethod(null);
    setIsModalOpen(true);
  };

  const openEdit = (method) => {
    setCurrentMethod(method);
    setIsModalOpen(true);
  };

  const openDelete = (method) => {
    setCurrentMethod(method);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Métodos de Pago</h3>
          <p className="text-sm text-muted-foreground">
            Administra las formas de pago aceptadas en el punto de venta.
          </p>
        </div>
        <Button 
          onClick={openCreate}
          className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Nuevo
        </Button>
      </div>

      <div className="table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="table-header-cell">Nombre</th>
              <th className="table-header-cell">Tipo</th>
              <th className="table-header-cell text-right">Comisión</th>
              <th className="table-header-cell text-center">Estatus</th>
              <th className="table-header-cell text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {methods.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No hay métodos de pago configurados.
                </td>
              </tr>
            ) : (
              methods.map(method => (
                <tr key={method.id} className="table-row group">
                  <td className="table-cell font-medium">
                    {method.nombre}
                    {method.cuentaBancaria && (
                      <span className="block text-xs text-muted-foreground font-normal mt-0.5">
                        Cuenta: {method.cuentaBancaria}
                      </span>
                    )}
                  </td>
                  <td className="table-cell text-muted-foreground">{method.tipo}</td>
                  <td className="table-cell text-right font-medium">
                    {method.comision}%
                  </td>
                  <td className="table-cell text-center">
                    <Badge variant="outline" className={method.estatus === 'Activo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}>
                      {method.estatus}
                    </Badge>
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-info" onClick={() => openEdit(method)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => openDelete(method)}>
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

      <SettingsMetodoPagoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        metodo={currentMethod}
      />

      <SettingsConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Método de Pago"
        message={`¿Estás seguro de que deseas eliminar el método "${currentMethod?.nombre}"?`}
      />
    </div>
  );
};

export default SettingsMetodosPago;
