import { useAuth } from "@/contexts/AuthContext";
import { useTravelData } from "@/contexts/TravelDataContext";
import { statusLabels, statusColors, formatMZN } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, TrendingUp, Calendar, Plane, Users, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";

const GestorDashboard = () => {
  const { user } = useAuth();
  const { travelRequests } = useTravelData();

  // Dados estatísticos
  const pendingApprovals = travelRequests.filter(t => t.status === "pending");
  const approved = travelRequests.filter(t => t.status === "approved_gestor");
  const rejected = travelRequests.filter(t => t.status === "rejected");
  const totalRequests = travelRequests.length;
  const approvalRate = totalRequests > 0 ? ((approved.length / totalRequests) * 100).toFixed(0) : 0;

  // Dados para gráfico de pizza
  const pieData = [
    { name: "Pendentes", value: pendingApprovals.length, color: "#f59e0b" },
    { name: "Aprovados", value: approved.length, color: "#10b981" },
    { name: "Rejeitados", value: rejected.length, color: "#ef4444" },
  ].filter(d => d.value > 0);

  // Dados para gráfico de tendência mensal
  const monthlyData = [
    { mes: "Jan", aprovadas: 8, rejeitadas: 2, pendentes: 3 },
    { mes: "Fev", aprovadas: 12, rejeitadas: 3, pendentes: 4 },
    { mes: "Mar", aprovadas: 15, rejeitadas: 1, pendentes: 2 },
    { mes: "Abr", aprovadas: 6, rejeitadas: 2, pendentes: 5 },
  ];

  // Solicitações recentes (apenas visualização)
  const recentRequests = travelRequests.slice(0, 5);

  // Dados para área de evolução
  const evolutionData = monthlyData.map(m => ({
    mes: m.mes,
    total: m.aprovadas + m.rejeitadas + m.pendentes,
  }));

  const stats = [
    { label: "Aguardando Aprovação", value: pendingApprovals.length, icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50", trend: "+2 esta semana" },
    { label: "Aprovados", value: approved.length, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", trend: "+5 este mês" },
    { label: "Rejeitados", value: rejected.length, icon: XCircle, color: "text-red-600", bgColor: "bg-red-50", trend: "-1 este mês" },
    { label: "Taxa de Aprovação", value: `${approvalRate}%`, icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-50", trend: "meta: 80%" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestor Dashboard</h1>
          <p className="text-muted-foreground text-sm">Visão geral das aprovações de viagem</p>
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
        {/* Gráfico de evolução mensal */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Evolução Mensal de Solicitações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorAprovadas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPendentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="aprovadas" stackId="1" stroke="#10b981" fill="url(#colorAprovadas)" name="Aprovadas" />
                <Area type="monotone" dataKey="pendentes" stackId="1" stroke="#f59e0b" fill="url(#colorPendentes)" name="Pendentes" />
                <Area type="monotone" dataKey="rejeitadas" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="Rejeitadas" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" /><span>Aprovadas</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500" /><span>Pendentes</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" /><span>Rejeitadas</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de distribuição */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-500" />
              Distribuição de Solicitações
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
              <div className="grid grid-cols-3 gap-4 mt-4 w-full">
                <div className="text-center p-2 rounded-lg bg-orange-50">
                  <p className="text-2xl font-bold text-orange-600">{pendingApprovals.length}</p>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-green-50">
                  <p className="text-2xl font-bold text-green-600">{approved.length}</p>
                  <p className="text-xs text-muted-foreground">Aprovadas</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-red-50">
                  <p className="text-2xl font-bold text-red-600">{rejected.length}</p>
                  <p className="text-xs text-muted-foreground">Rejeitadas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solicitações Recentes - APENAS VISUALIZAÇÃO */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Solicitações Recentes
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

      {/* Resumo rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                <Plane className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <p className="text-xs text-blue-700 uppercase tracking-wide">Total de Viagens</p>
                <p className="text-xl font-bold text-blue-800">{totalRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="text-xs text-purple-700 uppercase tracking-wide">Este Mês</p>
                <p className="text-xl font-bold text-purple-800">{monthlyData[3].aprovadas + monthlyData[3].pendentes + monthlyData[3].rejeitadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs text-emerald-700 uppercase tracking-wide">Meta de Aprovação</p>
                <p className="text-xl font-bold text-emerald-800">80%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GestorDashboard;