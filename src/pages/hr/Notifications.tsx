import { useTravelData } from "@/contexts/TravelDataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, FileText, CheckCircle2, Send, Clock, Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const Notifications = () => {
  const { notifications, travelRequests } = useTravelData();

  const emailCount = notifications.filter(n => n.type === "email").length;
  const pdfCount = notifications.filter(n => n.type === "pdf").length;
  const totalCount = notifications.length;
  const deliveryRate = totalCount > 0 ? 100 : 0;

  const stats = [
    { label: "Emails Enviados", value: emailCount, icon: Mail, color: "from-blue-500 to-blue-600" },
    { label: "PDFs Gerados", value: pdfCount, icon: FileText, color: "from-emerald-500 to-emerald-600" },
    { label: "Taxa de Entrega", value: `${deliveryRate}%`, icon: CheckCircle2, color: "from-green-500 to-green-600" },
    { label: "Total Enviados", value: totalCount, icon: Send, color: "from-purple-500 to-purple-600" },
  ];

  return (
    <div className="space-y-6 animate-fade-in p-6 bg-gradient-to-br from-slate-50 via-white to-blue-50/20 min-h-screen">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Notificações à Agência
          </h1>
        </div>
        <p className="text-slate-500 text-sm ml-2">Registo de comunicações enviadas às agências de viagens</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden">
            <div className={cn("p-5 bg-gradient-to-br", stat.color)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/80 uppercase tracking-wide font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabela de Notificações */}
      <Card className="border-0 rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Histórico de Comunicações</h2>
            <Badge className="bg-blue-100 text-blue-700 border-0 ml-2">
              {totalCount} registos
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">Todas as notificações enviadas para as agências</p>
        </div>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Viagem</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Destinatário</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Data/Hora</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                {notifications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                          <Send className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium">Nenhuma notificação registada</p>
                        <p className="text-xs text-slate-400 mt-1">As notificações aparecerão aqui quando forem enviadas</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  notifications.map((n, idx) => {
                    const tr = travelRequests.find((t) => t.id === n.travelRequestId);
                    return (
                      <tr key={n.id} className={cn(
                        "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                      )}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              n.type === "email" ? "bg-blue-100" : "bg-emerald-100"
                            )}>
                              {n.type === "email" ? (
                                <Mail className="w-5 h-5 text-blue-600" />
                              ) : (
                                <FileText className="w-5 h-5 text-emerald-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 capitalize">{n.type === "email" ? "Email" : "PDF"}</p>
                              <p className="text-xs text-slate-400">via sistema</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">{tr?.destination || "—"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            <p className="text-xs text-slate-500">{tr?.collaborator || "—"}</p>
                            <span className="text-xs text-slate-300">•</span>
                            <code className="text-xs font-mono text-slate-400">{tr?.id || n.travelRequestId}</code>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600 text-sm">{n.recipient || "—"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600 text-sm">
                              {new Date(n.sentAt).toLocaleDateString("pt-MZ")}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(n.sentAt).toLocaleTimeString("pt-MZ", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-green-100 text-green-700 border-0 px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Entregue
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
