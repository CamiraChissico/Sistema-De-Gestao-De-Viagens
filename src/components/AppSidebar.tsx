import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, Plane, BarChart3, LogOut, Bell,
  Users, Settings, Wallet, Globe, ClipboardCheck, History, PieChart, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/", roles: ["rh", "gestor", "admin"] },
  { label: "Contratos", icon: FileText, path: "/contratos", roles: ["rh"] },
  { label: "Solicitações", icon: Plane, path: "/solicitacoes", roles: ["rh", "admin"] },
  { label: "Aprovações", icon: ClipboardCheck, path: "/aprovacoes", roles: ["gestor"] },
  { label: "Colaboradores", icon: Users, path: "/colaboradores", roles: ["rh"] },
  { label: "Financeiro", icon: Wallet, path: "/financeiro", roles: ["rh", "admin"] },
  { label: "Notificações", icon: Bell, path: "/notificacoes", roles: ["rh"] },
  { label: "Destinos", icon: Globe, path: "/destinos", roles: ["rh", "gestor", "admin"] },
  { label: "Histórico", icon: History, path: "/historico", roles: ["gestor", "admin"] },
  { label: "Relatórios", icon: BarChart3, path: "/relatorios", roles: ["admin"] },
  { label: "Análises", icon: PieChart, path: "/analises", roles: ["admin"] },
  { label: "Utilizadores", icon: Shield, path: "/utilizadores", roles: ["admin"] },
  { label: "Configurações", icon: Settings, path: "/configuracoes", roles: ["admin"] },
];

const roleLabels: Record<UserRole, string> = {
  rh: "Recursos Humanos",
  gestor: "Gestor",
  admin: "Administração",
};

const roleBadgeColors: Record<UserRole, string> = {
  rh: "bg-blue-50 text-blue-700",
  gestor: "bg-emerald-50 text-emerald-700",
  admin: "bg-purple-50 text-purple-700",
};

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const filteredItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <aside className="w-[280px] min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200 flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight">TravelControl</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Gestão de Viagens</p>
          </div>
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold px-3 pb-2">Menu Principal</p>
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-white" : "text-slate-400")} />
              {item.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />}
            </button>
          );
        })}
      </nav>

      {/* Perfil do Utilizador */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
            {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-1", roleBadgeColors[user.role])}>
              {roleLabels[user.role]}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Terminar Sessão
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;