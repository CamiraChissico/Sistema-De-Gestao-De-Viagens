import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, CheckCircle2, XCircle, Mail, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "pending";
}

const roleLabels: Record<UserRole, string> = { 
  rh: "Recursos Humanos", 
  gestor: "Gestor", 
  admin: "Administração" 
};

const roleBadgeColors: Record<UserRole, string> = {
  rh: "bg-blue-100 text-blue-700",
  gestor: "bg-emerald-100 text-emerald-700",
  admin: "bg-purple-100 text-purple-700",
};

const UserManagement = () => {
  const { allUsers, approveUser, removeUser, addUser } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "rh" as UserRole });

  const activeUsers = allUsers.filter((u: AuthUser) => u.status === "active");
  const pendingUsers = allUsers.filter((u: AuthUser) => u.status === "pending");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }
    const defaultPassword = "123456";
    const result = addUser(formData.name, formData.email, defaultPassword, formData.role);
    if (result.success) {
      toast({ title: "Sucesso", description: `Utilizador ${formData.name} criado com sucesso.` });
      setOpen(false);
      setFormData({ name: "", email: "", role: "rh" });
    } else {
      toast({ title: "Erro", description: result.message, variant: "destructive" });
    }
  };

  const handleApprove = (userId: string) => {
    approveUser(userId);
    toast({ title: "Aprovado", description: "Utilizador aprovado com sucesso." });
  };

  const handleRemove = (userId: string, name: string) => {
    removeUser(userId);
    toast({ title: "Removido", description: `Utilizador ${name} removido.`, variant: "destructive" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
            <h1 className="text-2xl font-bold text-slate-800">Gestão de Utilizadores</h1>
          </div>
          <p className="text-slate-500 text-sm ml-2">Criar, aprovar e gerir contas de acesso ao sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs uppercase">Utilizadores Activos</p>
                <p className="text-3xl font-bold mt-1">{activeUsers.length}</p>
              </div>
              <Users className="w-10 h-10 text-white/30" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs uppercase">Pendentes</p>
                <p className="text-3xl font-bold mt-1">{pendingUsers.length}</p>
              </div>
              <UserPlus className="w-10 h-10 text-white/30" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs uppercase">Administradores</p>
                <p className="text-3xl font-bold mt-1">{activeUsers.filter((u: AuthUser) => u.role === "admin").length}</p>
              </div>
              <Shield className="w-10 h-10 text-white/30" />
            </div>
          </div>
        </div>

        {/* Criar Utilizador Button */}
        <div className="flex justify-end mb-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                <UserPlus className="w-4 h-4 mr-2" />
                Criar Utilizador
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md rounded-xl bg-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-slate-800">Criar Novo Utilizador</DialogTitle>
                <p className="text-sm text-slate-500 mt-1">Preencha os dados para criar uma nova conta</p>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      value={formData.name} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })} 
                      placeholder="Nome do utilizador" 
                      className="pl-9 border-slate-200 focus:border-blue-400 rounded-lg bg-white text-slate-800 w-full"
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })} 
                      placeholder="email@empresa.co.mz" 
                      className="pl-9 border-slate-200 focus:border-blue-400 rounded-lg bg-white text-slate-800 w-full"
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Perfil</Label>
                  <Select value={formData.role} onValueChange={(v: UserRole) => setFormData({ ...formData, role: v })}>
                    <SelectTrigger className="border-slate-200 rounded-lg bg-white w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rh">Recursos Humanos</SelectItem>
                      <SelectItem value="gestor">Gestor</SelectItem>
                      <SelectItem value="admin">Administração</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-700">
                    Senha temporária: <strong>123456</strong>
                  </p>
                </div>
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg">
                  Criar Conta
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pending Users */}
        {pendingUsers.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-semibold text-slate-700">Contas Pendentes</h2>
              <Badge className="bg-amber-100 text-amber-700 border-0">{pendingUsers.length}</Badge>
            </div>
            <div className="space-y-2">
              {pendingUsers.map((u: AuthUser) => (
                <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium">
                      {u.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{u.name}</p>
                      <p className="text-sm text-slate-500">{u.email}</p>
                    </div>
                    <Badge className={cn("border-0 px-2 py-0.5", roleBadgeColors[u.role])}>
                      {roleLabels[u.role]}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8 px-3 text-xs" onClick={() => handleApprove(u.id)}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />Aprovar
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 h-8 px-3 text-xs" onClick={() => handleRemove(u.id, u.name)}>
                      <XCircle className="w-3.5 h-3.5 mr-1" />Rejeitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Users Table */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-semibold text-slate-700">Utilizadores Activos</h2>
            <Badge className="bg-slate-100 text-slate-600 border-0">{activeUsers.length}</Badge>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Utilizador</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Perfil</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Acções</th>
                  </tr>
                </thead>
                <tbody>
                  {activeUsers.map((u: AuthUser, idx: number) => (
                    <tr key={u.id} className={cn(
                      "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                    )}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium">
                            {u.name?.charAt(0) || "U"}
                          </div>
                          <span className="font-medium text-slate-700">{u.name}</span>
                        </div>
                       </td>
                      <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <Badge className={cn("border-0 px-2 py-0.5", roleBadgeColors[u.role])}>
                          {roleLabels[u.role]}
                        </Badge>
                       </td>
                      <td className="px-5 py-3.5">
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-3 text-xs" onClick={() => handleRemove(u.id, u.name)}>
                          Remover
                        </Button>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {activeUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Nenhum utilizador activo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;