import { useTravelData } from "@/contexts/TravelDataContext";
import { statusLabels, formatMZN } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, AlertCircle, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Approvals = () => {
  const { travelRequests, approveRequest, rejectRequest } = useTravelData();
  const { toast } = useToast();

  const pending = travelRequests.filter(tr => tr.status === "pending");
  const others = travelRequests.filter(tr => tr.status !== "pending");

  const handleApprove = (id: string) => {
    approveRequest(id, "gestor");
    toast({ title: "Aprovado", description: `Solicitação ${id} aprovada com sucesso.` });
  };

  const handleReject = (id: string) => {
    rejectRequest(id);
    toast({ title: "Rejeitado", description: `Solicitação ${id} foi rejeitada.`, variant: "destructive" });
  };

  const stats = [
    { label: "Pendentes", value: pending.length, icon: Clock, color: "text-amber-600", bgColor: "bg-amber-50" },
    { label: "Aprovados", value: travelRequests.filter(t => ["approved_gestor", "approved_rh", "emitted"].includes(t.status)).length, icon: CheckCircle2, color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { label: "Rejeitados", value: travelRequests.filter(t => t.status === "rejected").length, icon: XCircle, color: "text-red-600", bgColor: "bg-red-50" },
  ];

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Aprovações</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gestão de solicitações de viagem pendentes</p>
        </div>
        <Badge variant="outline" className="bg-white">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date().toLocaleDateString("pt-MZ")}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-semibold text-slate-800 mt-1">{stat.value}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bgColor)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Requests Section */}
      {pending.length > 0 ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-semibold text-slate-700">Aguardando Aprovação</h2>
            <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">{pending.length} solicitações</Badge>
          </div>

          <div className="space-y-3">
            {pending.map((req) => (
              <Card key={req.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-medium">
                          {req.collaborator?.charAt(0) || "U"}
                        </div>
                        <span className="font-medium text-slate-800">{req.collaborator}</span>
                        <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded">{req.id}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{req.destination}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{req.departureDate} → {req.returnDate}</span>
                        </div>
                      </div>
                      
                      {req.purpose && (
                        <p className="text-xs text-slate-400">{req.purpose}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Custo Estimado</p>
                        <p className="text-base font-semibold text-slate-800">{formatMZN(req.estimatedCost)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-3 text-xs"
                          onClick={() => handleApprove(req.id)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />Aprovar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-slate-300 text-slate-600 hover:bg-slate-50 h-8 px-3 text-xs"
                          onClick={() => handleReject(req.id)}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />Rejeitar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-base font-medium text-slate-700 mb-1">Nenhuma pendência</h3>
            <p className="text-sm text-slate-400">Todas as solicitações foram processadas</p>
          </CardContent>
        </Card>
      )}

      {/* History Table */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-slate-400" />
          <h2 className="text-base font-semibold text-slate-700">Histórico</h2>
          <span className="text-xs text-slate-400">Solicitações processadas</span>
        </div>

        <Card className="border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Solicitação</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Colaborador</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Destino</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Custo</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Data</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {others.slice(0, 10).map((req) => (
                  <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <code className="text-xs font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">{req.id}</code>
                    </td>
                    <td className="px-5 py-3 text-slate-700">{req.collaborator}</td>
                    <td className="px-5 py-3 text-slate-500">{req.destination.split(",")[0]}</td>
                    <td className="px-5 py-3 font-medium text-slate-700">{formatMZN(req.estimatedCost)}</td>
                    <td className="px-5 py-3 text-slate-500">{req.departureDate}</td>
                    <td className="px-5 py-3">
                      <Badge className={cn(
                        "text-xs px-2 py-0.5 rounded-full border-0 font-normal",
                        req.status === "approved_gestor" ? "bg-blue-50 text-blue-700" :
                        req.status === "approved_rh" ? "bg-emerald-50 text-emerald-700" :
                        req.status === "emitted" ? "bg-purple-50 text-purple-700" :
                        req.status === "rejected" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"
                      )}>
                        {statusLabels[req.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {others.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400">Nenhuma solicitação processada</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Approvals;