import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TravelDataProvider } from "@/contexts/TravelDataContext";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import TravelRequests from "@/pages/shared/TravelRequests";
import Destinations from "@/pages/shared/Destinations";

// Dashboards por perfil
import AdminDashboard from "@/pages/admin/AdminDashboard";
import GestorDashboard from "@/pages/gestor/GestorDashboard";
import RHDashboard from "@/pages/hr/RHDashboard";

// RH pages
import Contracts from "@/pages/hr/Contracts";
import Collaborators from "@/pages/hr/Collaborators";
import Financial from "@/pages/hr/Financial";
import Notifications from "@/pages/hr/Notifications";

// Gestor pages
import Approvals from "@/pages/gestor/Approvals";
import History from "@/pages/gestor/History";

// Admin pages
import Reports from "@/pages/admin/Reports";
import Analytics from "@/pages/admin/Analytics";
import SettingsPage from "@/pages/admin/SettingsPage";
import UserManagement from "@/pages/admin/UserManagement";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Componente para escolher o dashboard baseado no perfil
const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }
  if (user?.role === "gestor") {
    return <GestorDashboard />;
  }
  return <RHDashboard />;
};

const ProtectedRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Dashboard dinâmico por perfil */}
        <Route path="/" element={<DashboardRouter />} />
        
        {/* Rotas compartilhadas */}
        <Route path="/solicitacoes" element={<TravelRequests />} />
        <Route path="/destinos" element={<Destinations />} />
        
        {/* RH routes */}
        {(user?.role === "rh" || user?.role === "admin") && (
          <>
            <Route path="/contratos" element={<Contracts />} />
            <Route path="/colaboradores" element={<Collaborators />} />
            <Route path="/financeiro" element={<Financial />} />
            <Route path="/notificacoes" element={<Notifications />} />
          </>
        )}
        
        {/* Gestor routes */}
        {(user?.role === "gestor" || user?.role === "admin") && (
          <>
            <Route path="/aprovacoes" element={<Approvals />} />
            <Route path="/historico" element={<History />} />
          </>
        )}
        
        {/* Admin routes */}
        {user?.role === "admin" && (
          <>
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/analises" element={<Analytics />} />
            <Route path="/utilizadores" element={<UserManagement />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
          </>
        )}
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <TravelDataProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TravelDataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;