
import React from 'react';
import { Menu, Bell, Search, User, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/context/ThemeContext.jsx';
import { CompanySelector } from '@/modules/shared/components/CompanySelector.jsx';
import { BranchSelector } from '@/modules/shared/components/BranchSelector.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Topbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden md:flex items-center gap-4">
          <CompanySelector />
          <div className="h-4 w-px bg-border"></div>
          <BranchSelector />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Buscar..." 
            className="w-full pl-9 bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>

        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-card"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Administrador</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@minisuper.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notificaciones</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
