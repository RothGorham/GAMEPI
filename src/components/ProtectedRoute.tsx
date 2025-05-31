import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { authService } from "@/lib/api";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(AuthContext);
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAutenticacao = async () => {
      try {
        // Verificar se há um token válido com o backend
        const tokenValido = await authService.verificarToken();
        
        if (!tokenValido && !isAuthenticated) {
          // Se não houver token válido e não estiver autenticado, redirecionar para login
          toast.error("Sessão expirada. Por favor, faça login novamente.");
          navigate("/login");
        } else if (tokenValido && !isAuthenticated) {
          // Se houver token válido mas não estiver autenticado no contexto, atualizar o contexto
          setIsAuthenticated(true);
          // Aqui poderíamos buscar informações do usuário se o backend tiver uma rota para isso
          const email = localStorage.getItem('userEmail') || 'professor@exemplo.com';
          setUser({ email });
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        toast.error("Erro ao verificar autenticação. Por favor, faça login novamente.");
        navigate("/login");
      } finally {
        setIsVerifying(false);
      }
    };

    verificarAutenticacao();
  }, [isAuthenticated, navigate, setIsAuthenticated, setUser]);

  if (isVerifying) {
    // Exibir um indicador de carregamento enquanto verifica a autenticação
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
