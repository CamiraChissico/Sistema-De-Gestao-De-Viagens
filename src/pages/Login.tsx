import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Eye, EyeOff, Sparkles, Shield, Users, Building2, ArrowRight, CheckCircle } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (!login(email, password)) {
      setError("Credenciais inválidas. Verifique o email e a palavra-passe.");
    }
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-40 left-20 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl animate-bounce delay-150" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100 transition-all duration-300">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105 duration-300">
                  <Plane className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    TravelControl
                  </span>
                  <p className="text-[10px] text-gray-400 tracking-wider">Gestão de Viagens</p>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-4">
              <Sparkles className="w-3 h-3" />
              Sistema de Gestão de Viagens
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-500 text-sm">
              Introduza as suas credenciais para aceder ao sistema
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email institucional
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@empresa.co.mz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 rounded-lg bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Palavra-passe
                </Label>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  Esqueceu a password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 rounded-lg bg-gray-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>A entrar...</span>
                </div>
              ) : (
                <>
                  Entrar no Sistema
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Não tem conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>

        {/* Demo accounts card */}
        <div className="mt-6">
          <Card className="border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-amber-500" />
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Contas de demonstração
                </p>
                <Shield className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xs text-gray-500 text-center mb-3">
                Palavra-passe: <code className="px-2 py-0.5 bg-gray-100 rounded-md font-mono font-semibold">123456</code>
              </p>
              <div className="space-y-2">
                {[
                  { 
                    label: "Recursos Humanos", 
                    email: "rh@empresa.co.mz", 
                    icon: Users,
                    bgHover: "hover:bg-purple-50",
                    iconBg: "from-purple-500 to-purple-600"
                  },
                  { 
                    label: "Gestor", 
                    email: "gestor@empresa.co.mz", 
                    icon: Building2,
                    bgHover: "hover:bg-emerald-50",
                    iconBg: "from-emerald-500 to-emerald-600"
                  },
                  { 
                    label: "Administração", 
                    email: "admin@empresa.co.mz", 
                    icon: Shield,
                    bgHover: "hover:bg-indigo-50",
                    iconBg: "from-blue-600 to-indigo-600"
                  },
                ].map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword("123456");
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50 ${account.bgHover} transition-all duration-200 text-left border border-gray-100 hover:border-gray-200 group`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${account.iconBg} flex items-center justify-center shadow-sm group-hover:shadow transition-all duration-200`}>
                      <account.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{account.label}</p>
                      <p className="text-xs text-gray-400">{account.email}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Ambiente seguro • Dados encriptados
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;