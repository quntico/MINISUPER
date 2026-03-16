
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCompany } from '@/modules/core/contexts/CompanyContext.jsx';
import { useBranch } from '@/modules/core/contexts/BranchContext.jsx';
import { Building2, Users, Shield, Receipt, CreditCard, Settings, Database, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ConfigurationPage() {
  const navigate = useNavigate();
  const { company, updateCompany, createCompany } = useCompany();
  const { branch, updateBranch } = useBranch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: company?.name || '',
    legal_name: company?.legal_name || '',
    rfc: company?.rfc || '',
    phone: company?.phone || '',
    email: company?.email || '',
    address: company?.address || ''
  });

  // Sincronizar con los datos cargados de la empresa
  React.useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        legal_name: company.legal_name || '',
        rfc: company.rfc || '',
        phone: company.phone || '',
        email: company.email || '',
        address: company.address || ''
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveGeneral = async () => {
    setIsSubmitting(true);
    try {
      if (company?.id) {
        // Actualizar empresa existente
        await updateCompany(company.id, {
          name: formData.name,
          legal_name: formData.legal_name,
          rfc: formData.rfc,
          phone: formData.phone,
          email: formData.email,
          address: formData.address
        });
        toast.success('Configuración general actualizada');
      } else {
        // Crear nueva empresa por primera vez
        await createCompany({
          name: formData.name,
          legal_name: formData.legal_name,
          rfc: formData.rfc,
          phone: formData.phone,
          email: formData.email,
          address: formData.address
        });
        toast.success('Empresa registrada con éxito');
      }
      
      // Redirigir al dashboard después de guardar (simula cerrar el cuadro de diálogo)
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Error al guardar: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const glassStyle = "bg-slate-900/60 backdrop-blur-2xl border-t border-l border-white/20 border-b border-r border-black/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-3xl overflow-hidden";
  const glassInputStyle = "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:ring-blue-500/50 focus:border-blue-500/50 h-12 rounded-xl transition-all hover:bg-white/10";
  const labelStyle = "text-slate-300 font-semibold mb-2 block text-sm";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Configuración</h1>
        <p className="text-slate-500 mt-1">Administra las preferencias y ajustes de tu sistema POS.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-8 h-auto p-1 bg-slate-100/50">
          <TabsTrigger value="general" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <Settings className="w-4 h-4 mr-2" /> General
          </TabsTrigger>
          <TabsTrigger value="empresa" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <Building2 className="w-4 h-4 mr-2" /> Empresa
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <Users className="w-4 h-4 mr-2" /> Usuarios
          </TabsTrigger>
          <TabsTrigger value="roles" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <Shield className="w-4 h-4 mr-2" /> Roles
          </TabsTrigger>
          <TabsTrigger value="impuestos" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <Receipt className="w-4 h-4 mr-2" /> Impuestos
          </TabsTrigger>
          <TabsTrigger value="pago" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <CreditCard className="w-4 h-4 mr-2" /> Pago
          </TabsTrigger>
          <TabsTrigger value="mantenimiento" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-orange-600">
            <Database className="w-4 h-4 mr-2" /> Mantenimiento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="animate-in slide-in-from-bottom-2 duration-300">
          <Card className={glassStyle}>
            <CardHeader className="border-b border-white/5 pb-6">
              <CardTitle className="text-2xl text-white">Ajustes Generales</CardTitle>
              <CardDescription className="text-slate-400">Información básica de tu negocio y preferencias regionales.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className={labelStyle}>Nombre Comercial</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    className={glassInputStyle}
                    placeholder="Ej. Mi Tiendita" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legal_name" className={labelStyle}>Razón Social</Label>
                  <Input 
                    id="legal_name" 
                    value={formData.legal_name}
                    onChange={handleChange}
                    className={glassInputStyle}
                    placeholder="Ej. Mi Tiendita S.A. de C.V." 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfc" className={labelStyle}>RFC / Identificación Fiscal</Label>
                  <Input 
                    id="rfc" 
                    value={formData.rfc}
                    onChange={handleChange}
                    className={glassInputStyle}
                    placeholder="XAXX010101000" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className={labelStyle}>Moneda Principal</Label>
                  <Input 
                    id="currency" 
                    defaultValue="MXN" 
                    disabled 
                    className={cn(glassInputStyle, "opacity-50 cursor-not-allowed")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className={labelStyle}>Teléfono</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={handleChange}
                    className={glassInputStyle}
                    placeholder="(555) 123-4567" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className={labelStyle}>Correo Electrónico</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className={glassInputStyle}
                    placeholder="contacto@mitiendita.com" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className={labelStyle}>Dirección Principal</Label>
                  <Input 
                    id="address" 
                    value={formData.address}
                    onChange={handleChange}
                    className={glassInputStyle}
                    placeholder="Calle, Número, Colonia, Ciudad, C.P." 
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSaveGeneral}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</>
                  ) : (
                    'Guardar Cambios'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empresa">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Empresa y Sucursales</CardTitle>
              <CardDescription>Gestiona la estructura de tu organización.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-900">Empresa Actual</h3>
                <p className="text-slate-600 mt-1">{company?.name || 'No configurada'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">Sucursales</h3>
                    <p className="text-sm text-slate-500">Sucursal activa: {branch?.name || 'Ninguna'}</p>
                  </div>
                  <Button variant="outline" size="sm">Crear Sucursal</Button>
                </div>
                <div className="text-sm text-slate-500 italic">
                  La gestión avanzada de sucursales estará disponible próximamente.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuarios">
          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Usuarios del Sistema</CardTitle>
                  <CardDescription>Administra quién tiene acceso al punto de venta.</CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Nuevo Usuario</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900">Módulo en construcción</h3>
                <p className="text-slate-500 mt-1">Pronto podrás invitar y gestionar a tu equipo desde aquí.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Roles y Permisos</CardTitle>
                  <CardDescription>Define qué puede hacer cada tipo de usuario.</CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Crear Rol</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900">Módulo en construcción</h3>
                <p className="text-slate-500 mt-1">Pronto podrás configurar permisos granulares.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impuestos">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Configuración de Impuestos</CardTitle>
              <CardDescription>Establece las tasas impositivas por defecto para tus productos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="iva">IVA (%)</Label>
                  <Input id="iva" type="number" defaultValue="16" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ieps">IEPS (%)</Label>
                  <Input id="ieps" type="number" defaultValue="0" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">Guardar Impuestos</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pago">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
              <CardDescription>Selecciona los métodos de pago que aceptas en tu negocio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border border-slate-100 rounded-lg bg-slate-50">
                  <Checkbox id="cash" defaultChecked />
                  <Label htmlFor="cash" className="font-medium cursor-pointer">Efectivo</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-slate-100 rounded-lg bg-slate-50">
                  <Checkbox id="card" defaultChecked />
                  <Label htmlFor="card" className="font-medium cursor-pointer">Tarjeta de Crédito / Débito</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-slate-100 rounded-lg bg-slate-50">
                  <Checkbox id="transfer" defaultChecked />
                  <Label htmlFor="transfer" className="font-medium cursor-pointer">Transferencia Bancaria</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-slate-100 rounded-lg bg-slate-50">
                  <Checkbox id="vouchers" />
                  <Label htmlFor="vouchers" className="font-medium cursor-pointer">Vales de Despensa</Label>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">Guardar Métodos</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mantenimiento">
          <Card className="border-2 border-orange-100 bg-orange-50/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Database className="w-6 h-6" /> Herramientas de Migración
              </CardTitle>
              <CardDescription>Usa estas herramientas para mover tu base de datos a un servidor en la nube.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white border border-orange-200 rounded-xl space-y-4">
                <h4 className="font-bold text-slate-800">Exportar Esquema (JSON)</h4>
                <p className="text-sm text-slate-600">Este archivo contiene la estructura de tus tablas (usuarios, productos, inventario). Es indispensable para configurar PocketHost.</p>
                <Button 
                  onClick={() => {
                    const schema = [
                      { "name": "users", "type": "auth" },
                      { "name": "companies", "type": "base", "schema": [{ "name": "name", "type": "text", "required": true }, { "name": "logo", "type": "file" }] },
                      { "name": "branches", "type": "base", "schema": [{ "name": "company_id", "type": "relation", "options": { "collectionId": "companies" } }, { "name": "name", "type": "text", "required": true }] },
                      { "name": "products", "type": "base", "schema": [{ "name": "company_id", "type": "relation", "options": { "collectionId": "companies" } }, { "name": "barcode", "type": "text" }, { "name": "name", "type": "text", "required": true }, { "name": "category", "type": "text" }, { "name": "provider", "type": "text" }, { "name": "price", "type": "number", "required": true }] },
                      { "name": "inventory", "type": "base", "schema": [{ "name": "product_id", "type": "relation", "options": { "collectionId": "products" } }, { "name": "branch_id", "type": "relation", "options": { "collectionId": "branches" } }, { "name": "stock", "type": "number", "required": true }] }
                    ];
                    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'pocketbase_schema.json';
                    link.click();
                  }}
                  className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Descargar Archivo JSON
                </Button>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-xs text-blue-700 leading-relaxed">
                  <strong>Instrucciones:</strong> Una vez descargado el archivo, ve al panel de Administración de PocketHost (Settings &gt; Import collections) y simplemente arrastra este archivo o haz clic en "Load from JSON file".
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
