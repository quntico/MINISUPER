
import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SettingsImpuestoModal from './SettingsImpuestoModal.jsx';
import SettingsConfirmationModal from './SettingsConfirmationModal.jsx';
import { toast } from 'sonner';

const initialTaxes = [
  { id: '1', nombre: 'IVA', porcentaje: 16, tipo: 'Porcentaje', aplicarA: 'Todos los productos', estatus: 'Activo' },
  { id: '2', nombre: 'ISR', porcentaje: 0, tipo: 'Porcentaje', aplicarA: 'Todos los productos', estatus: 'Activo' },
  { id: '3', nombre: 'IEPS', porcentaje: 8, tipo: 'Porcentaje', aplicarA: 'Categoría específica', estatus: 'Inactivo' },
];

const SettingsImpuestos = () => {
  const [taxes, setTaxes] = useState(initialTaxes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentTax, setCurrentTax] = useState(null);

  const handleSave = (taxData) => {
    if (currentTax) {
      setTaxes(taxes.map(t => t.id === taxData.id ? taxData : t));
      toast.success('Impuesto actualizado');
    } else {
      setTaxes([...taxes, taxData]);
      toast.success('Impuesto creado');
    }
  };

  const handleDelete = () => {
    setTaxes(taxes.filter(t => t.id !== currentTax.id));
    toast.success('Impuesto eliminado');
  };

  const openCreate = () => {
    setCurrentTax(null);
    setIsModalOpen(true);
  };

  const openEdit = (tax) => {
    setCurrentTax(tax);
    setIsModalOpen(true);
  };

  const openDelete = (tax) => {
    setCurrentTax(tax);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Impuestos</h3>
          <p className="text-sm text-muted-foreground">
            Configura los impuestos aplicables a tus productos y ventas.
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
              <th className="table-header-cell text-right">Valor</th>
              <th className="table-header-cell">Tipo</th>
              <th className="table-header-cell">Aplicación</th>
              <th className="table-header-cell text-center">Estatus</th>
              <th className="table-header-cell text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {taxes.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No hay impuestos configurados.
                </td>
              </tr>
            ) : (
              taxes.map(tax => (
                <tr key={tax.id} className="table-row group">
                  <td className="table-cell font-medium">{tax.nombre}</td>
                  <td className="table-cell text-right font-medium">
                    {tax.tipo === 'Porcentaje' ? `${tax.porcentaje}%` : `$${tax.porcentaje.toFixed(2)}`}
                  </td>
                  <td className="table-cell text-muted-foreground">{tax.tipo}</td>
                  <td className="table-cell text-muted-foreground">{tax.aplicarA}</td>
                  <td className="table-cell text-center">
                    <Badge variant="outline" className={tax.estatus === 'Activo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}>
                      {tax.estatus}
                    </Badge>
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-info" onClick={() => openEdit(tax)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => openDelete(tax)}>
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

      <SettingsImpuestoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        impuesto={currentTax}
      />

      <SettingsConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Impuesto"
        message={`¿Estás seguro de que deseas eliminar el impuesto "${currentTax?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};

export default SettingsImpuestos;
