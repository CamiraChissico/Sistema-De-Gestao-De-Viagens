import { useState } from "react";
import { useTravelData } from "@/contexts/TravelDataContext";
import { contractStatusLabels, formatMZN } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Building2, Calendar, TrendingUp, Wallet, FileText, Eye, Trash2, CheckCircle, XCircle, Clock, User, Mail, DollarSign, CalendarDays, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ContractType {
  id: string;
  agency: string;
  contactPerson: string;
  contactEmail: string;
  totalValue: number;
  consumedValue: number;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "suspended";
}

const Contracts = () => {
  const { contracts: initialContracts, travelRequests, addContract, deleteContract } = useTravelData();
  const { toast } = useToast();
  const [contracts, setContracts] = useState<ContractType[]>(initialContracts);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractType | null>(null);
  const [formData, setFormData] = useState({
    agency: "", contactPerson: "", contactEmail: "", totalValue: "", startDate: "", endDate: "",
  });

  const totalValue = contracts.reduce((s, c) => s + c.totalValue, 0);
  const totalConsumed = contracts.reduce((s, c) => s + c.consumedValue, 0);
  const averageUsage = contracts.length > 0 ? (totalConsumed / totalValue) * 100 : 0;

  // Adicionar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agency || !formData.totalValue) {
      toast({ title: "Erro", description: "Preencha os campos obrigatórios.", variant: "destructive" });
      return;
    }
    
    const newContract: ContractType = {
      id: `CTR-${String(contracts.length + 1).padStart(3, "0")}`,
      agency: formData.agency,
      contactPerson: formData.contactPerson,
      contactEmail: formData.contactEmail,
      totalValue: Number(formData.totalValue),
      consumedValue: 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "active",
    };
    
    setContracts([...contracts, newContract]);
    addContract(newContract);
    toast({ title: "Sucesso", description: "Contrato registado com sucesso!" });
    setOpen(false);
    setFormData({ agency: "", contactPerson: "", contactEmail: "", totalValue: "", startDate: "", endDate: "" });
  };

  // Editar
  const handleEdit = (contract: ContractType) => {
    setSelectedContract(contract);
    setFormData({
      agency: contract.agency,
      contactPerson: contract.contactPerson,
      contactEmail: contract.contactEmail,
      totalValue: String(contract.totalValue),
      startDate: contract.startDate,
      endDate: contract.endDate,
    });
    setEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContract) return;
    
    const updatedContracts = contracts.map(c =>
      c.id === selectedContract.id
        ? { ...c, ...formData, totalValue: Number(formData.totalValue) }
        : c
    );
    
    setContracts(updatedContracts);
    toast({ title: "Sucesso", description: "Contrato atualizado com sucesso!" });
    setEditOpen(false);
    setSelectedContract(null);
  };

  // Visualizar
  const handleView = (contract: ContractType) => {
    setSelectedContract(contract);
    setViewOpen(true);
  };

  // Eliminar
  const handleDelete = (contract: ContractType) => {
    setSelectedContract(contract);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedContract) {
      deleteContract(selectedContract.id);
      setContracts(contracts.filter(c => c.id !== selectedContract.id));
      toast({ title: "Sucesso", description: "Contrato removido com sucesso!" });
      setDeleteDialogOpen(false);
      setSelectedContract(null);
    }
  };

  const ContractsTable = ({ data }: { data: ContractType[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b-2 border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Agência</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Período</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Valor Total</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Consumido</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contacto</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((contract) => {
            const usage = (contract.consumedValue / contract.totalValue) * 100;
            return (
              <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-800">{contract.agency}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{contract.startDate} → {contract.endDate}</td>
                <td className="px-6 py-4 font-semibold text-slate-800">{formatMZN(contract.totalValue)}</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <span className="text-slate-600">{formatMZN(contract.consumedValue)}</span>
                    <div className="w-24 bg-slate-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${usage > 80 ? 'bg-red-500' : usage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${usage}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={contract.status === "active" ? "bg-green-100 text-green-700 border-green-200" : contract.status === "expired" ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-red-100 text-red-700 border-red-200"}>
                    {contract.status === "active" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {contract.status === "expired" && <Clock className="w-3 h-3 mr-1" />}
                    {contract.status === "suspended" && <XCircle className="w-3 h-3 mr-1" />}
                    {contractStatusLabels[contract.status]}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs">{contract.contactPerson || "—"}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleView(contract)} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button onClick={() => handleEdit(contract)} className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                      <Edit className="w-4 h-4 text-amber-600" />
                    </button>
                    <button onClick={() => handleDelete(contract)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
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
  );

  const stats = [
    { label: "Total Contratos", value: contracts.length, icon: Building2, color: "from-blue-500 to-blue-600" },
    { label: "Valor Total", value: formatMZN(totalValue), icon: Wallet, color: "from-emerald-500 to-emerald-600" },
    { label: "Valor Consumido", value: formatMZN(totalConsumed), icon: Calendar, color: "from-amber-500 to-amber-600" },
    { label: "Saldo Restante", value: formatMZN(totalValue - totalConsumed), icon: TrendingUp, color: "from-indigo-500 to-indigo-600", sub: `${averageUsage.toFixed(1)}% utilizado` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Contratos</h1>
            </div>
            <p className="text-slate-500 text-sm ml-2">Gestão e monitorização de contratos com agências</p>
          </div>
          
          {/* Dialog Adicionar */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg rounded-xl px-5 py-2.5">
                <Plus className="w-4 h-4 mr-2" /> Novo Contrato
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden bg-white">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Registrar Novo Contrato
                </DialogTitle>
                <p className="text-blue-100 text-sm mt-1">Preencha os dados abaixo para registrar um novo contrato</p>
              </div>
              <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Dados da Agência</h3>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium text-sm">Agência <span className="text-red-500">*</span></Label>
                    <Input placeholder="Nome da agência de viagens" value={formData.agency} onChange={e => setFormData(p => ({ ...p, agency: e.target.value }))} className="border-slate-300 focus:border-blue-400 h-11 rounded-xl bg-white text-slate-800" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium text-sm">Pessoa de Contacto</Label>
                      <Input placeholder="Nome completo" value={formData.contactPerson} onChange={e => setFormData(p => ({ ...p, contactPerson: e.target.value }))} className="border-slate-300 focus:border-blue-400 h-11 rounded-xl bg-white text-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium text-sm">Email de Contacto</Label>
                      <Input type="email" placeholder="email@agencia.co.mz" value={formData.contactEmail} onChange={e => setFormData(p => ({ ...p, contactEmail: e.target.value }))} className="border-slate-300 focus:border-blue-400 h-11 rounded-xl bg-white text-slate-800" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Valores do Contrato</h3>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium text-sm">Valor Global <span className="text-red-500">*</span></Label>
                    <Input type="number" placeholder="0,00" value={formData.totalValue} onChange={e => setFormData(p => ({ ...p, totalValue: e.target.value }))} className="border-slate-300 focus:border-blue-400 h-11 rounded-xl bg-white text-slate-800" />
                    <p className="text-xs text-slate-500">Valor total do contrato em Meticais (MZN)</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <CalendarDays className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Período do Contrato</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium text-sm">Data de Início</Label>
                      <Input type="date" value={formData.startDate} onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))} className="border-slate-300 focus:border-blue-400 h-11 rounded-xl bg-white text-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium text-sm">Data de Fim</Label>
                      <Input type="date" value={formData.endDate} onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))} className="border-slate-300 focus:border-blue-400 h-11 rounded-xl bg-white text-slate-800" />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg mt-4">
                  <Plus className="w-4 h-4 mr-2" /> Registrar Contrato
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className={cn("relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:shadow-md bg-gradient-to-br", stat.color)}>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/70 uppercase tracking-wide font-medium">{stat.label}</p>
                    <p className="text-xl font-bold text-white mt-0.5">{stat.value}</p>
                    {stat.sub && <p className="text-[10px] text-white/50 mt-0.5">{stat.sub}</p>}
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TABS com Tabela */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <Tabs defaultValue="todos" className="w-full">
            <div className="border-b border-slate-200 px-4">
              <TabsList className="bg-transparent h-11 gap-4">
                <TabsTrigger value="todos" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none text-sm">Todos ({contracts.length})</TabsTrigger>
                <TabsTrigger value="ativos" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none text-sm">Ativos ({contracts.filter(c => c.status === "active").length})</TabsTrigger>
                <TabsTrigger value="expirados" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none text-sm">Expirados ({contracts.filter(c => c.status === "expired").length})</TabsTrigger>
                <TabsTrigger value="suspensos" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none text-sm">Suspensos ({contracts.filter(c => c.status === "suspended").length})</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="todos" className="p-0 m-0"><ContractsTable data={contracts} /></TabsContent>
            <TabsContent value="ativos" className="p-0 m-0"><ContractsTable data={contracts.filter(c => c.status === "active")} /></TabsContent>
            <TabsContent value="expirados" className="p-0 m-0"><ContractsTable data={contracts.filter(c => c.status === "expired")} /></TabsContent>
            <TabsContent value="suspensos" className="p-0 m-0"><ContractsTable data={contracts.filter(c => c.status === "suspended")} /></TabsContent>
          </Tabs>
          {contracts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">Nenhum contrato registado</h3>
              <p className="text-sm text-slate-400 mb-4">Clique em "Novo Contrato" para começar</p>
            </div>
          )}
        </div>
      </div>

      {/* Dialog Visualizar */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Detalhes do Contrato
            </DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-500">Agência</p><p className="font-semibold text-slate-800">{selectedContract.agency}</p></div>
                <div><p className="text-xs text-slate-500">ID</p><p className="font-mono text-sm text-slate-600">{selectedContract.id}</p></div>
                <div><p className="text-xs text-slate-500">Período</p><p className="text-slate-700">{selectedContract.startDate} → {selectedContract.endDate}</p></div>
                <div><p className="text-xs text-slate-500">Status</p><Badge className={selectedContract.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>{contractStatusLabels[selectedContract.status]}</Badge></div>
                <div><p className="text-xs text-slate-500">Valor Total</p><p className="text-xl font-bold text-slate-800">{formatMZN(selectedContract.totalValue)}</p></div>
                <div><p className="text-xs text-slate-500">Valor Consumido</p><p className="text-xl font-bold text-amber-600">{formatMZN(selectedContract.consumedValue)}</p></div>
                <div><p className="text-xs text-slate-500">Saldo Disponível</p><p className="text-xl font-bold text-emerald-600">{formatMZN(selectedContract.totalValue - selectedContract.consumedValue)}</p></div>
                <div><p className="text-xs text-slate-500">Contacto</p><p className="text-slate-700">{selectedContract.contactPerson || "—"}</p></div>
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
              Editar Contrato
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Agência</Label>
              <Input value={formData.agency} onChange={e => setFormData(p => ({ ...p, agency: e.target.value }))} className="border-slate-300 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Pessoa de Contacto</Label>
                <Input value={formData.contactPerson} onChange={e => setFormData(p => ({ ...p, contactPerson: e.target.value }))} className="border-slate-300 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Email</Label>
                <Input value={formData.contactEmail} onChange={e => setFormData(p => ({ ...p, contactEmail: e.target.value }))} className="border-slate-300 rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Valor Total</Label>
                <Input type="number" value={formData.totalValue} onChange={e => setFormData(p => ({ ...p, totalValue: e.target.value }))} className="border-slate-300 rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Data Início</Label>
                <Input type="date" value={formData.startDate} onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))} className="border-slate-300 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Data Fim</Label>
                <Input type="date" value={formData.endDate} onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))} className="border-slate-300 rounded-xl" />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="rounded-xl">Cancelar</Button>
              <Button type="submit" className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl">Salvar Alterações</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmar Delete */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-700">Tem certeza que deseja excluir este contrato?</p>
            <p className="text-sm text-slate-500 mt-2">Esta ação não pode ser desfeita.</p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete} className="rounded-xl">Confirmar Exclusão</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;