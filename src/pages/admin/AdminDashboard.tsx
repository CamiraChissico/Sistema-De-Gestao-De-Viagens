import { useAuth } from "@/contexts/AuthContext";
import { useTravelData } from "@/contexts/TravelDataContext";
import { statusLabels, statusColors, formatMZN } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Plane, TrendingUp, Users, DollarSign, Download, Eye, Calendar, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const { contracts, travelRequests, collaborators } = useTravelData();

  const activeContracts = contracts.filter((c) => c.status === "active");
  const totalBudget = activeContracts.reduce((s, c) => s + c.totalValue, 0);
  const totalConsumed = activeContracts.reduce((s, c) => s + c.consumedValue, 0);
  const pendingRequests = travelRequests.filter((t) => t.status === "pending" || t.status === "approved_gestor").length;
  const emittedCount = travelRequests.filter((t) => t.status === "emitted").length;

  const stats = [
    { label: "Contratos Activos", value: activeContracts.length, icon: FileText, color: "from-blue-500 to-blue-600" },
    { label: "Saldo Disponível", value: formatMZN(totalBudget - totalConsumed), icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
    { label: "Pedidos Pendentes", value: pendingRequests, icon: Plane, color: "from-amber-500 to-amber-600" },
    { label: "Colaboradores", value: collaborators.length, icon: Users, color: "from-purple-500 to-purple-600" },
  ];

  const chartData = contracts.filter(c => c.status !== "expired").map((c) => ({
    name: c.agency.split(",")[0].split(" ").slice(0, 2).join(" "),
    consumido: c.consumedValue / 1000,
    disponivel: (c.totalValue - c.consumedValue) / 1000,
  }));

  const pieData = [
    { name: "Pendente", value: travelRequests.filter((t) => t.status === "pending").length },
    { name: "Em Aprovação", value: travelRequests.filter((t) => ["approved_gestor", "approved_rh"].includes(t.status)).length },
    { name: "Emitido", value: travelRequests.filter((t) => t.status === "emitted").length },
    { name: "Rejeitado", value: travelRequests.filter((t) => t.status === "rejected").length },
  ];
  const pieColors = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

  const monthlyData = [
    { mes: "Jan", viagens: 12, gasto: 850000 },
    { mes: "Fev", viagens: 8, gasto: 620000 },
    { mes: "Mar", viagens: 15, gasto: 980000 },
    { mes: "Abr", viagens: 6, gasto: 440000 },
  ];

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          </div>
          <p className="text-slate-500 text-sm ml-2">Monitorização estratégica e relatórios</p>
        </div>
        <Button variant="outline" className="border-slate-200">
          <Download className="w-4 h-4 mr-2" /> Exportar Relatório
        </Button>
      </div>

      {/* Stats Cards Melhorados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className={cn("relative overflow-hidden rounded-xl p-5 bg-gradient-to-br text-white shadow-md hover:shadow-lg transition-all", stat.color)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="w-10 h-10 text-white/30" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-700">Consumo por Contrato (MZN mil)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="consumido" fill="#1e40af" radius={[6, 6, 0, 0]} name="Consumido" />
                <Bar dataKey="disponivel" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Disponível" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-700">Estado dos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={4} strokeWidth={0}>
                  {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: pieColors[i] }} />
                  <span>{d.name}</span>
                  <span className="font-semibold ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-700">Tendência Mensal</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="gasto" stroke="#0ea5e9" name="Gasto (MZN)" />
                <Line yAxisId="right" type="monotone" dataKey="viagens" stroke="#1e40af" name="Viagens" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-700">Top Contratos por Valor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contracts.slice(0, 5).map((c, idx) => (
                <div key={c.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{c.agency.split(",")[0]}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{formatMZN(c.totalValue)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ÚLTIMA TABELA MELHORADA */}
      <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white" />
            <h2 className="text-white font-semibold text-sm">Últimas Solicitações</h2>
            <Badge className="bg-white/20 text-white border-0 ml-2">{travelRequests.length} total</Badge>
          </div>
          <p className="text-white/60 text-xs mt-0.5">Solicitações mais recentes de viagem</p>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Colaborador</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Destino</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Data</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Custo</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                {travelRequests.slice(0, 5).map((tr, idx) => (
                  <tr key={tr.id} className={cn(
                    "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  )}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                          {tr.collaborator?.charAt(0) || "U"}
                        </div>
                        <span className="font-medium text-slate-700">{tr.collaborator}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600">{tr.destination.split(",")[0]}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{tr.departureDate}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{formatMZN(tr.estimatedCost)}</td>
                    <td className="px-5 py-3.5">
                      <Badge className={cn(
                        "text-xs px-2 py-0.5 rounded-full border-0",
                        tr.status === "pending" ? "bg-amber-100 text-amber-700" :
                        tr.status === "approved_gestor" ? "bg-blue-100 text-blue-700" :
                        tr.status === "approved_rh" ? "bg-green-100 text-green-700" :
                        tr.status === "emitted" ? "bg-purple-100 text-purple-700" : "bg-red-100 text-red-700"
                      )}>
                        {statusLabels[tr.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {travelRequests.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">Nenhuma solicitação encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;