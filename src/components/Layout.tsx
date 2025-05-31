import { useState, useContext } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trophy, Users, BookOpen, Menu, X, LogOut } from "lucide-react";
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
          <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between">
            <NavLink to="/" className="text-2xl font-black uppercase tracking-widest monster-glow flex items-center mb-4 sm:mb-0">
              <span className="text-monster-green mr-1">PAINEL</span>
              <span className="text-white">DO PROFESSOR</span>
            </NavLink>
            
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-muted-foreground hidden md:inline-block">
                  PROFESSOR <span className="text-monster-green font-bold">{user.email}</span>
                </span>
              )}
              <div className="flex gap-2">
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
          <aside className="w-full md:w-64 glass-effect border-r-0 border-t-0 border-b-0">
            <nav className="p-4">
              <div className="mb-6 flex justify-center">
                <div className="w-14 h-14 rounded-none bg-monster-green flex items-center justify-center shadow-lg animate-pulse-green">
                  <Trophy className="w-8 h-8 text-white" />
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
