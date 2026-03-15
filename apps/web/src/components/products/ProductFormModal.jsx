
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from './ImageUpload.jsx';
import { toast } from 'sonner';

const initialFormState = {
  sku: '',
  name: '',
  description: '',
  category: '',
  barcode: '',
  cost: '',
  price: '',
  tax: '0',
  stock: '0',
  status: 'Activo',
  provider: '',
  image: null
};

const ProductFormModal = ({ isOpen, onClose, onSave, product, categories, providers }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const isEdit = !!product;

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          ...product,
          cost: product.cost.toString(),
          price: product.price.toString(),
          tax: product.tax.toString(),
          stock: product.stock.toString(),
        });
      } else {
        setFormData(initialFormState);
      }
      setErrors({});
    }
  }, [isOpen, product]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.sku.trim()) newErrors.sku = 'El SKU es requerido';
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.category) newErrors.category = 'Selecciona una categoría';
    
    const cost = parseFloat(formData.cost);
    const price = parseFloat(formData.price);
    
    if (isNaN(cost) || cost < 0) newErrors.cost = 'Costo inválido';
    if (isNaN(price) || price < 0) newErrors.price = 'Precio inválido';
    if (!isNaN(cost) && !isNaN(price) && price < cost) {
      newErrors.price = 'El precio debe ser mayor al costo';
    }
    
    if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Existencia inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = {
        ...formData,
        cost: parseFloat(formData.cost),
        price: parseFloat(formData.price),
        tax: parseFloat(formData.tax),
        stock: parseInt(formData.stock, 10),
      };
      onSave(submitData);
    } else {
      toast.error('Por favor, corrige los errores en el formulario');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Image */}
            <div className="md:col-span-1 space-y-4">
              <div>
                <Label className="mb-2 block">Imagen del Producto</Label>
                <ImageUpload 
                  currentImage={formData.image}
                  onImageChange={(url) => handleChange('image', url)}
                  onImageDelete={() => handleChange('image', null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Estatus</Label>
                <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecciona estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                    <SelectItem value="Descontinuado">Descontinuado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU <span className="text-destructive">*</span></Label>
                  <Input 
                    id="sku" 
                    value={formData.sku} 
                    onChange={(e) => handleChange('sku', e.target.value)}
                    className={errors.sku ? 'border-destructive' : ''}
                    placeholder="Ej. BEB-001"
                  />
                  {errors.sku && <p className="text-xs text-destructive">{errors.sku}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Código de Barras</Label>
                  <Input 
                    id="barcode" 
                    value={formData.barcode} 
                    onChange={(e) => handleChange('barcode', e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto <span className="text-destructive">*</span></Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? 'border-destructive' : ''}
                  placeholder="Ej. Coca-Cola 600ml"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría <span className="text-destructive">*</span></Label>
                  <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                    <SelectTrigger id="category" className={errors.category ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Proveedor</Label>
                  <Select value={formData.provider} onValueChange={(v) => handleChange('provider', v)}>
                    <SelectTrigger id="provider">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Costo ($) <span className="text-destructive">*</span></Label>
                  <Input 
                    id="cost" 
                    type="number" 
                    step="0.01"
                    value={formData.cost} 
                    onChange={(e) => handleChange('cost', e.target.value)}
                    className={errors.cost ? 'border-destructive' : ''}
                  />
                  {errors.cost && <p className="text-xs text-destructive">{errors.cost}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio ($) <span className="text-destructive">*</span></Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01"
                    value={formData.price} 
                    onChange={(e) => handleChange('price', e.target.value)}
                    className={errors.price ? 'border-destructive' : ''}
                  />
                  {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">Impuesto (%)</Label>
                  <Input 
                    id="tax" 
                    type="number" 
                    value={formData.tax} 
                    onChange={(e) => handleChange('tax', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Existencia Inicial <span className="text-destructive">*</span></Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    value={formData.stock} 
                    onChange={(e) => handleChange('stock', e.target.value)}
                    className={errors.stock ? 'border-destructive' : ''}
                  />
                  {errors.stock && <p className="text-xs text-destructive">{errors.stock}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Detalles adicionales del producto..."
                  className="resize-none h-20"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover text-primary-foreground">
              {isEdit ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
