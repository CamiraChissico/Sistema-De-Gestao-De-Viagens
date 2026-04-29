import { useState } from "react";
import { useTravelData } from "@/contexts/TravelDataContext";
import { formatMZN } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, TrendingDown, TrendingUp, Building2, Calendar, Plane, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const Financial = () => {
  const { contracts, travelRequests } = useTravelData();
  const [selectedContract, setSelectedContract] = useState<string>("all");

  const totalBudget = contracts.reduce((s, c) => s + c.totalValue, 0);
  const totalConsumed = contracts.reduce((s, c) => s + c.consumedValue, 0);
  const totalAvailable = totalBudget - totalConsumed;
  const usagePercent = (totalConsumed / totalBudget) * 100;

  // Filtrar viagens por contrato selecionado
  const filteredTravels = selectedContract === "all" 
    ? travelRequests.filter(t => t.status === "emitted")
    : travelRequests.filter(t => t.contractId === selectedContract && t.status === "emitted");

  const stats = [
    { label: "Orçamento Total", value: formatMZN(totalBudget), icon: Wallet, bgColor: "bg-gradient-to-r from-blue-500 to-blue-600", trend: "orçamento total" },
    { label: "Valor Consumido", value: formatMZN(totalConsumed), icon: TrendingDown, bgColor: "bg-gradient-to-r from-red-500 to-red-600", trend: `${usagePercent.toFixed(1)}% do total` },
    { label: "Saldo Disponível", value: formatMZN(totalAvailable), icon: TrendingUp, bgColor: "bg-gradient-to-r from-emerald-500 to-emerald-600", trend: "disponível para uso" },
    { label: "Agências", value: contracts.length, icon: Building2, bgColor: "bg-gradient-to-r from-purple-500 to-purple-600", trend: "parceiras" },
  ];

  // Calcular gastos por contrato
  const contractSpending = contracts.map(c => ({
    id: c.id,
    agency: c.agency,
    total: c.totalValue,
    consumed: c.consumedValue,
    available: c.totalValue - c.consumedValue,
    percent: (c.consumedValue / c.totalValue) * 100,
    trips: travelRequests.filter(t => t.contractId === c.id && t.status === "emitted").length
  }));

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
            <h1 className="text-3xl font-bold text-slate-800">Financeiro</h1>
          </div>
          <p className="text-slate-500 text-sm ml-2">Controlo orçamental e gestão de contratos</p>
        </div>
        <Select value={selectedContract} onValueChange={setSelectedContract}>
          <SelectTrigger className="w-[220px] bg-white border-slate-200 rounded-xl shadow-sm">
            <SelectValue placeholder="Todos os contratos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os contratos</SelectItem>
            {contracts.map(c => <SelectItem key={c.id} value={c.id}>{c.agency}</SelectItem>)}
          </SelectContent>
        </Select>
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

      {/* Tabs */}
      <Tabs defaultValue="contracts" className="space-y-4">
        <TabsList className="bg-white shadow-sm rounded-xl p-1">
          <TabsTrigger value="contracts" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Contratos
          </TabsTrigger>
          <TabsTrigger value="trips" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Viagens
          </TabsTrigger>
        </TabsList>

        {/* Tab Contratos */}
        <TabsContent value="contracts" className="space-y-4">
          <Card className="border-0 rounded-xl shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Agência</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Valor Total</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Consumido</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Disponível</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Utilização</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Viagens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractSpending.map((contract) => (
                      <tr key={contract.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-800">{contract.agency}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{formatMZN(contract.total)}</td>
                        <td className="px-6 py-4 text-amber-600 font-medium">{formatMZN(contract.consumed)}</td>
                        <td className="px-6 py-4 text-emerald-600 font-medium">{formatMZN(contract.available)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div 
                                className={cn("h-2 rounded-full transition-all", 
                                  contract.percent > 80 ? "bg-red-500" : 
                                  contract.percent > 50 ? "bg-yellow-500" : "bg-emerald-500"
                                )}
                                style={{ width: `${contract.percent}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-slate-600">{contract.percent.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge className="bg-blue-100 text-blue-700 border-0 px-3 py-1 rounded-full">
                            {contract.trips} viagem{contract.trips !== 1 ? 's' : ''}
                          </Badge>
                        </td>
                       </tr>
                    ))}
                  </tbody>
                 </table>
               </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* Tab Viagens */}
        <TabsContent value="trips" className="space-y-4">
          <Card className="border-0 rounded-xl shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Colaborador</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Destino</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contrato</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTravels.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          <Plane className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                          <p>Nenhuma viagem encontrada</p>
                        </td>
                      </tr>
                    ) : (
                      filteredTravels.map((req) => {
                        const contract = contracts.find(c => c.id === req.contractId);
                        return (
                          <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-slate-600">{req.departureDate}</td>
                            <td className="px-6 py-4 font-medium text-slate-800">{req.collaborator}</td>
                            <td className="px-6 py-4 text-slate-600">{req.destination}</td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className="bg-slate-100 text-slate-600 border-0">
                                {contract?.agency?.split(",")[0] || req.contractId}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-red-600">
                              {formatMZN(req.estimatedCost)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financial;