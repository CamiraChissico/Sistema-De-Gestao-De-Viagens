import { useTravelData } from "@/contexts/TravelDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const Analytics = () => {
  const { contracts, travelRequests, collaborators } = useTravelData();

  const statusData = [
    { name: "Pendente", value: travelRequests.filter(t => t.status === "pending").length, color: "hsl(38, 92%, 50%)" },
    { name: "Aprovado", value: travelRequests.filter(t => ["approved_gestor", "approved_rh"].includes(t.status)).length, color: "hsl(210, 80%, 52%)" },
    { name: "Emitido", value: travelRequests.filter(t => t.status === "emitted").length, color: "hsl(152, 55%, 40%)" },
    { name: "Rejeitado", value: travelRequests.filter(t => t.status === "rejected").length, color: "hsl(0, 72%, 51%)" },
  ];

  const deptData = collaborators.reduce<Record<string, number>>((acc, col) => {
    const trips = travelRequests.filter(t => t.collaborator === col.name);
    if (!acc[col.department]) acc[col.department] = 0;
    acc[col.department] += trips.length;
    return acc;
  }, {});
  const deptChart = Object.entries(deptData).map(([dept, count]) => ({ dept, viagens: count }));

  const contractUsage = contracts.map(c => ({
    name: c.agency.split(",")[0].split(" ")[0],
    utilização: Math.round((c.consumedValue / c.totalValue) * 100),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Análises</h1>
        <p className="text-muted-foreground text-sm">Métricas avançadas e indicadores de desempenho</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Distribuição por Estado</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" paddingAngle={3} strokeWidth={0}>
                  {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              {statusData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-bold text-foreground ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Viagens por Departamento</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" vertical={false} />
                <XAxis dataKey="dept" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="viagens" fill="hsl(215, 60%, 22%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Taxa de Utilização por Contrato (%)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contractUsage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Bar dataKey="utilização" radius={[0, 6, 6, 0]}>
                  {contractUsage.map((entry, i) => (
                    <Cell key={i} fill={entry.utilização > 90 ? "hsl(0, 72%, 51%)" : entry.utilização > 70 ? "hsl(38, 92%, 50%)" : "hsl(152, 55%, 40%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
