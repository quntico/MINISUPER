
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Store, 
  MapPin, 
  User, 
  MonitorSmartphone, 
  Receipt, 
  CreditCard, 
  DatabaseBackup, 
  Info,
  Wrench
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SettingsNegocio from '@/components/settings/SettingsNegocio.jsx';
import SettingsSucursal from '@/components/settings/SettingsSucursal.jsx';
import SettingsUsuario from '@/components/settings/SettingsUsuario.jsx';
import SettingsSistema from '@/components/settings/SettingsSistema.jsx';
import SettingsImpuestos from '@/components/settings/SettingsImpuestos.jsx';
import SettingsMetodosPago from '@/components/settings/SettingsMetodosPago.jsx';
import SettingsRespaldo from '@/components/settings/SettingsRespaldo.jsx';
import SettingsAcercaDe from '@/components/settings/SettingsAcercaDe.jsx';

const initialFormData = {
  negocio: {
    nombre: 'Mi Tienda',
    rfc: 'ABC123456XYZ',
    razonSocial: 'Mi Tienda S.A. de C.V.',
    telefono: '+52 555 1234567',
    email: 'info@mitienda.com',
    direccion: 'Calle Principal 123',
    ciudad: 'Ciudad de México',
    estado: 'Ciudad de México',
    cp: '06500',
    logo: null,
    descripcion: 'Los mejores productos al mejor precio'
  },
  sucursal: {
    nombre: 'Sucursal Centro',
    codigo: 'SC-001',
    telefono: '+52 555 1234567',
    email: 'centro@mitienda.com',
    direccion: 'Calle Principal 123',
    ciudad: 'Ciudad de México',
    estado: 'Ciudad de México',
    cp: '06500',
    gerente: 'Juan Pérez',
    estatus: 'Activa',
    apertura: '08:00',
    cierre: '22:00'
  },
  usuario: {
    nombre: 'Juan Pérez',
    username: 'jperez',
    email: 'juan@mitienda.com',
    telefono: '+52 555 9876543',
    rol: 'Administrador',
    foto: null,
    estatus: 'Activo',
    fechaCreacion: '15 Oct 2023',
    ultimoAcceso: 'Hoy a las 14:30'
  },
  sistema: {
    tema: 'Oscuro',
    idioma: 'Español',
    moneda: 'MXN',
    simbolo: '$',
    formatoFecha: 'DD/MM/YYYY',
    formatoHora: '24h',
    decimales: 2,
    impresora: 'EPSON TM-T20III',
    papel: '80mm',
    sesion: '15',
    notificaciones: true,
    sonido: true,
    volumen: 80
  }
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('negocio');
  const [formData, setFormData] = useState(initialFormData);
  const [isDirty, setIsDirty] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [dbData, setDbData] = useState({ company: null, branch: null });

  const loadData = async () => {
    try {
      setLoadingInitial(true);
      // Obtener la empresa (la primera disponible o por slug)
      let company = null;
      try {
        company = await pb.collection('companies').getFirstListItem('', { $autoCancel: false });
      } catch (e) {
        // No hay empresa
      }

      let branch = null;
      if (company) {
        try {
          branch = await pb.collection('branches').getFirstListItem(`company_id="${company.id}"`, { $autoCancel: false });
        } catch (e) {
          // No hay sucursal
        }
      }

      setDbData({ company, branch });

      // Mapear datos de DB a Formulario
      if (company) {
        setFormData(prev => ({
          ...prev,
          negocio: {
            ...prev.negocio,
            nombre: company.name || '',
            rfc: company.rfc || '',
            razonSocial: company.razon_social || '',
            telefono: company.phone || '',
            email: company.email || '',
            direccion: company.address || '',
            ciudad: company.city || '',
            estado: company.state || '',
            cp: company.zip || '',
            descripcion: company.description || ''
          }
        }));
      }

      if (branch) {
        setFormData(prev => ({
          ...prev,
          sucursal: {
            ...prev.sucursal,
            nombre: branch.name || '',
            codigo: branch.code || '',
            telefono: branch.phone || '',
            email: branch.email || '',
            direccion: branch.address || '',
            ciudad: branch.city || '',
            estado: branch.state || '',
            cp: branch.zip || '',
            gerente: branch.manager || '',
            apertura: branch.opening_time || '08:00',
            cierre: branch.closing_time || '22:00'
          }
        }));
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoadingInitial(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleDataChange = (section, newData) => {
    setFormData(prev => ({
      ...prev,
      [section]: newData
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      const companyData = {
        name: formData.negocio.nombre,
        rfc: formData.negocio.rfc,
        razon_social: formData.negocio.razonSocial,
        phone: formData.negocio.telefono,
        email: formData.negocio.email,
        address: formData.negocio.direccion,
        city: formData.negocio.ciudad,
        state: formData.negocio.estado,
        zip: formData.negocio.cp,
        description: formData.negocio.descripcion
      };

      if (dbData.company) {
        await pb.collection('companies').update(dbData.company.id, companyData);
      } else {
        const newComp = await pb.collection('companies').create({ ...companyData, slug: 'minisuper' });
        setDbData(prev => ({ ...prev, company: newComp }));
      }

      const branchData = {
        name: formData.sucursal.nombre,
        code: formData.sucursal.codigo,
        phone: formData.sucursal.telefono,
        email: formData.sucursal.email,
        address: formData.sucursal.direccion,
        city: formData.sucursal.ciudad,
        state: formData.sucursal.estado,
        zip: formData.sucursal.cp,
        manager: formData.sucursal.gerente,
        opening_time: formData.sucursal.apertura,
        closing_time: formData.sucursal.cierre,
        company_id: dbData.company?.id || (await pb.collection('companies').getFirstListItem('')).id
      };

      if (dbData.branch) {
        await pb.collection('branches').update(dbData.branch.id, branchData);
      } else {
        await pb.collection('branches').create({ ...branchData, is_active: true });
      }

      toast.success('¡Configuración guardada exitosamente!');
      setIsDirty(false);
      
      // Esperar un momento para que el usuario vea el mensaje y luego redirigir/recargar
      setTimeout(() => {
        navigate('/'); // Redirigir al Dashboard
        window.location.reload(); // Recargar para actualizar los nombres en la sidebar
      }, 1500); 

    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar la configuración. Revisa los permisos.');
    }
  };

  const handleCancel = () => {
    loadData(); // Recargar de la DB
    setIsDirty(false);
    toast.info('Cambios descartados');
  };

  const tabs = [
    { id: 'negocio', label: 'Negocio', icon: Store, component: <SettingsNegocio data={formData.negocio} onChange={(d) => handleDataChange('negocio', d)} /> },
    { id: 'sucursal', label: 'Sucursal', icon: MapPin, component: <SettingsSucursal data={formData.sucursal} onChange={(d) => handleDataChange('sucursal', d)} /> },
    { id: 'usuario', label: 'Usuario', icon: User, component: <SettingsUsuario data={formData.usuario} onChange={(d) => handleDataChange('usuario', d)} /> },
    { id: 'sistema', label: 'Sistema', icon: MonitorSmartphone, component: <SettingsSistema data={formData.sistema} onChange={(d) => handleDataChange('sistema', d)} /> },
    { id: 'impuestos', label: 'Impuestos', icon: Receipt, component: <SettingsImpuestos /> },
    { id: 'pagos', label: 'Métodos de Pago', icon: CreditCard, component: <SettingsMetodosPago /> },
    { id: 'respaldo', label: 'Respaldo', icon: DatabaseBackup, component: <SettingsRespaldo /> },
    { id: 'acerca', label: 'Acerca de', icon: Info, component: <SettingsAcercaDe /> },
  ];

  return (
    <>
      <Helmet>
        <title>Configuración - MINISUPER</title>
      </Helmet>

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-border bg-card shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
              <Settings className="w-7 h-7 text-primary" />
              Configuración
            </h1>
            <p className="text-muted-foreground mt-1">
              Administra las preferencias y parámetros de tu sistema.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={!isDirty}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!isDirty}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm"
            >
              Guardar Cambios
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col md:flex-row gap-8">
            <TabsList className="flex flex-row md:flex-col h-auto w-full md:w-64 bg-transparent p-0 gap-2 overflow-x-auto md:overflow-visible justify-start shrink-0">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const trigger = (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="w-full justify-start gap-3 px-4 py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted transition-colors whitespace-nowrap"
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </TabsTrigger>
                );

                if (tab.id === 'respaldo') {
                  return (
                    <React.Fragment key={tab.id}>
                      {trigger}
                      <button
                        key="herramientas-btn"
                        onClick={() => navigate('/radiografia')}
                        className={cn(
                          "w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap text-sm font-medium",
                          location.pathname === '/radiografia'
                            ? "bg-[#dcfce7] text-[#15803d]"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Wrench className="w-5 h-5" />
                        Herramientas
                      </button>
                    </React.Fragment>
                  );
                }
                return trigger;
              })}
            </TabsList>

            <div className="flex-1 overflow-y-auto pr-2 pb-20 md:pb-0">
              {tabs.map(tab => (
                <TabsContent key={tab.id} value={tab.id} className="m-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                    {tab.component}
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
