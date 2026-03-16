
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Boxes, 
  Receipt, 
  BarChart3, 
  Settings,
  Store,
  Activity,
  Camera,
  Edit2,
  Check,
  X as CloseIcon
} from 'lucide-react';
import { useCompany } from '../../core/contexts/CompanyContext.jsx';
import { useBranch } from '../../core/contexts/BranchContext.jsx';
import { usePermissions } from '../../core/contexts/PermissionsContext.jsx';
import { useEditor } from '../../core/contexts/EditorContext.jsx';
import { cn } from '@/lib/utils.js';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

export const Sidebar = () => {
  const location = useLocation();
  const { company, isLoading: companyLoading, updateCompany } = useCompany();
  const { branch, isLoading: branchLoading } = useBranch();
  const { canAccess } = usePermissions();
  const { isEditMode } = useEditor();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNameSize, setNewNameSize] = useState(18);
  const [newNameColor, setNewNameColor] = useState('#000000');
  const [logoSize, setLogoSize] = useState(40);
  const [submenuColor, setSubmenuColor] = useState('#f8fafc'); // slate-50 default
  const [nameOffsetX, setNameOffsetX] = useState(0);
  const [nameOffsetY, setNameOffsetY] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (company) {
      setNewName(company.name || '');
      setNewNameSize(company.name_size || 18);
      setNewNameColor(company.name_color || '#000000');
      setLogoSize(company.logo_size || 40);
      setSubmenuColor(company.submenu_color || '#f8fafc');
      setNameOffsetX(company.name_offset_x || 0);
      setNameOffsetY(company.name_offset_y || 0);
    }
  }, [company]);

  const handleNameSave = async () => {
    let targetCompany = company;

    // Si no hay empresa en el contexto, intentar obtener la primera de la DB
    if (!targetCompany) {
      try {
        targetCompany = await pb.collection('companies').getFirstListItem('', { $autoCancel: false });
      } catch (e) {
        // Si realmente no existe ninguna, crear una por defecto
        try {
          targetCompany = await pb.collection('companies').create({ 
            name: newName || 'Mi Negocio',
            slug: 'mi-negocio'
          }, { $autoCancel: false });
        } catch (err) {
          console.error('Error creating fallback company:', err);
        }
      }
    }

    if (!targetCompany) {
      toast.error('No se pudo encontrar o crear una empresa para guardar');
      return;
    }

    try {
      await updateCompany(targetCompany.id, { 
        name: newName,
        name_size: newNameSize,
        name_color: newNameColor,
        logo_size: logoSize,
        submenu_color: submenuColor,
        name_offset_x: nameOffsetX,
        name_offset_y: nameOffsetY
      });
      setIsEditingName(false);
      toast.success('Marca del establecimiento actualizada');
      
      // Forzar recarga ligera para que los demás componentes vean la empresa
      if (!company) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving name:', error);
      toast.error('Error al actualizar nombre');
    }
  };

  const handleLogoUpload = async (e) => {
    if (!company) {
      toast.error('No hay una empresa activa');
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('png')) {
      toast.error('Por favor sube una imagen PNG');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    try {
      await updateCompany(company.id, formData);
      toast.success('Logo actualizado correctamente');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Error al subir el logo');
    }
  };

  const logoUrl = company?.logo 
    ? pb.files.getUrl(company, company.logo) 
    : null;

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', module: 'dashboard' },
    { path: '/pos', icon: ShoppingCart, label: 'Punto de Venta', module: 'pos' },
    { path: '/products', icon: Package, label: 'Productos', module: 'products' },
    { path: '/inventory', icon: Boxes, label: 'Inventario', module: 'inventory' },
    { path: '/sales', icon: Receipt, label: 'Ventas', module: 'sales' },
    { path: '/reports', icon: BarChart3, label: 'Reportes', module: 'reports' },
  ];

  const configItems = [
    { path: '/configuration', icon: Settings, label: 'Configuración', module: 'settings' },
    { path: '/diagnostic', icon: Activity, label: 'Radiografía del Sistema', module: 'settings' },
  ];

  const renderNavLink = (item) => {
    // 🔓 MODO LIBRE: Durante esta fase de migración, permitimos ver todos los botones
    // para asegurar que el usuario nunca quede atrapado sin poder configurar.
    const isActive = location.pathname === item.path || 
                    (item.path !== '/' && location.pathname.startsWith(item.path));

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          isActive 
            ? "bg-blue-50 text-blue-700" 
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <item.icon className={cn(
          "w-5 h-5",
          isActive ? "text-blue-600" : "text-slate-400"
        )} />
        {item.label}
      </NavLink>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-10 transition-all duration-300">
      {/* Logo & Company Info */}
      <div className={cn(
        "min-h-[80px] flex flex-col justify-center px-6 border-b border-slate-100 transition-all duration-300",
        isEditMode ? "bg-green-50/30" : ""
      )}>
        <div 
          className={cn(
            "flex items-center gap-3 group relative transition-all duration-200 rounded-lg p-2 -ml-2",
            isEditMode ? "hover:bg-blue-50/50 cursor-pointer" : ""
          )}
          onClick={() => {
            if (isEditMode && !isEditingName) {
              setNewName(company?.name || '');
              setIsEditingName(true);
            }
          }}
        >
          <div className="relative">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Logo" 
                style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                className="object-contain rounded-lg shadow-sm" 
              />
            ) : (
              <div 
                style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                className="bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shadow-sm"
              >
                <Store style={{ width: `${logoSize * 0.6}px`, height: `${logoSize * 0.6}px` }} />
              </div>
            )}
            
            {isEditMode && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-green-600 text-white rounded-full p-1 shadow-lg hover:bg-green-700 transition-colors"
                title="Subir Logo (PNG)"
              >
                <Camera className="w-3 h-3" />
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleLogoUpload} 
              className="hidden" 
              accept="image/png"
            />
          </div>

          <div className="flex-1 min-w-0">
            {isEditMode && isEditingName && (
              <div 
                className="fixed left-72 top-20 z-[100] w-80 p-6 rounded-2xl border border-white/40 shadow-2xl backdrop-blur-xl bg-white/30 animate-in fade-in zoom-in duration-300"
                style={{
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Editor de Marca</h3>
                    <div className="flex gap-2">
                      <button onClick={handleNameSave} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-xl shadow-lg transition-all hover:scale-110">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setIsEditingName(false)} className="bg-white/50 hover:bg-white text-slate-600 p-2 rounded-xl shadow-sm transition-all">
                        <CloseIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Nombre Comercial</label>
                      <input
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nombre negocio"
                        className="w-full bg-white/60 border border-white/50 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Tamaño Fuente</label>
                        <input 
                          type="number" 
                          value={newNameSize}
                          onChange={(e) => setNewNameSize(parseInt(e.target.value))}
                          className="w-full bg-white/60 border border-white/50 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Color Fuente</label>
                        <div className="relative group">
                          <input 
                            type="color" 
                            value={newNameColor}
                            onChange={(e) => setNewNameColor(e.target.value)}
                            className="w-full h-9 border border-white/50 rounded-xl p-0.5 cursor-pointer bg-white/60"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Fondo Contexto</label>
                        <input 
                          type="color" 
                          value={submenuColor}
                          onChange={(e) => setSubmenuColor(e.target.value)}
                          className="w-full h-9 border border-white/50 rounded-xl p-0.5 cursor-pointer bg-white/60"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Tamaño Logo</label>
                        <input 
                          type="number" 
                          value={logoSize}
                          onChange={(e) => setLogoSize(parseInt(e.target.value))}
                          className="w-full bg-white/60 border border-white/50 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Posición X</label>
                        <input 
                          type="number" 
                          value={nameOffsetX}
                          onChange={(e) => setNameOffsetX(parseInt(e.target.value))}
                          className="w-full bg-white/60 border border-white/50 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Posición Y</label>
                        <input 
                          type="number" 
                          value={nameOffsetY}
                          onChange={(e) => setNameOffsetY(parseInt(e.target.value))}
                          className="w-full bg-white/60 border border-white/50 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-500 italic text-center mt-2">
                    * Los cambios se ven reflejados en tiempo real en la barra lateral.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span 
                className="font-black tracking-tight truncate leading-tight transition-transform duration-200"
                style={{ 
                  fontSize: `${newNameSize}px`,
                  color: newNameColor,
                  transform: `translate(${nameOffsetX}px, ${nameOffsetY}px)`
                }}
              >
                {companyLoading ? 'Cargando...' : (newName || 'Sistema POS')}
              </span>
                {isEditMode && (
                  <button 
                    onClick={() => {
                      setNewName(company?.name || '');
                      setIsEditingName(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-green-600"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>
          </div>
        </div>
      </div>

      {/* Context Info */}
      <div 
        className="px-6 py-4 border-b border-slate-100 transition-colors"
        style={{ backgroundColor: submenuColor }}
      >
        <p className="text-sm font-semibold text-slate-900 truncate">
          {companyLoading ? 'Cargando empresa...' : (newName || 'Sin empresa asignada')}
        </p>
        <p className="text-xs text-slate-500 truncate mt-0.5">
          {branchLoading ? 'Cargando sucursal...' : (branch?.name || 'Sin sucursal asignada')}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div className="space-y-1">
          {menuItems.map(renderNavLink)}
        </div>

        <div>
          <h4 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Administración
          </h4>
          <div className="space-y-1">
            {configItems.map(renderNavLink)}
          </div>
        </div>
      </nav>
    </aside>
  );
};
