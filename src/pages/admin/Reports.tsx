import { useTravelData } from "@/contexts/TravelDataContext";
import { formatMZN } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { exportContractsPDF, exportTravelRequestsPDF } from "@/utils/pdfExport";
import { cn } from "@/lib/utils";

const Reports = () => {
  const { contracts, travelRequests } = useTravelData();

  const destinationData = travelRequests.reduce<Record<string, number>>((acc, tr) => {
    const dest = tr.destination.split(",")[0];
    acc[dest] = (acc[dest] || 0) + tr.estimatedCost;
    return acc;
  }, {});

  const destChart = Object.entries(destinationData).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, custo: value }));

  const monthlyData = [
    { mes: "Jan", custo: 850000 },
    { mes: "Fev", custo: 620000 },
    { mes: "Mar", custo: 1280000 },
    { mes: "Abr", custo: 440000 },
  ];

  return (
    <div className="space-y-6 animate-fade-in p-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-8 bg-blue-500 rounded-full" />
            <h1 className="text-2xl font-bold text-slate-800">Relatórios</h1>
          </div>
          <p className="text-slate-500 text-sm ml-2">Análise estratégica de viagens e contratos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportTravelRequestsPDF(travelRequests)} className="border-slate-200">
            <Download className="w-4 h-4 mr-2" />Solicitações PDF
          </Button>
          <Button variant="outline" onClick={() => exportContractsPDF(contracts)} className="border-slate-200">
            <Download className="w-4 h-4 mr-2" />Contratos PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-700">Custos por Destino (MZN)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={destChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#475569' }} width={90} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => formatMZN(v)} />
                <Bar dataKey="custo" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-700">Evolução Mensal de Custos (MZN)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatMZN(v)} />
                <Line type="monotone" dataKey="custo" stroke="#1e40af" strokeWidth={2.5} dot={{ r: 5, fill: "#1e40af" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Melhorada */}
      <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-3">
          <h2 className="text-white font-semibold text-sm">Resumo dos Contratos</h2>
          <p className="text-white/60 text-xs mt-0.5">Visão geral dos contratos e sua utilização</p>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Agência</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Valor Total</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Consumido</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Disponível</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Utilização</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c, idx) => {
                  const usage = Math.round((c.consumedValue / c.totalValue) * 100);
                  return (
                    <tr key={c.id} className={cn(
                      "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                    )}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium">
                            {c.agency.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-800">{c.agency}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">{formatMZN(c.totalValue)}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-amber-600 font-medium">{formatMZN(c.consumedValue)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-emerald-600 font-semibold">{formatMZN(c.totalValue - c.consumedValue)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all",
                                usage > 80 ? "bg-red-500" : usage > 50 ? "bg-yellow-500" : "bg-emerald-500"
                              )}
                              style={{ width: `${usage}%` }}
                            />
                          </div>
                          <Badge className={cn(
                            "text-xs px-2 py-0.5 rounded-full border-0",
                            usage > 80 ? "bg-red-100 text-red-700" : usage > 50 ? "bg-yellow-100 text-yellow-700" : "bg-emerald-100 text-emerald-700"
                          )}>
                            {usage}%
                          </Badge>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {contracts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">Nenhum contrato encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;