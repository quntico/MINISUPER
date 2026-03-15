
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Truck,
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  Wallet,
  BrainCircuit,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Sidebar = ({ collapsed, onToggle, isMobileOpen, onMobileClose }) => {
  const location = useLocation();

  const navSections = [
    {
      title: 'PRINCIPAL',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'OPERACIÓN',
      items: [
        { name: 'Punto de Venta', path: '/caja', icon: ShoppingCart },
        { name: 'Productos', path: '/productos', icon: Package },
      ]
    },
    {
      title: 'ADMINISTRACIÓN',
      items: [
        { name: 'Control de Caja', path: '/control-caja', icon: Wallet },
        { name: 'Inventario', path: '/inventario', icon: Package },
        { name: 'Reportes', path: '/reportes', icon: BarChart3 },
      ]
    },
    {
      title: 'INTELIGENCIA',
      items: [
        { name: 'Centro IA', path: '/inteligencia', icon: BrainCircuit },
      ]
    },
    {
      title: 'SISTEMA',
      items: [
        { name: 'Configuración', path: '/configuracion', icon: Settings },
        { name: 'Radiografía', path: '/radiografia', icon: Search },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-card border-r border-border flex flex-col sidebar-transition',
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64',
          'md:relative md:translate-x-0',
          collapsed ? 'md:w-20' : 'md:w-64'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          <div className="flex items-center overflow-hidden whitespace-nowrap">
            <span className={cn(
              "font-black text-primary tracking-tight transition-all duration-300",
              collapsed ? "text-2xl ml-1" : "text-xl ml-2"
            )}>
              {collapsed ? 'MS' : 'MINISUPER'}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden md:flex h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="md:hidden h-8 w-8 text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-4 overflow-y-auto overflow-x-hidden py-4">
          <TooltipProvider delayDuration={0}>
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {!collapsed && (
                  <p className="px-3 text-xs font-bold text-muted-foreground/70 uppercase tracking-wider mb-2">
                    {section.title}
                  </p>
                )}
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
                  const Icon = item.icon;

                  const linkContent = (
                    <Link
                      to={item.path}
                      onClick={() => isMobileOpen && onMobileClose()}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        collapsed ? "justify-center" : "justify-start"
                      )}
                    >
                      <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                      {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
                    </Link>
                  );

                  return collapsed ? (
                    <Tooltip key={item.name}>
                      <TooltipTrigger asChild>
                        {linkContent}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div key={item.name}>{linkContent}</div>
                  );
                })}
              </div>
            ))}
          </TooltipProvider>
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-border shrink-0">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
                    collapsed ? "justify-center px-0" : "justify-start px-4"
                  )}
                >
                  <LogOut className={cn("w-5 h-5 shrink-0", !collapsed && "mr-3")} />
                  {!collapsed && <span className="whitespace-nowrap">Cerrar Sesión</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Cerrar Sesión</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
