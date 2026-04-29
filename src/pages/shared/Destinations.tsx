import { useTravelData } from "@/contexts/TravelDataContext";
import { formatMZN } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Plane, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const Destinations = () => {
  const { travelRequests } = useTravelData();

  const destStats = travelRequests.reduce<
    Record<string, { count: number; cost: number }>
  >((acc, tr) => {
    const dest = tr.destination.split(",")[0];
    if (!acc[dest]) acc[dest] = { count: 0, cost: 0 };
    acc[dest].count++;
    acc[dest].cost += tr.estimatedCost;
    return acc;
  }, {});

  const destArray = Object.entries(destStats)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, data]) => ({ name, ...data }));

  const chartData = destArray.map((d) => ({
    name: d.name,
    viagens: d.count,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dest = destArray.find(d => d.name === label);
      return (
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3">
          <p className="font-semibold text-slate-800">{label}</p>
          <p className="text-sm text-blue-600">Viagens: {payload[0].value}</p>
          {dest && (
            <>
              <p className="text-sm text-emerald-600">Custo Total: {formatMZN(dest.cost)}</p>
              <p className="text-xs text-slate-400">Custo Médio: {formatMZN(Math.round(dest.cost / dest.count))}</p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
          <h1 className="text-2xl font-bold text-slate-800">Destinos</h1>
        </div>
        <p className="text-slate-500 text-sm ml-2">Análise de destinos e frequência de viagens</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs uppercase">Destinos Únicos</p>
              <p className="text-3xl font-bold mt-1">{destArray.length}</p>
            </div>
            <Globe className="w-10 h-10 text-white/30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs uppercase">Total Viagens</p>
              <p className="text-3xl font-bold mt-1">{travelRequests.length}</p>
            </div>
            <Plane className="w-10 h-10 text-white/30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs uppercase">Destino Top</p>
              <p className="text-xl font-bold mt-1 truncate">{destArray[0]?.name || "—"}</p>
              <p className="text-xs text-white/70">{destArray[0]?.count || 0} viagens</p>
            </div>
            <TrendingUp className="w-10 h-10 text-white/30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs uppercase">Custo Total</p>
              <p className="text-xl font-bold mt-1">{formatMZN(destArray.reduce((sum, d) => sum + d.cost, 0))}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-white/30" />
          </div>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Viagens por Destino</h2>
            <p className="text-sm text-slate-500">Número de viagens por destino</p>
          </div>
          <Badge className="bg-blue-100 text-blue-700 border-0">{destArray.length} destinos</Badge>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              axisLine={false} 
              tickLine={false}
              angle={-25}
              textAnchor="end"
              height={70}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              axisLine={false} 
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
            <Bar dataKey="viagens" fill="#3b82f6" name="Viagens" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="text-center text-xs text-slate-400 mt-4">
          Cada barra representa o número total de viagens para cada destino
        </div>
      </div>

      {/* TABELA */}
      <Card className="border-0 shadow-md rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-3">
          <h2 className="text-white font-semibold text-sm">Detalhes por Destino</h2>
          <p className="text-white/60 text-xs mt-0.5">Lista completa de destinos ordenada por viagens</p>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">#</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Destino</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Viagens</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Custo Total</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Custo Médio</th>
                </tr>
              </thead>
              <tbody>
                {destArray.map((d, idx) => (
                  <tr key={d.name} className={cn(
                    "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  )}>
                    <td className="px-5 py-3.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className="bg-blue-100 text-blue-700 border-0 px-3 py-1 rounded-full">
                        {d.count} viagem{d.count !== 1 ? 's' : ''}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{formatMZN(d.cost)}</td>
                    <td className="px-5 py-3.5 text-slate-500">{formatMZN(Math.round(d.cost / d.count))}</td>
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

export default Destinations;