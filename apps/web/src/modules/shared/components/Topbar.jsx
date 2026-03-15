
import React from 'react';
import { useAuth } from '../../core/contexts/AuthContext.jsx';
import { useBranch } from '../../core/contexts/BranchContext.jsx';
import { LogOut, User as UserIcon, Settings, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import pb from '@/lib/pocketbaseClient.js';
import { cn } from '@/lib/utils';

import { useEditor } from '../../core/contexts/EditorContext.jsx';

export const Topbar = () => {
  const { user, logout } = useAuth();
  const { branch, branches, switchBranch, isLoading: branchLoading } = useBranch();
  const { isEditMode, toggleEditMode } = useEditor();

  const userInitials = user?.name 
    ? user.name.substring(0, 2).toUpperCase() 
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  const avatarUrl = user?.avatar ? pb.files.getUrl(user, user.avatar) : null;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
      <div className="flex items-center gap-4">
        {/* Branch Selector */}
        {branches.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2 border-gray-200 text-gray-700">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="max-w-[150px] truncate">
                  {branchLoading ? 'Cargando...' : (branch?.name || 'Seleccionar Sucursal')}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Mis Sucursales</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {branches.map((b) => (
                <DropdownMenuItem 
                  key={b.id} 
                  onClick={() => switchBranch(b.id)}
                  className={branch?.id === b.id ? "bg-green-50 text-green-700 font-medium" : ""}
                >
                  {b.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      <div className="flex items-center gap-6">
        {/* Pulsing LED Button - ver. 2.0 */}
        <button 
          onClick={toggleEditMode}
          className={`group flex items-center gap-2 px-2 py-1 rounded-lg transition-all duration-300 bg-transparent border-none ${
            isEditMode ? 'opacity-100' : 'opacity-70 hover:opacity-100 hover:scale-105'
          }`}
          title={isEditMode ? "Desactivar Modo Editor" : "Activar Modo Editor"}
        >
          <div className="relative flex items-center justify-center">
             <div className={cn(
               "w-2 h-2 rounded-full transition-all duration-500",
               isEditMode ? "bg-blue-400 shadow-[0_0_10px_#60a5fa]" : "bg-[#00ff00] shadow-[0_0_8px_rgba(0,255,0,0.5)]"
             )}></div>
             <div className={cn(
               "absolute w-2 h-2 rounded-full animate-ping opacity-75 transition-all duration-500",
               isEditMode ? "bg-blue-400" : "bg-[#00ff00]/50"
             )}></div>
          </div>
          <span className="font-black text-[10px] tracking-widest text-[#2563EB]">VER. 2.0</span>
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-green-500">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900 leading-none">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
              </div>
              <Avatar className="h-9 w-9 border border-gray-200">
                <AvatarImage src={avatarUrl} alt={user?.name || 'Avatar'} />
                <AvatarFallback className="bg-green-100 text-green-700 font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <UserIcon className="w-4 h-4 text-gray-500" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Settings className="w-4 h-4 text-gray-500" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={logout}
              className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
