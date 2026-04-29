import { useAuth } from "@/contexts/AuthContext";
import { useTravelData } from "@/contexts/TravelDataContext";
import { statusLabels, statusColors, formatMZN } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plane, TrendingUp, Users, DollarSign, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";

const RHDashboard = () => {
  const { user } = useAuth();
  const { contracts, travelRequests, collaborators } = useTravelData();

  // Dados estatísticos
  const activeContracts = contracts.filter((c) => c.status === "active");
  const totalBudget = activeContracts.reduce((s, c) => s + c.totalValue, 0);
  const totalConsumed = activeContracts.reduce((s, c) => s + c.consumedValue, 0);
  const pendingRequests = travelRequests.filter((t) => t.status === "pending" || t.status === "approved_gestor").length;
  const emittedCount = travelRequests.filter((t) => t.status === "emitted").length;
  const myRequests = travelRequests.filter((t) => t.requester === user?.name);
  const usagePercent = totalBudget > 0 ? (totalConsumed / totalBudget) * 100 : 0;

  // Dados para gráfico de pizza - Estado dos Pedidos
  const pieData = [
    { name: "Pendente", value: travelRequests.filter((t) => t.status === "pending").length, color: "#f59e0b" },
    { name: "Em Aprovação", value: travelRequests.filter((t) => ["approved_gestor", "approved_rh"].includes(t.status)).length, color: "#3b82f6" },
    { name: "Emitido", value: travelRequests.filter((t) => t.status === "emitted").length, color: "#10b981" },
    { name: "Rejeitado", value: travelRequests.filter((t) => t.status === "rejected").length, color: "#ef4444" },
  ].filter(d => d.value > 0);

  // Dados para gráfico de consumo por contrato
  const chartData = contracts.filter(c => c.status !== "expired").slice(0, 6).map((c) => ({
    name: c.agency.split(",")[0].split(" ").slice(0, 2).join(" "),
    consumido: c.consumedValue / 1000,
    disponivel: (c.totalValue - c.consumedValue) / 1000,
  }));

  // Dados para tendência mensal
  const monthlyTrend = [
    { mes: "Jan", solicitacoes: 12, aprovadas: 8 },
    { mes: "Fev", solicitacoes: 15, aprovadas: 10 },
    { mes: "Mar", solicitacoes: 18, aprovadas: 14 },
    { mes: "Abr", solicitacoes: 10, aprovadas: 7 },
  ];

  // Solicitações recentes (apenas visualização)
  const recentRequests = travelRequests.slice(0, 5);

  const stats = [
    { label: "Contratos Activos", value: activeContracts.length, icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50", trend: `${activeContracts.length} activos` },
    { label: "Saldo Disponível", value: formatMZN(totalBudget - totalConsumed), icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50", trend: `${usagePercent.toFixed(0)}% consumido` },
    { label: "Colaboradores", value: collaborators.length, icon: Users, color: "text-purple-600", bgColor: "bg-purple-50", trend: "activos" },
    { label: "Minhas Solicitações", value: myRequests.length, icon: Plane, color: "text-orange-600", bgColor: "bg-orange-50", trend: "total" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">RH Dashboard</h1>
          <p className="text-muted-foreground text-sm">Visão geral de contratos e solicitações</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("pt-MZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{stat.trend}</p>
                </div>
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", stat.bgColor)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Consumo por Contrato */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Consumo por Contrato (MZN mil)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v.toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString()}k MZN`} />
                <Bar dataKey="consumido" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Consumido" />
                <Bar dataKey="disponivel" fill="#10b981" radius={[6, 6, 0, 0]} name="Disponível" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Estado dos Pedidos */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-500" />
              Estado dos Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4 w-full">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendência Mensal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Tendência Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorSolicitacoes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="solicitacoes" stroke="#3b82f6" fill="url(#colorSolicitacoes)" name="Solicitações" />
                <Area type="monotone" dataKey="aprovadas" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Aprovadas" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500" /><span>Solicitações</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" /><span>Aprovadas</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de resumo rápido */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-800">{pendingRequests}</p>
                <p className="text-xs text-blue-700">Pedidos Pendentes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-800">{emittedCount}</p>
                <p className="text-xs text-green-700">Viagens Emitidas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terceiro card de resumo */}
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-700 uppercase tracking-wide">Orçamento Restante</p>
              <p className="text-xl font-bold text-purple-800">{formatMZN(totalBudget - totalConsumed)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-purple-400 opacity-50" />
          </CardContent>
        </Card>
      </div>

      {/* Últimas Solicitações - APENAS VISUALIZAÇÃO */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Plane className="w-4 h-4 text-gray-500" />
            Últimas Solicitações
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Últimas 5 solicitações registadas</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Colaborador</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Destino</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{req.collaborator}</td>
                    <td className="px-4 py-3 text-gray-600">{req.destination.split(",")[0]}</td>
                    <td className="px-4 py-3 text-gray-600">{req.departureDate}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{formatMZN(req.estimatedCost)}</td>
                    <td className="px-4 py-3">
                      <Badge className={cn("text-xs", statusColors[req.status])}>
                        {statusLabels[req.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RHDashboard;