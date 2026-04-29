import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Shield, Globe, Save, Building, Mail, Phone, Fingerprint, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SettingsPage = () => {
  const { toast } = useToast();
  const [companyData, setCompanyData] = useState({
    name: "Empresa Moçambicana, SA",
    nif: "400123456",
    email: "geral@empresa.co.mz",
    phone: "+258 84 123 4567",
  });

  const handleSave = () => {
    toast({ title: "Guardado", description: "Configurações actualizadas com sucesso." });
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-white to-blue-50/20 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Configurações
            </h1>
          </div>
          <p className="text-slate-500 text-sm ml-2">Configurações gerais do sistema</p>
        </div>

        {/* Dados da Empresa */}
        <Card className="border-0 shadow-md rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-white" />
              <h2 className="text-white font-semibold">Dados da Empresa</h2>
            </div>
            <p className="text-white/80 text-xs mt-0.5">Informações institucionais da empresa</p>
          </div>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">Nome da Empresa</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    value={companyData.name} 
                    onChange={e => setCompanyData(p => ({ ...p, name: e.target.value }))} 
                    className="pl-9 border-slate-200 focus:border-blue-400 rounded-lg bg-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">NIF / NUIT</Label>
                <Input 
                  value={companyData.nif} 
                  onChange={e => setCompanyData(p => ({ ...p, nif: e.target.value }))} 
                  className="border-slate-200 focus:border-blue-400 rounded-lg bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">Email de Contacto</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="email"
                    value={companyData.email} 
                    onChange={e => setCompanyData(p => ({ ...p, email: e.target.value }))} 
                    className="pl-9 border-slate-200 focus:border-blue-400 rounded-lg bg-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    value={companyData.phone} 
                    onChange={e => setCompanyData(p => ({ ...p, phone: e.target.value }))} 
                    className="pl-9 border-slate-200 focus:border-blue-400 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="border-0 shadow-md rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-white" />
              <h2 className="text-white font-semibold">Notificações</h2>
            </div>
            <p className="text-white/80 text-xs mt-0.5">Configuração de alertas e notificações</p>
          </div>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-800">Notificações por Email</p>
                <p className="text-xs text-slate-500">Enviar emails automáticos às agências</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-800">Gerar PDF Automático</p>
                <p className="text-xs text-slate-500">Gerar documento PDF com cada notificação</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-800">Alertas de Saldo Baixo</p>
                <p className="text-xs text-slate-500">Alertar quando saldo do contrato for inferior a 10%</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className="border-0 shadow-md rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-white" />
              <h2 className="text-white font-semibold">Segurança</h2>
            </div>
            <p className="text-white/80 text-xs mt-0.5">Configurações de segurança do sistema</p>
          </div>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-purple-500" />
                  <p className="text-sm font-medium text-slate-800">Autenticação de Dois Factores</p>
                </div>
                <p className="text-xs text-slate-500 ml-6">Exigir 2FA para todos os utilizadores</p>
              </div>
              <Switch className="data-[state=checked]:bg-purple-500" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-purple-500" />
                  <p className="text-sm font-medium text-slate-800">Sessão Automática</p>
                </div>
                <p className="text-xs text-slate-500 ml-6">Terminar sessão após 30 minutos de inactividade</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;