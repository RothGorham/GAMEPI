
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, createContext, useEffect } from "react";
import { authService } from "./lib/api";
import { verificarSaudeServidor, iniciarVerificacaoSaude } from "./lib/healthCheck";

import PaginaIntro from "./components/PaginaIntro";
import PaginaLogin from "./components/PaginaLogin";
import Materias from "./components/Materias";
import Ranking from "./components/Ranking";
import Usuarios from "./components/Usuarios";
// Removidas importações de PerguntasWeb e PerguntasWeb2
// Removida importação de PerguntasSite que estava bugado
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Create context for authentication
export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (auth: boolean) => {},
  user: null as { email: string } | null,
  setUser: (user: { email: string } | null) => {},
  logout: () => {}
});

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  
  // Verificar autenticação ao iniciar o aplicativo
  useEffect(() => {
    const verificarAutenticacao = async () => {
      // Verificar a saúde do servidor primeiro
      const servidorOnline = await verificarSaudeServidor();
      
      if (servidorOnline) {
        const tokenValido = await authService.verificarToken();
        if (tokenValido) {
          setIsAuthenticated(true);
          // Aqui poderíamos buscar informações do usuário se necessário
          const email = localStorage.getItem('userEmail') || 'professor@exemplo.com';
          setUser({ email });
        }
      }
    };
    
    verificarAutenticacao();
    
    // Iniciar verificação periódica a cada 30 segundos
    const pararVerificacao = iniciarVerificacaoSaude(30000);
    
    // Limpar o intervalo quando o componente for desmontado
    return () => pararVerificacao();
  }, []);
  
  // Função para fazer logout
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, logout }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PaginaIntro />} />
              <Route path="/login" element={<PaginaLogin />} />
              <Route path="/professor" element={<Layout />}>
                <Route path="materias" element={<ProtectedRoute><Materias /></ProtectedRoute>} />
                <Route path="ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
                <Route path="usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
                {/* Removida rota para PerguntasSite que estava bugada */}
                {/* Removidas rotas de PerguntasWeb e PerguntasWeb2 */}
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
