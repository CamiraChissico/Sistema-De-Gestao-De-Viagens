import { useAuth } from "@/contexts/AuthContext";
import { useTravelData } from "@/contexts/TravelDataContext";
import { statusLabels, statusColors, formatMZN } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plane, TrendingUp, Users, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const RHDashboard = () => {
  const { user } = useAuth();
  const { contracts, travelRequests, collaborators } = useTravelData();

  const activeContracts = contracts.filter((c) => c.status === "active");
  const totalBudget = activeContracts.reduce((s, c) => s + c.totalValue, 0);
  const totalConsumed = activeContracts.reduce((s, c) => s + c.consumedValue, 0);
  const myRequests = travelRequests.filter((t) => t.requester === user?.name);

  const stats = [
    { label: "Contratos Activos", value: activeContracts.length, icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Saldo Disponível", value: formatMZN(totalBudget - totalConsumed), icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Colaboradores", value: collaborators.length, icon: Users, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Minhas Solicitações", value: myRequests.length, icon: Plane, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  const chartData = contracts.filter(c => c.status !== "expired").slice(0, 6).map((c) => ({
    name: c.agency.split(",")[0].split(" ").slice(0, 2).join(" "),
    consumido: c.consumedValue / 1000,
    disponivel: (c.totalValue - c.consumedValue) / 1000,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">RH Dashboard</h1>
        <p className="text-muted-foreground text-sm">Gestão de contratos e solicitações</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", stat.bgColor)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Consumo por Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="consumido" fill="#3b82f6" name="Consumido" />
                <Bar dataKey="disponivel" fill="#10b981" name="Disponível" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Solicitações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {travelRequests.slice(0, 5).map((req) => (
                <div key={req.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{req.collaborator}</p>
                    <p className="text-xs text-muted-foreground">{req.destination}</p>
                  </div>
                  <Badge className={cn("text-xs", statusColors[req.status])}>
                    {statusLabels[req.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RHDashboard;