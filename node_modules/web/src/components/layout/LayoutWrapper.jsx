
import React, { useState, useEffect } from 'react';
import { Menu, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Sidebar from './Sidebar.jsx';

const LayoutWrapper = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('minisuper_sidebar_collapsed');
    return saved === 'true';
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('minisuper_sidebar_collapsed', isCollapsed);
  }, [isCollapsed]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Render Sidebar exactly ONCE here */}
      <Sidebar 
        collapsed={isCollapsed} 
        onToggle={toggleSidebar}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden md:block">
              <h2 className="text-lg font-bold tracking-tight">Mi Tienda</h2>
              <p className="text-xs text-muted-foreground font-medium">Sucursal Centro</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:block text-right">
              <p className="text-sm font-medium capitalize text-foreground/90">
                {format(currentTime, "EEEE, d 'de' MMMM yyyy", { locale: es })}
              </p>
              <p className="text-xs text-muted-foreground font-medium tabular-nums">
                {format(currentTime, "HH:mm:ss")}
              </p>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Juan Pérez</p>
                <p className="text-xs text-muted-foreground font-medium">Cajero</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
                <UserCircle className="w-8 h-8 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-background relative max-h-[calc(100dvh-4rem)] scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
