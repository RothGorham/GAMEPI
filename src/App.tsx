
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, createContext, useEffect } from "react";
import { authService } from "./lib/api";

import PaginaIntro from "./components/PaginaIntro";
import PaginaLogin from "./components/PaginaLogin";
import Materias from "./components/Materias";
import Ranking from "./components/Ranking";
import Usuarios from "./components/Usuarios";
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
      const tokenValido = await authService.verificarToken();
      if (tokenValido) {
        setIsAuthenticated(true);
        // Aqui poderíamos buscar informações do usuário se necessário
        setUser({ email: "professor@exemplo.com" }); // Valor temporário
      }
    };
    
    verificarAutenticacao();
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
