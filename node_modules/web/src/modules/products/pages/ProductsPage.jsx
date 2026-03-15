
import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  Layers, 
  Calendar, 
  Tag, 
  Upload, 
  BookOpen,
  Barcode,
  DollarSign,
  PieChart,
  Boxes,
  Save,
  X,
  PlusCircle,
  TrendingUp,
  Percent,
  Warehouse
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { apiService } from '@/modules/core/services/apiService';
import { useCompany } from '@/modules/core/contexts/CompanyContext';
import { useBranch } from '@/modules/core/contexts/BranchContext';
import pb from '@/lib/pocketbaseClient';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('nuevo');
  const [saving, setSaving] = useState(false);
  const { company } = useCompany();
  const { branch } = useBranch();
  
  // Estado para el nuevo producto
  const [newProduct, setNewProduct] = useState({
    barcode: '',
    name: '',
    category: '',
    cost: '',
    price: '',
    wholesalePrice: '',
    wholesaleQuantity: '',
    stock: '',
    minStock: '',
    unitType: 'unidad', // unidad, granel, kit
    provider: ''
  });

  const menuItems = [
    { id: 'nuevo', label: 'Nuevo', icon: PlusCircle, color: 'text-emerald-500' },
    { id: 'modificar', label: 'Modificar', icon: Edit2, color: 'text-blue-500' },
    { id: 'eliminar', label: 'Eliminar', icon: Trash2, color: 'text-red-500' },
    { id: 'departamentos', label: 'Departamentos', icon: Layers, color: 'text-indigo-500' },
    { id: 'ventas', label: 'Ventas por Periodo', icon: Calendar, color: 'text-orange-500' },
    { id: 'promociones', label: 'Promociones', icon: Tag, color: 'text-pink-500' },
    { id: 'importar', label: 'Importar', icon: Upload, color: 'text-amber-500' },
    { id: 'catalogo', label: 'Catálogo', icon: BookOpen, color: 'text-slate-500' },
  ];

  const handleSave = async () => {
    if (!newProduct.name.trim()) {
      toast.error('Falta el nombre del producto', { description: 'El campo Descripción / Nombre es obligatorio.' });
      return;
    }
    if (!newProduct.price) {
      toast.error('Falta el precio de venta', { description: 'Ingresa un precio de venta válido.' });
      return;
    }

    setSaving(true);
    try {
      // Obtener IDs de contexto o localStorage como fallback
      const companyId = company?.id || localStorage.getItem('company_id');
      let branchId = branch?.id || localStorage.getItem('branch_id');

      if (!companyId) {
        toast.error('Sin empresa configurada', { description: 'La sesión no tiene una empresa asociada.' });
        setSaving(false);
        return;
      }

      // Si no hay sucursal, buscar la primera disponible o crear una
      if (!branchId) {
        try {
          const branches = await pb.collection('branches').getFullList({
            filter: `company_id = "${companyId}"`,
            sort: '-created',
            $autoCancel: false
          });
          if (branches.length > 0) {
            branchId = branches[0].id;
            localStorage.setItem('branch_id', branchId);
          } else {
            // Crear sucursal principal automáticamente
            const newBranch = await pb.collection('branches').create({
              name: 'Principal',
              company_id: companyId,
              is_main: true,
            }, { $autoCancel: false });
            branchId = newBranch.id;
            localStorage.setItem('branch_id', branchId);
            toast.info('Sucursal "Principal" creada automáticamente.');
          }
        } catch (branchErr) {
          console.warn('No se pudo resolver la sucursal:', branchErr);
        }
      }

      // 1. Crear el producto
      const productData = {
        name: newProduct.name.trim(),
        barcode: newProduct.barcode.trim() || '',
        category: newProduct.category.trim() || 'General',
        price: parseFloat(newProduct.price) || 0,
        cost: parseFloat(newProduct.cost) || 0,
        wholesale_price: parseFloat(newProduct.wholesalePrice) || 0,
        wholesale_quantity: parseInt(newProduct.wholesaleQuantity) || 0,
        unit_type: newProduct.unitType,
        provider: newProduct.provider.trim() || '',
        company_id: companyId,
        is_active: true,
        ...(branchId ? { branch_id: branchId } : {}),
      };

      const createdProduct = await pb.collection('products').create(productData, { $autoCancel: false });

      // 2. Crear entrada en inventario
      const inventoryData = {
        product_id: createdProduct.id,
        stock: parseInt(newProduct.stock) || 0,
        min_stock: parseInt(newProduct.minStock) || 5,
        last_update: new Date(),
        ...(branchId ? { branch_id: branchId } : {}),
      };
      await pb.collection('inventory').create(inventoryData, { $autoCancel: false });

      toast.success(`¡${createdProduct.name} guardado!`, {
        description: 'El producto ya aparece en el inventario y el buscador.',
      });

      // 3. Limpiar formulario
      setNewProduct({
        barcode: '', name: '', category: '', cost: '', price: '',
        wholesalePrice: '', wholesaleQuantity: '', stock: '', minStock: '', unitType: 'unidad',
        provider: ''
      });
    } catch (err) {
      console.error('Error al guardar producto:', err);
      const detail = err?.response?.data
        ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v.message}`).join(', ')
        : err?.message;
      toast.error('Error al guardar', { description: detail || 'Revisa la conexión con PocketBase.' });
    } finally {
      setSaving(false);
    }
  };

  const calculateMargin = () => {
    if (!newProduct.cost || !newProduct.price) return 0;
    const cost = parseFloat(newProduct.cost);
    const price = parseFloat(newProduct.price);
    return (((price - cost) / cost) * 100).toFixed(2);
  };

  const calculateWholesaleMargin = () => {
    if (!newProduct.cost || !newProduct.wholesalePrice) return 0;
    const cost = parseFloat(newProduct.cost);
    const wholesale = parseFloat(newProduct.wholesalePrice);
    return (((wholesale - cost) / cost) * 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Header inspired by Eleventa */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/20 p-2 rounded-[2rem] shadow-xl shadow-slate-200/50">
        <div className="flex flex-wrap gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                activeTab === item.id 
                  ? "bg-slate-900 text-white shadow-lg" 
                  : "hover:bg-white/50 text-slate-600 hover:text-slate-900"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                activeTab === item.id ? "text-white" : item.color
              )} />
              <span className="font-bold text-sm tracking-tight uppercase">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 animate-in fade-in slide-in-from-bottom-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'nuevo' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-8 ml-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nuevo Producto</h1>
              <p className="text-slate-500 font-medium">Ingresa los detalles para expandir tu inventario.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Form Area */}
            <div className="lg:col-span-8 space-y-8">
              {/* Sección 1: Datos Generales */}
              <Card className="p-8 rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Barcode className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest text-xs">Información Básica</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Código de Barras</label>
                      <div className="relative group">
                        <Input 
                          placeholder="Escanea o escribe el código..." 
                          className="h-14 rounded-2xl border-slate-200 bg-white text-slate-900 focus:ring-blue-500 font-bold text-lg pl-12 transition-all hover:shadow-md placeholder:text-slate-400"
                          value={newProduct.barcode}
                          onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                        />
                        <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Descripción / Nombre</label>
                      <Input 
                        placeholder="Ej. Coca-Cola Original 600ml" 
                        className="h-14 rounded-2xl border-slate-200 bg-white text-slate-900 focus:ring-blue-500 font-bold transition-all hover:shadow-md placeholder:text-slate-400"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Venta por:</label>
                      <Select 
                        value={newProduct.unitType}
                        onValueChange={(v) => setNewProduct({...newProduct, unitType: v})}
                      >
                        <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-white text-slate-900 font-bold transition-all hover:shadow-md">
                          <SelectValue className="text-slate-900" placeholder="Seleccione unidad" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                          <SelectItem value="unidad" className="py-3 font-bold">Por Unidad / Paquete</SelectItem>
                          <SelectItem value="granel" className="py-3 font-bold">A Granel (Kilos / Litros)</SelectItem>
                          <SelectItem value="kit" className="py-3 font-bold">Como Kit / Promo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Proveedor</label>
                      <div className="relative group">
                        <Input 
                          placeholder="Ej. Distribuidora S.A." 
                          className="h-14 rounded-2xl border-slate-200 bg-white text-slate-900 focus:ring-blue-500 font-bold pl-12 transition-all hover:shadow-md placeholder:text-slate-400"
                          value={newProduct.provider}
                          onChange={(e) => setNewProduct({...newProduct, provider: e.target.value})}
                        />
                        <Warehouse className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Sección 2: Precios */}
              <Card className="p-8 rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest text-xs">Precios y Utilidad</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Costo</label>
                    <div className="relative group">
                      <Input 
                        type="number"
                        placeholder="0.00" 
                        className="h-14 rounded-2xl border-slate-200 bg-white text-slate-900 focus:ring-emerald-500 font-bold text-lg pl-12 transition-all hover:shadow-md placeholder:text-slate-400"
                        value={newProduct.cost}
                        onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                      />
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Precio Venta</label>
                    <div className="relative group">
                      <Input 
                        type="number"
                        placeholder="0.00" 
                        className="h-14 rounded-2xl border-slate-200 bg-white text-slate-900 focus:ring-blue-500 font-bold text-lg pl-12 transition-all hover:shadow-md placeholder:text-slate-400"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      />
                      <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    {newProduct.cost && newProduct.price && (
                      <div className="flex items-center gap-2 mt-2 ml-1">
                        <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px] uppercase tracking-tighter">
                          +{calculateMargin()}% Ganancia
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Precio Mayoreo</label>
                    <div className="relative group">
                      <Input 
                        type="number"
                        placeholder="0.00" 
                        className="h-14 rounded-2xl border-slate-200 bg-white text-slate-900 focus:ring-amber-500 font-bold text-lg pl-12 transition-all hover:shadow-md placeholder:text-slate-400"
                        value={newProduct.wholesalePrice}
                        onChange={(e) => setNewProduct({...newProduct, wholesalePrice: e.target.value})}
                      />
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                    </div>
                    {newProduct.cost && newProduct.wholesalePrice && (
                      <div className="flex items-center gap-2 mt-2 ml-1">
                        <Badge className={cn(
                          "border-none font-black text-[10px] uppercase tracking-tighter",
                          parseFloat(calculateWholesaleMargin()) >= 0
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        )}>
                          {parseFloat(calculateWholesaleMargin()) >= 0 ? '+' : ''}{calculateWholesaleMargin()}% Mayoreo
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mayoreo desde (Cant.)</label>
                    <div className="relative group">
                      <Input 
                        type="number"
                        placeholder="3" 
                        className="h-14 rounded-2xl border-slate-200 bg-white text-slate-900 focus:ring-amber-500 font-bold text-lg pl-12 transition-all hover:shadow-md placeholder:text-slate-400"
                        value={newProduct.wholesaleQuantity}
                        onChange={(e) => setNewProduct({...newProduct, wholesaleQuantity: e.target.value})}
                      />
                      <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar Form Area (Inventory) */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="p-8 rounded-[2.5rem] border-none shadow-xl shadow-blue-200 bg-gradient-to-br from-blue-500 to-blue-700 text-white overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Warehouse className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-widest text-xs">Inventario</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] ml-1">Stock Inicial</label>
                      <Input 
                        type="number"
                        placeholder="0" 
                        className="h-16 rounded-2xl border-white/20 bg-white/15 text-white placeholder:text-white/40 focus:ring-white/50 font-black text-2xl text-center transition-all hover:bg-white/20"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] ml-1">Mínimo</label>
                        <Input 
                          type="number"
                          placeholder="5" 
                          className="h-12 rounded-xl border-white/20 bg-white/15 text-white placeholder:text-white/40 focus:ring-white/50 font-bold text-center hover:bg-white/20"
                          value={newProduct.minStock}
                          onChange={(e) => setNewProduct({...newProduct, minStock: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] ml-1">Unidad</label>
                        <div className="h-12 bg-white/15 rounded-xl border border-white/20 flex items-center justify-center font-bold text-xs uppercase tracking-widest text-white">
                          {newProduct.unitType}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Estado</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-black text-[10px] uppercase tracking-widest">Activo</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Botones de acción lateral */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="ghost" 
                  className="h-16 rounded-[1.5rem] border-2 border-slate-100 hover:bg-slate-50 font-black uppercase tracking-widest text-xs text-slate-400"
                  onClick={() => setNewProduct({
                    barcode: '', name: '', category: '', cost: '', price: '', 
                    wholesalePrice: '', wholesaleQuantity: '', stock: '', minStock: '', unitType: 'unidad'
                  })}
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpiar
                </Button>
                <Button 
                  className="h-16 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 font-black uppercase tracking-widest text-xs disabled:opacity-60 text-white"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <><span className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Guardando...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Guardar</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'nuevo' && (
        <div className="h-96 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/20 shadow-xl overflow-hidden">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <PieChart className="w-10 h-10 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sección en Desarrollo</h2>
          <p className="text-slate-500 max-w-xs mt-2 font-medium">Estamos puliendo la herramienta de {activeTab} para que sea la mejor del mercado.</p>
          <Button 
            variant="link" 
            onClick={() => setActiveTab('nuevo')}
            className="mt-6 font-black text-blue-600 uppercase tracking-widest text-xs"
          >
            Volver a Nuevo Producto
          </Button>
        </div>
      )}
    </div>
  );
}
