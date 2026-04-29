import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTravelData } from "@/contexts/TravelDataContext";
import { statusLabels, statusColors, formatMZN } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter, CheckCircle2, XCircle, Plane, Calendar, MapPin, Clock, Eye, Edit, Trash2, User, DollarSign, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TravelRequestType {
  id: string;
  collaborator: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  estimatedCost: number;
  contractId: string;
  status: string;
  purpose: string;
  requester: string;
  createdAt: string;
}

const TravelRequests = () => {
  const { user } = useAuth();
  const { travelRequests, contracts, approveRequest, rejectRequest, emitRequest, addTravelRequest, collaborators } = useTravelData();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TravelRequestType | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [formData, setFormData] = useState({
    collaborator: "", destination: "", departureDate: "", returnDate: "", estimatedCost: "", contractId: "", purpose: "",
  });

  const canCreate = user?.role === "rh" || user?.role === "admin";

  const filtered = travelRequests.filter((tr) => {
    const matchSearch = tr.collaborator.toLowerCase().includes(search.toLowerCase()) ||
      tr.destination.toLowerCase().includes(search.toLowerCase()) ||
      tr.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || tr.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Adicionar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.collaborator || !formData.destination || !formData.contractId) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }
    addTravelRequest({
      requester: user?.name || "",
      collaborator: formData.collaborator,
      destination: formData.destination,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate,
      estimatedCost: Number(formData.estimatedCost) || 0,
      contractId: formData.contractId,
      purpose: formData.purpose,
    });
    toast({ title: "Sucesso", description: "Solicitação criada com sucesso!" });
    setOpen(false);
    setFormData({ collaborator: "", destination: "", departureDate: "", returnDate: "", estimatedCost: "", contractId: "", purpose: "" });
  };

  // Editar
  const handleEdit = (request: TravelRequestType) => {
    setSelectedRequest(request);
    setFormData({
      collaborator: request.collaborator,
      destination: request.destination,
      departureDate: request.departureDate,
      returnDate: request.returnDate,
      estimatedCost: String(request.estimatedCost),
      contractId: request.contractId,
      purpose: request.purpose || "",
    });
    setEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Sucesso", description: "Solicitação atualizada com sucesso!" });
    setEditOpen(false);
  };

  // Visualizar
  const handleView = (request: TravelRequestType) => {
    setSelectedRequest(request);
    setViewOpen(true);
  };

  // Eliminar
  const handleDelete = (request: TravelRequestType) => {
    setSelectedRequest(request);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    toast({ title: "Sucesso", description: "Solicitação removida com sucesso!" });
    setDeleteOpen(false);
    setSelectedRequest(null);
  };

  const handleApprove = (id: string) => {
    if (user?.role === "gestor") {
      approveRequest(id, "gestor");
      toast({ title: "Aprovado", description: `Solicitação aprovada pelo gestor.` });
    } else if (user?.role === "rh" || user?.role === "admin") {
      approveRequest(id, "rh");
      toast({ title: "Aprovado", description: `Solicitação aprovada pelo RH.` });
    }
  };

  const handleReject = (id: string) => {
    rejectRequest(id);
    toast({ title: "Rejeitado", description: `Solicitação foi rejeitada.`, variant: "destructive" });
  };

  const handleEmit = (id: string) => {
    emitRequest(id);
    toast({ title: "Emitido", description: `Solicitação emitida. Agência notificada.` });
  };

  const stats = [
    { label: "Total", value: travelRequests.length, icon: Plane, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Pendentes", value: travelRequests.filter(t => t.status === "pending").length, icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
    { label: "Aprovadas", value: travelRequests.filter(t => t.status === "approved_gestor" || t.status === "approved_rh").length, icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Emitidas", value: travelRequests.filter(t => t.status === "emitted").length, icon: Plane, color: "text-purple-600", bgColor: "bg-purple-50" },
  ];

  const getContractName = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    return contract ? contract.agency.split(",")[0] : contractId;
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 bg-gradient-to-br from-slate-50 via-white to-blue-50/20 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Solicitações de Viagem
            </h1>
          </div>
          <p className="text-slate-500 text-sm ml-2">Pedidos de viagem e fluxo de aprovação</p>
        </div>
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg rounded-xl px-5 py-2.5">
                <Plus className="w-4 h-4 mr-2" /> Nova Solicitação
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden bg-white">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Nova Solicitação de Viagem
                </DialogTitle>
                <p className="text-blue-100 text-sm mt-1">Preencha os dados para solicitar uma viagem</p>
              </div>
              
              <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium text-sm">Colaborador *</Label>
                    <Select value={formData.collaborator} onValueChange={v => setFormData(p => ({ ...p, collaborator: v }))}>
                      <SelectTrigger className="border-slate-300 focus:border-blue-400 h-11 rounded-xl bg-white text-slate-800">
                        <SelectValue placeholder="Seleccionar colaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        {collaborators.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium text-sm">Destino *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        placeholder="Cidade, País" 
                        value={formData.destination} 
                        onChange={e => setFormData(p => ({ ...p, destination: e.target.value }))}
                        className="pl-9 border-slate-300 focus:border-blue-400 h-11 rounded-xl bg-white text-slate-800"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium text-sm">Data de Partida</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        type="date" 
                        value={formData.departureDate} 
                        onChange={e => setFormData(p => ({ ...p, departureDate: e.target.value }))}
                        className="pl-9 border-slate-300 focus:border-blue-400 h-11 rounded-xl bg-white text-slate-800"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium text-sm">Data de Regresso</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        type="date" 
                        value={formData.returnDate} 
                        onChange={e => setFormData(p => ({ ...p, returnDate: e.target.value }))}
                        className="pl-9 border-slate-300 focus:border-blue-400 h-11 rounded-xl bg-white text-slate-800"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium text-sm">Custo Estimado (MZN)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={formData.estimatedCost} 
                        onChange={e => setFormData(p => ({ ...p, estimatedCost: e.target.value }))}
                        className="pl-9 border-slate-300 focus:border-blue-400 h-11 rounded-xl bg-white text-slate-800"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium text-sm">Contrato *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Select value={formData.contractId} onValueChange={v => setFormData(p => ({ ...p, contractId: v }))}>
                        <SelectTrigger className="pl-9 border-slate-300 focus:border-blue-400 h-11 rounded-xl bg-white text-slate-800">
                          <SelectValue placeholder="Seleccionar contrato" />
                        </SelectTrigger>
                        <SelectContent>
                          {contracts.filter(c => c.status === "active").map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.agency} ({c.id})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label className="text-slate-700 font-medium text-sm">Motivo da Viagem</Label>
                    <Textarea 
                      placeholder="Descreva o objectivo da viagem..." 
                      rows={3} 
                      value={formData.purpose} 
                      onChange={e => setFormData(p => ({ ...p, purpose: e.target.value }))}
                      className="border-slate-300 focus:border-blue-400 rounded-xl bg-white text-slate-800"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg mt-4">
                  <Plane className="w-4 h-4 mr-2" />
                  Submeter Solicitação
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden">
            <div className={cn("p-4 bg-gradient-to-br", 
              stat.label === "Total" ? "from-blue-500 to-blue-600" :
              stat.label === "Pendentes" ? "from-orange-500 to-orange-600" :
              stat.label === "Aprovadas" ? "from-green-500 to-green-600" : "from-purple-500 to-purple-600"
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/80 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <Card className="border-slate-200 shadow-sm rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Pesquisar por colaborador, destino ou ID..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-10 border-slate-200 focus:border-blue-500 rounded-xl bg-white"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[200px] border-slate-200 rounded-xl bg-white">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="approved_gestor">Aprovado (Gestor)</SelectItem>
                <SelectItem value="approved_rh">Aprovado (RH)</SelectItem>
                <SelectItem value="emitted">Emitido</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Solicitações */}
      <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Ref.</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Colaborador</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Destino</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Partida</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Custo</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Acções</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tr) => (
                  <tr key={tr.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {tr.id}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {tr.collaborator.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{tr.collaborator}</p>
                          {tr.purpose && <p className="text-xs text-slate-400">{tr.purpose.slice(0, 40)}...</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-700">{tr.destination}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600">{tr.departureDate}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-emerald-600">{formatMZN(tr.estimatedCost)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className={cn("text-xs font-medium px-2 py-1 rounded-full", 
                        tr.status === "pending" ? "bg-orange-100 text-orange-700" :
                        tr.status === "approved_gestor" ? "bg-blue-100 text-blue-700" :
                        tr.status === "approved_rh" ? "bg-green-100 text-green-700" :
                        tr.status === "emitted" ? "bg-purple-100 text-purple-700" : "bg-red-100 text-red-700"
                      )}>
                        {statusLabels[tr.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <button onClick={() => handleView(tr)} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors" title="Ver detalhes">
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button onClick={() => handleEdit(tr)} className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors" title="Editar">
                          <Edit className="w-4 h-4 text-amber-600" />
                        </button>
                        <button onClick={() => handleDelete(tr)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                        {tr.status === "pending" && user?.role === "gestor" && (
                          <>
                            <Button size="sm" className="h-7 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg" onClick={() => handleApprove(tr.id)}>
                              <CheckCircle2 className="w-3 h-3 mr-1" />Aprovar
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 border-red-300 text-red-600 hover:bg-red-50 text-xs rounded-lg" onClick={() => handleReject(tr.id)}>
                              <XCircle className="w-3 h-3 mr-1" />Rejeitar
                            </Button>
                          </>
                        )}
                        {tr.status === "approved_gestor" && (user?.role === "rh" || user?.role === "admin") && (
                          <Button size="sm" className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg" onClick={() => handleApprove(tr.id)}>
                            <CheckCircle2 className="w-3 h-3 mr-1" />Aprovar RH
                          </Button>
                        )}
                        {tr.status === "approved_rh" && (user?.role === "rh" || user?.role === "admin") && (
                          <Button size="sm" className="h-7 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg" onClick={() => handleEmit(tr.id)}>
                            <Plane className="w-3 h-3 mr-1" />Emitir
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Plane className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500">Nenhuma solicitação encontrada</p>
                <p className="text-xs text-slate-400 mt-1">Tente ajustar os filtros de pesquisa</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog Visualizar */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Detalhes da Solicitação
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-500">ID</p><p className="font-mono text-slate-700">{selectedRequest.id}</p></div>
                <div><p className="text-xs text-slate-500">Status</p><Badge className={cn("text-xs", statusColors[selectedRequest.status])}>{statusLabels[selectedRequest.status]}</Badge></div>
                <div><p className="text-xs text-slate-500">Colaborador</p><p className="font-medium text-slate-800">{selectedRequest.collaborator}</p></div>
                <div><p className="text-xs text-slate-500">Destino</p><p className="text-slate-700">{selectedRequest.destination}</p></div>
                <div><p className="text-xs text-slate-500">Data Partida</p><p className="text-slate-700">{selectedRequest.departureDate}</p></div>
                <div><p className="text-xs text-slate-500">Data Regresso</p><p className="text-slate-700">{selectedRequest.returnDate}</p></div>
                <div><p className="text-xs text-slate-500">Custo Estimado</p><p className="font-semibold text-emerald-600">{formatMZN(selectedRequest.estimatedCost)}</p></div>
                <div><p className="text-xs text-slate-500">Contrato</p><p className="text-slate-700">{getContractName(selectedRequest.contractId)}</p></div>
                <div className="col-span-2"><p className="text-xs text-slate-500">Motivo</p><p className="text-slate-700">{selectedRequest.purpose || "—"}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Editar */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-amber-600 flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar Solicitação
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-slate-700">Colaborador</Label><Input value={formData.collaborator} onChange={e => setFormData(p => ({ ...p, collaborator: e.target.value }))} className="rounded-xl border-slate-300" /></div>
              <div className="space-y-2"><Label className="text-slate-700">Destino</Label><Input value={formData.destination} onChange={e => setFormData(p => ({ ...p, destination: e.target.value }))} className="rounded-xl border-slate-300" /></div>
              <div className="space-y-2"><Label className="text-slate-700">Data Partida</Label><Input type="date" value={formData.departureDate} onChange={e => setFormData(p => ({ ...p, departureDate: e.target.value }))} className="rounded-xl border-slate-300" /></div>
              <div className="space-y-2"><Label className="text-slate-700">Data Regresso</Label><Input type="date" value={formData.returnDate} onChange={e => setFormData(p => ({ ...p, returnDate: e.target.value }))} className="rounded-xl border-slate-300" /></div>
              <div className="space-y-2"><Label className="text-slate-700">Custo Estimado</Label><Input type="number" value={formData.estimatedCost} onChange={e => setFormData(p => ({ ...p, estimatedCost: e.target.value }))} className="rounded-xl border-slate-300" /></div>
              <div className="col-span-2 space-y-2"><Label className="text-slate-700">Motivo</Label><Textarea value={formData.purpose} onChange={e => setFormData(p => ({ ...p, purpose: e.target.value }))} rows={3} className="rounded-xl border-slate-300" /></div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="rounded-xl">Cancelar</Button>
              <Button type="submit" className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl">Salvar Alterações</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmar Delete */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-700">Tem certeza que deseja excluir esta solicitação?</p>
            <p className="text-sm text-slate-500 mt-2">Esta ação não pode ser desfeita.</p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete} className="rounded-xl">Confirmar Exclusão</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TravelRequests;