
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Users, Award, Download, GamepadIcon } from "lucide-react";

const PaginaIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="game-container bg-black relative overflow-hidden">
      <div className="min-h-screen flex flex-col">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'url("/grid-pattern.svg")', backgroundSize: '100px 100px' }}></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-black/80"></div>
        <header className="container mx-auto py-4 px-4 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mr-3"
              >
                <img 
                  src="https://poliedro-api.p4ed.com/sso/auth/resources/vv3tb/login/updated-poliedro/dist/static/media/logo-sistema-p+.eb1179607d4dc652db31b1f92b5df4b5.svg" 
                  alt="Logo Poliedro" 
                  className="w-8 h-8" 
                />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl font-bold tracking-wider"
              >
                <span className="text-monster-green">GAME</span> <span className="text-white">POLIEDRO</span>
                <div className="text-xs sm:text-sm text-muted-foreground tracking-wider">BASEADO NO SHOW DO MILHÃO</div>
              </motion.h1>
            </div>
            <Button 
              onClick={() => navigate("/login")}
              className="bg-monster-green hover:bg-monster-green/90 text-white font-bold py-2 px-4 rounded transition-all duration-300 shadow-lg hover:shadow-monster-green/30"
            >
              <span className="tracking-wider text-xs sm:text-sm">ÁREA DO PROFESSOR</span>
              <img 
                src="https://poliedro-api.p4ed.com/sso/auth/resources/vv3tb/login/updated-poliedro/dist/static/media/logo-sistema-p+.eb1179607d4dc652db31b1f92b5df4b5.svg" 
                alt="Logo Poliedro" 
                className="ml-2 w-4 h-4" 
              />
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center justify-center px-4 py-8 md:py-12 relative z-10 container mx-auto gap-8 md:gap-0">
            <div className="w-full md:w-1/2 text-center md:text-left mb-6 md:mb-0 md:pr-8">
              <motion.h2 
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-shadow tracking-wider"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-monster-green monster-glow">APRENDA</span> A<br />
                <span className="text-white">MATÉRIA DAS<br />AULAS DE FORMA<br />OBJETIVA!</span>
              </motion.h2>
              <motion.p 
                className="text-lg mb-6 text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Criamos duas versões para você jogar como preferir: uma versão web com perguntas e respostas objetivas, e uma versão principal no Roblox com modo multiplayer estilo mata-mata para até 6 jogadores, com 2 poções especiais por partida.
              </motion.p>
              <motion.p 
                className="text-md mb-8 text-monster-green font-semibold leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                O grande destaque é o modo multiplayer, onde o jogo adota o Modo Adversário: uma disputa intensa em estilo PvP, na qual os participantes precisam unir conhecimento e estratégia para conquistar a vitória.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start w-full sm:w-auto">
                  <Button className="game-button-primary rounded transition-all duration-300 shadow-lg hover:shadow-monster-green/30 hover:scale-105 text-sm tracking-wider" onClick={() => window.open("#")}>
                    <span>BAIXAR VERSÃO WEB</span>
                    <Download className="ml-2 w-4 h-4 group-hover:scale-125 transition-transform" />
                  </Button>
                  <Button className="bg-transparent border border-monster-green text-white font-bold py-3 px-6 rounded transition-all duration-300 shadow-lg hover:shadow-monster-green/20 hover:scale-105 text-sm tracking-wider group" onClick={() => window.open("#")}>
                    <span>JOGAR NO ROBLOX</span>
                    <GamepadIcon className="ml-2 w-4 h-4 group-hover:scale-125 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative w-full max-w-[320px] h-[320px] sm:w-[384px] sm:h-[384px] bg-monster-darkgray/30 rounded-lg border border-monster-green/30 flex items-center justify-center overflow-hidden mx-auto shadow-xl hover:shadow-monster-green/20 transition-all duration-500">
                <div className="absolute inset-0 bg-monster-green/5 rounded-lg blur-xl"></div>
                <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'url("/grid-pattern.svg")', backgroundSize: '50px 50px' }}></div>
                <div className="relative z-10 text-center p-6">
                  <img 
                    src="https://poliedro-api.p4ed.com/sso/auth/resources/vv3tb/login/updated-poliedro/dist/static/media/logo-sistema-p+.eb1179607d4dc652db31b1f92b5df4b5.svg" 
                    alt="Logo Poliedro" 
                    className="w-48 h-48 mx-auto animate-pulse" 
                  />
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Resources Section */}
          <div className="py-16 px-4 relative z-10 container mx-auto text-center">
            <motion.h3 
              className="text-3xl font-bold text-center mb-12 tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white">RECURSOS DO</span> <span className="text-monster-green monster-glow">GAME POLIEDRO</span>
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Card 1 */}
              <motion.div 
                className="glass-effect p-8 rounded-lg flex flex-col items-center text-center transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-monster-green/20 hover:scale-105 border-l-4 border-l-monster-green"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-monster-green/20 p-3 rounded-full mb-4 glow">
                  <BookOpen className="w-8 h-8 text-monster-green" />
                </div>
                <h4 className="text-xl font-bold text-monster-green mb-3 tracking-wider">CONTEÚDO EDUCACIONAL</h4>
                <p className="text-muted-foreground text-sm">Perguntas baseadas no currículo escolar, criadas por professores especialistas.</p>
              </motion.div>
              
              {/* Card 2 */}
              <motion.div 
                className="glass-effect p-8 rounded-lg flex flex-col items-center text-center transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-monster-green/20 hover:scale-105 border-l-4 border-l-monster-green"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-monster-green/20 p-3 rounded-full mb-4 glow">
                  <Users className="w-8 h-8 text-monster-green" />
                </div>
                <h4 className="text-xl font-bold text-monster-green mb-3 tracking-wider">MODO MULTIPLAYER</h4>
                <p className="text-muted-foreground text-sm">Desafie seus amigos em partidas emocionantes com até 6 jogadores simultâneos.</p>
              </motion.div>
              
              {/* Card 3 */}
              <motion.div 
                className="glass-effect p-8 rounded-lg flex flex-col items-center text-center transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-monster-green/20 hover:scale-105 border-l-4 border-l-monster-green"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-monster-green/20 p-3 rounded-full mb-4 glow">
                  <Award className="w-8 h-8 text-monster-green" />
                </div>
                <h4 className="text-xl font-bold text-monster-green mb-3 tracking-wider">RANKING COMPETITIVO</h4>
                <p className="text-muted-foreground text-sm">Acompanhe seu progresso e compare seu desempenho com outros jogadores.</p>
                <div className="mt-3 pt-2 border-t border-monster-green/20">
                  <p className="text-muted-foreground/80 text-xs italic">Para acessar o ranking, converse diretamente com seu professor em sala. As informações estarão disponíveis apenas com ele.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaginaIntro;
