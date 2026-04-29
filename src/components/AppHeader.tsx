// components/AppHeader.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Search, Menu, X, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

const AppHeader = ({ onMenuClick, sidebarOpen }: AppHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4">
        {/* Botão Menu Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Logo Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-800 text-sm">TravelControl</span>
        </div>

        {/* Barra de Pesquisa */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Pesquisar..."
              className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Ações à direita */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Notificações */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </Button>

          {/* Separador */}
          <div className="h-8 w-px bg-gray-200 hidden md:block" />

          {/* Perfil do Utilizador */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-[10px] px-2 py-0 h-5",
                  user?.role === "rh" && "bg-blue-50 text-blue-700 border-blue-200",
                  user?.role === "gestor" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                  user?.role === "admin" && "bg-purple-50 text-purple-700 border-purple-200"
                )}
              >
                {user?.role === "rh" ? "Recursos Humanos" : 
                 user?.role === "gestor" ? "Gestor" : "Administrador"}
              </Badge>
            </div>
            
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 p-0">
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                {user?.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa Mobile */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Pesquisar..."
            className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;