import { useTravelData } from "@/contexts/TravelDataContext";
import { statusLabels, statusColors, formatMZN } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History as HistoryIcon, Calendar, User, MapPin, FileText, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const History = () => {
  const { travelRequests } = useTravelData();
  const sorted = [...travelRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-gray-100 rounded-xl">
            <HistoryIcon className="w-5 h-5 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Histórico</h1>
        </div>
        <p className="text-gray-500 text-sm ml-11">Todas as solicitações de viagem ordenadas por data</p>
      </div>

      {/* Tabela */}
      <Card className="border border-gray-200 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Data</span>
                    </div>
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref.</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>Colaborador</span>
                    </div>
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>Destino</span>
                    </div>
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>Motivo</span>
                    </div>
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>Custo</span>
                    </div>
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((tr, idx) => (
                  <tr 
                    key={tr.id} 
                    className={cn(
                      "border-b border-gray-100 hover:bg-gray-50 transition-colors",
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    )}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-gray-600">{tr.createdAt}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <code className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{tr.id}</code>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-medium">
                          {tr.collaborator?.charAt(0) || "U"}
                        </div>
                        <span className="font-medium text-gray-800">{tr.collaborator}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-gray-700">{tr.destination}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-gray-500 line-clamp-1 max-w-[200px] block">
                        {tr.purpose || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-gray-800">{formatMZN(tr.estimatedCost)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className={cn(
                        "text-xs px-2 py-0.5 rounded-full border-0 font-normal",
                        tr.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                        tr.status === "approved_gestor" ? "bg-blue-50 text-blue-700" :
                        tr.status === "approved_rh" ? "bg-green-50 text-green-700" :
                        tr.status === "emitted" ? "bg-purple-50 text-purple-700" : "bg-red-50 text-red-700"
                      )}>
                        {statusLabels[tr.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sorted.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-1">Nenhum registo encontrado</h3>
              <p className="text-sm text-gray-400">Aguardando solicitações de viagem</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;