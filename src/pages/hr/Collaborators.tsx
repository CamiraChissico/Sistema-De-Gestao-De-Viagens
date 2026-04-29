import { useState } from "react";
import { useTravelData } from "@/contexts/TravelDataContext";
import { formatMZN } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plane, Wallet, Plus, Search, TrendingUp, UserPlus, Briefcase, Mail, Phone, Calendar, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Tipo para Colaborador
interface CollaboratorType {
  id: string;
  name: string;
  department: string;
  position: string;
  email?: string;
  phone?: string;
  startDate?: string;
}

const Collaborators = () => {
  const { collaborators: initialCollaborators, travelRequests, addCollaborator } = useTravelData();
  const { toast } = useToast();
  const [collaborators, setCollaborators] = useState<CollaboratorType[]>(initialCollaborators);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<CollaboratorType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ 
    name: "", 
    department: "", 
    position: "",
    email: "",
    phone: "",
    startDate: ""
  });

  // Filtrar colaboradores
  const filteredCollaborators = collaborators.filter(col =>
    col.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    col.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (col.position && col.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Estatísticas
  const totalCollaborators = collaborators.length;
  const activeTravelers = new Set(travelRequests.map(t => t.collaborator)).size;
  const totalSpent = travelRequests.reduce((s, t) => s + t.estimatedCost, 0);
  const avgPerPerson = totalCollaborators > 0 ? totalSpent / totalCollaborators : 0;

  // CRUD Functions
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.department) {
      toast({ title: "Erro", description: "Preencha os campos obrigatórios.", variant: "destructive" });
      return;
    }
    
    const newCollaborator: CollaboratorType = {
      id: `COL${String(collaborators.length + 1).padStart(3, "0")}`,
      name: formData.name,
      department: formData.department,
      position: formData.position,
      email: formData.email,
      phone: formData.phone,
      startDate: formData.startDate
    };
    
    setCollaborators([...collaborators, newCollaborator]);
    toast({ title: "Sucesso", description: "Colaborador adicionado com sucesso!" });
    setOpen(false);
    setFormData({ name: "", department: "", position: "", email: "", phone: "", startDate: "" });
  };

  const handleEdit = (collaborator: CollaboratorType) => {
    setSelectedCollaborator(collaborator);
    setFormData({
      name: collaborator.name,
      department: collaborator.department,
      position: collaborator.position || "",
      email: collaborator.email || "",
      phone: collaborator.phone || "",
      startDate: collaborator.startDate || ""
    });
    setEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollaborator) return;
    
    const updatedCollaborators = collaborators.map(col =>
      col.id === selectedCollaborator.id
        ? { ...col, ...formData }
        : col
    );
    
    setCollaborators(updatedCollaborators);
    toast({ title: "Sucesso", description: "Colaborador atualizado com sucesso!" });
    setEditOpen(false);
    setSelectedCollaborator(null);
  };

  const handleDelete = (collaborator: CollaboratorType) => {
    setSelectedCollaborator(collaborator);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedCollaborator) return;
    
    const updatedCollaborators = collaborators.filter(col => col.id !== selectedCollaborator.id);
    setCollaborators(updatedCollaborators);
    toast({ title: "Sucesso", description: "Colaborador removido com sucesso!" });
    setDeleteOpen(false);
    setSelectedCollaborator(null);
  };

  const handleView = (collaborator: CollaboratorType) => {
    setSelectedCollaborator(collaborator);
    setViewOpen(true);
  };

  const stats = [
    { label: "Total Colaboradores", value: totalCollaborators, icon: Users, bgColor: "bg-gradient-to-r from-blue-500 to-blue-600", trend: `${totalCollaborators} no total` },
    { label: "Viajantes Activos", value: activeTravelers, icon: Plane, bgColor: "bg-gradient-to-r from-emerald-500 to-emerald-600", trend: `${((activeTravelers / totalCollaborators) * 100).toFixed(0)}% do total` },
    { label: "Gasto Total", value: formatMZN(totalSpent), icon: Wallet, bgColor: "bg-gradient-to-r from-orange-500 to-orange-600", trend: "últimos 12 meses" },
    { label: "Média por Pessoa", value: formatMZN(avgPerPerson), icon: TrendingUp, bgColor: "bg-gradient-to-r from-purple-500 to-purple-600", trend: "gasto médio" },
  ];

  return (
    <div className="space-y-6 animate-fade-in p-6 bg-slate-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
            <h1 className="text-3xl font-bold text-slate-800">Colaboradores</h1>
          </div>
          <p className="text-slate-500 text-sm ml-2">Gestão de colaboradores e histórico de viagens</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg rounded-xl px-5 py-2.5">
              <Plus className="w-4 h-4 mr-2" /> 
              Novo Colaborador
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[550px] bg-white rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Adicionar Colaborador
              </DialogTitle>
              <p className="text-sm text-slate-500 mt-1">Preencha as informações do novo colaborador</p>
            </DialogHeader>
            
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} 
                  placeholder="Ex: João Silva Santos"
                  className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Departamento <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    value={formData.department} 
                    onChange={e => setFormData(p => ({ ...p, department: e.target.value }))} 
                    placeholder="Ex: Engenharia"
                    className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Cargo</Label>
                  <Input 
                    value={formData.position} 
                    onChange={e => setFormData(p => ({ ...p, position: e.target.value }))} 
                    placeholder="Ex: Analista Sénior"
                    className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type="email"
                      value={formData.email} 
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} 
                      placeholder="email@empresa.com"
                      className="pl-9 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      value={formData.phone} 
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} 
                      placeholder="+258 84 123 4567"
                      className="pl-9 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Data de Admissão</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="date"
                    value={formData.startDate} 
                    onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))} 
                    className="pl-9 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg mt-4"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Adicionar Colaborador
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden">
            <div className={cn("p-5", stat.bgColor)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/80 uppercase tracking-wide font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-[10px] text-white/60 mt-1">{stat.trend}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Pesquisar por nome, departamento ou cargo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-white shadow-sm"
        />
      </div>

      {/* Tabela de Colaboradores com CRUD */}
      <Card className="border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Colaborador</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Departamento</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Cargo</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Viagens</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Gasto Total</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCollaborators.map((col) => {
                  const trips = travelRequests.filter(t => t.collaborator === col.name);
                  const totalCost = trips.reduce((s, t) => s + t.estimatedCost, 0);
                  return (
                    <tr key={col.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                            {col.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{col.name}</p>
                            <p className="text-xs text-slate-400">ID: {col.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-blue-100 text-blue-700 border-0 px-3 py-1 rounded-full font-medium">
                          {col.department}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm text-slate-600">{col.position || "—"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold",
                          trips.length > 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                        )}>
                          {trips.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-blue-600">
                        {formatMZN(totalCost)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(col)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleEdit(col)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4 text-amber-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(col)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredCollaborators.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Nenhum colaborador encontrado</h3>
          <p className="text-sm text-slate-400">Tente ajustar sua busca ou adicione um novo colaborador</p>
        </div>
      )}

      {/* Dialog de Visualização */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Detalhes do Colaborador</DialogTitle>
          </DialogHeader>
          {selectedCollaborator && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {selectedCollaborator.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{selectedCollaborator.name}</h3>
                  <p className="text-sm text-slate-500">ID: {selectedCollaborator.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Departamento</p>
                  <p className="font-medium text-slate-700">{selectedCollaborator.department}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Cargo</p>
                  <p className="font-medium text-slate-700">{selectedCollaborator.position || "—"}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-medium text-slate-700">{selectedCollaborator.email || "—"}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Telefone</p>
                  <p className="font-medium text-slate-700">{selectedCollaborator.phone || "—"}</p>
                </div>
                <div className="col-span-2 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Data de Admissão</p>
                  <p className="font-medium text-slate-700">{selectedCollaborator.startDate || "—"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Edição */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[550px] bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <Edit className="w-5 h-5 text-amber-600" />
              Editar Colaborador
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleUpdate}>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Nome Completo</Label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} 
                className="h-11 border-slate-300 focus:border-blue-500 rounded-xl bg-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Departamento</Label>
                <Input 
                  value={formData.department} 
                  onChange={e => setFormData(p => ({ ...p, department: e.target.value }))} 
                  className="h-11 border-slate-300 focus:border-blue-500 rounded-xl bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Cargo</Label>
                <Input 
                  value={formData.position} 
                  onChange={e => setFormData(p => ({ ...p, position: e.target.value }))} 
                  className="h-11 border-slate-300 focus:border-blue-500 rounded-xl bg-white"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-xl">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-red-600">
              <Trash2 className="w-5 h-5" />
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-700">
              Tem certeza que deseja excluir o colaborador <span className="font-semibold">{selectedCollaborator?.name}</span>?
            </p>
            <p className="text-sm text-slate-500 mt-2">Esta ação não pode ser desfeita.</p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={confirmDelete}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl"
            >
              Confirmar Exclusão
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Collaborators;