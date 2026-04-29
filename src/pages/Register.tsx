import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plane, Eye, EyeOff, ArrowLeft, UserPlus } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    role: "rh" as UserRole 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("As palavras-passe não coincidem.");
      return;
    }
    if (formData.password.length < 6) {
      setError("A palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = register(formData.name, formData.email, formData.password, formData.role);
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Card principal - QUADRADO */}
        <div className="bg-white shadow-xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TravelControl
              </span>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <UserPlus className="w-6 h-6 text-blue-600" />
              Criar Conta
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Preencha os dados para solicitar acesso ao sistema
            </p>
          </div>

          {success ? (
            <div className="border-2 border-emerald-200 bg-emerald-50 p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center mx-auto">
                <UserPlus className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Conta Criada!</h3>
              <p className="text-sm text-gray-600">{success}</p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/login")} 
                className="w-full border-2 border-gray-300 hover:border-blue-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Nome Completo</Label>
                <Input 
                  placeholder="Seu nome completo" 
                  value={formData.name} 
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} 
                  required 
                  className="h-11 border-2 border-gray-300 focus:border-blue-500 focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Email Institucional</Label>
                <Input 
                  type="email" 
                  placeholder="nome@empresa.co.mz" 
                  value={formData.email} 
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} 
                  required 
                  className="h-11 border-2 border-gray-300 focus:border-blue-500 focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Perfil de Acesso</Label>
                <Select value={formData.role} onValueChange={v => setFormData(p => ({ ...p, role: v as UserRole }))}>
                  <SelectTrigger className="h-11 border-2 border-gray-300 focus:border-blue-500 focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rh">Recursos Humanos</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Palavra-passe</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={formData.password} 
                    onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} 
                    required 
                    className="h-11 pr-10 border-2 border-gray-300 focus:border-blue-500 focus:ring-0"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Confirmar Palavra-passe</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.confirmPassword} 
                  onChange={e => setFormData(p => ({ ...p, confirmPassword: e.target.value }))} 
                  required 
                  className="h-11 border-2 border-gray-300 focus:border-blue-500 focus:ring-0"
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 px-4 py-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    A criar...
                  </div>
                ) : "Criar Conta"}
              </Button>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => navigate("/login")} 
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Já tem conta? Faça login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;