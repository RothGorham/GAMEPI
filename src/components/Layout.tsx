import { useState, useContext } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trophy, Users, BookOpen, Menu, X, LogOut, Globe } from "lucide-react";
import { AuthContext } from "../App";
import { toast } from "sonner";

const Layout = () => {
  const { isAuthenticated, setIsAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/login");
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="game-container">
      <div className="flex flex-col min-h-screen">
        <header className="bg-monster-black border-b border-monster-green/50 shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
            <NavLink to="/" className="text-xl sm:text-2xl font-black uppercase tracking-widest monster-glow flex items-center mb-2 sm:mb-0">
              <span className="text-monster-green mr-1">PAINEL</span>
              <span className="text-white">DO PROFESSOR</span>
            </NavLink>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 w-full sm:w-auto">
              {user && (
                <span className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                  PROFESSOR <span className="text-monster-green font-bold break-all">{user.email}</span>
                </span>
              )}
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    toast.success("Logout realizado com sucesso!");
                    navigate("/login");
                  }}
                  className="bg-monster-darkgray border-monster-green text-white hover:bg-monster-gray uppercase font-bold tracking-wider"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex flex-col md:flex-row flex-1">
          <aside className="w-full md:w-64 glass-effect border-r-0 border-t-0 border-b-0 overflow-y-auto">
            <nav className="p-4 space-y-4">
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-14 rounded-none flex items-center justify-center">
                  <img 
                    src="https://poliedro-api.p4ed.com/sso/auth/resources/vv3tb/login/updated-poliedro/dist/static/media/logo-sistema-p+.eb1179607d4dc652db31b1f92b5df4b5.svg"
                    alt="Logo Sistema P+"
                    className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
              <ul className="space-y-1 border-t border-monster-green/30 pt-4">
                <li>
                  <NavLink
                    to="/professor/materias"
                    className={({isActive}) => `block transition-all monster-nav-item ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-3" />
                      <span>Perguntas</span>
                    </div>
                  </NavLink>
                </li>
                {/* Removido o link para Perguntas site que estava bugado */}
                {/* Removidos links para PerguntasWeb e PerguntasWeb2 */}
                <li>
                  <NavLink
                    to="/professor/usuarios"
                    className={({isActive}) => `block transition-all monster-nav-item ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3" />
                      <span>Alunos</span>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/professor/ranking"
                    className={({isActive}) => `block transition-all monster-nav-item ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <Trophy className="w-5 h-5 mr-3" />
                      <span>Ranking</span>
                    </div>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </aside>
          
          <main className="flex-1 p-4">
            <div className="container mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
