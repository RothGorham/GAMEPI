import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { authService } from "@/lib/api";
import { verificarSaudeServidor } from "@/lib/healthCheck";

const PaginaLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  
  // Verificar a saúde do servidor ao carregar o componente
  useEffect(() => {
    verificarSaudeServidor();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Verificar se o servidor está online antes de tentar fazer login
      const servidorOnline = await verificarSaudeServidor();
      if (!servidorOnline) {
        toast.error("Não foi possível conectar ao servidor. Verifique se o backend está em execução.");
        setIsLoading(false);
        return;
      }
      
      // Autenticar com o backend
      await authService.login(email, password);
      
      // Salvar o email no localStorage para uso posterior
      localStorage.setItem('userEmail', email);
      
      // Atualizar o estado de autenticação
      setIsAuthenticated(true);
      setUser({ email });
      
      toast.success("Login realizado com sucesso!");
      navigate("/professor/materias");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('servidor')) {
          toast.error("Erro de conexão com o servidor. Verifique se o backend está em execução.");
        } else {
          toast.error(error.message || "Erro ao fazer login");
        }
      } else {
        toast.error("Erro desconhecido ao fazer login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="game-container min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="luxury-card overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold to-game-primary"></div>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="https://poliedro-api.p4ed.com/sso/auth/resources/vv3tb/login/updated-poliedro/dist/static/media/logo-sistema-p+.eb1179607d4dc652db31b1f92b5df4b5.svg" 
                  alt="Logo Poliedro" 
                  className="w-6 h-6 mr-2" 
                />
                <CardTitle className="text-2xl font-bold gold-gradient">Área do Professor</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-gold"
              >
                Voltar
              </Button>
            </div>
            <CardDescription className="text-muted-foreground">
              Entre com suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="professor@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary/50 border-gold/30 focus:border-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-secondary/50 border-gold/30 focus:border-gold"
                />
              </div>
              <Button
                type="submit"
                className="w-full game-button-primary mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </span>
                ) : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t border-gold/20 pt-4">
            <p className="text-center text-sm text-muted-foreground w-full">
              Este é um painel administrativo exclusivo para professores.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaginaLogin;
