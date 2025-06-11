import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Trophy, Medal, Award, Search, User, DollarSign, PlayCircle } from "lucide-react";
import { rankingService } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AlunoEstatistica {
  saldo: number;
  acertos: number;
  erros: number;
  ajudas: number;
  pulos: number;
  universitarios: number;
  totalGanho: number;
  gastoErro: number;
  gastoAjuda: number;
  gastoPulo: number;
  gastoUniversitarios: number;
  createdAt: string;
}

interface AlunoItem {
  _id: string;
  nome: string;
  cpf: string;
  estatisticas: AlunoEstatistica[];
  position?: number;
  score?: number;
  valorPerdido?: number;
}

// Função para formatar valores monetários em Reais
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Função para calcular o valor perdido pelo jogador
const calcularPerda = (estatisticas: AlunoEstatistica): number => {
  const gastos = estatisticas.gastoErro + estatisticas.gastoAjuda + 
                estatisticas.gastoPulo + estatisticas.gastoUniversitarios;
  return gastos;
};

const ITEMS_PER_PAGE = 10;

const Ranking = () => {
  // Buscar dados do ranking do backend
  const { data: rankingData = [], isLoading, isError } = useQuery({
    queryKey: ['ranking'],
    queryFn: rankingService.obterRanking,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAluno, setSelectedAluno] = useState<AlunoItem | null>(null);
  const [activeTab, setActiveTab] = useState("ranking-global");
  const [selectedJogada, setSelectedJogada] = useState<AlunoEstatistica | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Processar e ordenar os dados do ranking
  const processedRanking = rankingData.map((aluno: AlunoItem) => {
    // Pegar as estatísticas mais recentes do aluno (índice 0)
    const estatisticasRecentes = aluno.estatisticas && aluno.estatisticas.length > 0 
      ? aluno.estatisticas[0] 
      : {
          saldo: 0,
          acertos: 0,
          erros: 0,
          ajudas: 0,
          pulos: 0,
          universitarios: 0,
          totalGanho: 0,
          gastoErro: 0,
          gastoAjuda: 0,
          gastoPulo: 0,
          gastoUniversitarios: 0,
          createdAt: new Date().toISOString()
        };
    
    // Calcular valor perdido
    const valorPerdido = calcularPerda(estatisticasRecentes);
    
    // Calcular pontuação: saldo
    const score = estatisticasRecentes.saldo;
    
    return {
      ...aluno,
      estatisticasRecentes: estatisticasRecentes,
      valorPerdido: valorPerdido,
      score: score
    };
  }).sort((a, b) => b.score - a.score);
    
  const filteredRanking = processedRanking
    .filter((item) =>
      item.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((item, index) => ({
      ...item,
      position: index + 1,
    }));

  // Calcular o total de páginas
  const totalPages = Math.ceil(filteredRanking.length / ITEMS_PER_PAGE);

  // Obter os alunos da página atual
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredRanking.slice(startIndex, endIndex);
  };

  // Gerar array de números de página para paginação
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Prepare data for individual student performance chart if student is selected
  const prepareIndividualChartData = (aluno: AlunoItem) => {
    if (!aluno.estatisticas || aluno.estatisticas.length === 0) return [];
    
    // Ordenar do mais recente para o mais antigo
    const sortedEstatisticas = [...aluno.estatisticas].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Pegar as últimas 5 jogadas para mostrar a evolução
    return sortedEstatisticas.slice(0, 5).reverse().map((estatistica, index) => {
      const dataFormatada = new Date(estatistica.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      });
      
      return {
        name: `Jogada ${index + 1} (${dataFormatada})`,
        acertos: estatistica.acertos,
        saldo: estatistica.saldo,
        erros: estatistica.erros,
        ajudas: estatistica.ajudas,
        pulos: estatistica.pulos
      };
    });
  };

  const individualChartData = selectedAluno ? prepareIndividualChartData(selectedAluno) : [];

  const handleSelectAluno = (aluno: AlunoItem) => {
    setSelectedAluno(aluno);
    setSelectedJogada(null); // Resetar jogada selecionada ao trocar de aluno
    setActiveTab("ranking-individual");
    
    // Aguardar o próximo ciclo de renderização antes de rolar para a aba
    setTimeout(() => {
      if (tabsRef.current) {
        tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Seleciona uma jogada específica e atualiza a visualização
  const handleSelectJogada = (jogada: AlunoEstatistica) => {
    setSelectedJogada(jogada);
  };

  // Determina quais estatísticas mostrar (da jogada selecionada ou a mais recente)
  const estatisticasParaMostrar = selectedJogada || 
    (selectedAluno?.estatisticas && selectedAluno.estatisticas.length > 0 
      ? selectedAluno.estatisticas[0] 
      : null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Ranking de Alunos</h1>
      </div>

      <Input
        placeholder="Pesquisar alunos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <div ref={tabsRef}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ranking-global" className="text-sm md:text-base">
              <Trophy className="mr-2 h-4 w-4" /> Ranking Global
            </TabsTrigger>
            <TabsTrigger value="ranking-individual" className="text-sm md:text-base" disabled={!selectedAluno}>
              <User className="mr-2 h-4 w-4" /> 
              {selectedAluno ? `Desempenho de ${selectedAluno.nome}` : "Desempenho Individual"}
            </TabsTrigger>
          </TabsList>

          {/* RANKING GLOBAL TAB */}
          <TabsContent value="ranking-global">
            <Card className="game-card">
              <CardHeader>
                <CardTitle>TOP 5 - Melhores Prêmios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] text-center">Posição</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRanking.slice(0, 5).map((aluno, index) => (
                        <TableRow 
                          key={aluno._id} 
                          className={`cursor-pointer ${selectedAluno?._id === aluno._id ? 'bg-gray-800' : ''}`}
                          onClick={() => handleSelectAluno(aluno)}
                        >
                          <TableCell className="text-center">
                            {index === 0 && <Trophy className="h-5 w-5 text-gold mx-auto" />}
                            {index === 1 && <Medal className="h-5 w-5 text-silver mx-auto" />}
                            {index === 2 && <Award className="h-5 w-5 text-bronze mx-auto" />}
                            {index > 2 && (index + 1)}
                          </TableCell>
                          <TableCell className="font-medium">{aluno.nome}</TableCell>
                          <TableCell className="text-right font-medium text-monster-green">
                            {formatCurrency(aluno.estatisticasRecentes.saldo)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Lista Completa de Alunos */}
            <Card className="game-card mt-6">
              <CardHeader>
                <CardTitle>Lista Completa de Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] text-center">Posição</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentPageItems().map((aluno, index) => (
                        <TableRow 
                          key={aluno._id} 
                          className={`cursor-pointer ${selectedAluno?._id === aluno._id ? 'bg-gray-800' : ''}`}
                          onClick={() => handleSelectAluno(aluno)}
                        >
                          <TableCell className="text-center">
                            {aluno.position === 1 && <Trophy className="h-5 w-5 text-gold mx-auto" />}
                            {aluno.position === 2 && <Medal className="h-5 w-5 text-silver mx-auto" />}
                            {aluno.position === 3 && <Award className="h-5 w-5 text-bronze mx-auto" />}
                            {aluno.position > 3 && aluno.position}
                          </TableCell>
                          <TableCell className="font-medium">{aluno.nome}</TableCell>
                          <TableCell className="text-right font-medium text-monster-green">
                            {formatCurrency(aluno.estatisticasRecentes.saldo)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Paginação */}
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {getPageNumbers().map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RANKING INDIVIDUAL TAB */}
          <TabsContent value="ranking-individual">
            {!selectedAluno ? (
              <Card className="game-card">
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    Selecione um aluno no ranking global para ver seu desempenho individual.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="game-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-white" />
                    Estatísticas de {selectedAluno.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Resumo financeiro rápido */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card className="bg-gray-800 border-0">
                      <CardContent className="p-4">
                        <div className="text-sm text-gray-400">Saldo Atual</div>
                        <div className="text-2xl font-bold text-monster-green">
                          {formatCurrency(estatisticasParaMostrar?.saldo || 0)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-0">
                      <CardContent className="p-4">
                        <div className="text-sm text-gray-400">Total Ganho</div>
                        <div className="text-2xl font-bold text-green-400">
                          {formatCurrency(estatisticasParaMostrar?.totalGanho || 0)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-0">
                      <CardContent className="p-4">
                        <div className="text-sm text-gray-400">Total Perdido</div>
                        <div className="text-2xl font-bold text-red-400">
                          {formatCurrency(calcularPerda(estatisticasParaMostrar || { saldo: 0, acertos: 0, erros: 0, ajudas: 0, pulos: 0, universitarios: 0, totalGanho: 0, gastoErro: 0, gastoAjuda: 0, gastoPulo: 0, gastoUniversitarios: 0, createdAt: "" }))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tabs para separar estatísticas de jogo e financeiras */}
                  <Tabs defaultValue="estatisticas-jogo" className="w-full mt-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="estatisticas-jogo" className="text-sm md:text-base">
                        <PlayCircle className="mr-2 h-4 w-4" /> Estatísticas do Jogo
                      </TabsTrigger>
                      <TabsTrigger value="estatisticas-financeiras" className="text-sm md:text-base">
                        <DollarSign className="mr-2 h-4 w-4" /> Dados Financeiros
                      </TabsTrigger>
                    </TabsList>

                    {/* Aba de Estatísticas do Jogo */}
                    <TabsContent value="estatisticas-jogo">
                      <Card className="game-card">
                        <CardHeader>
                          <CardTitle>Desempenho do Jogador</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <Card className="bg-gray-800 border-0">
                              <CardHeader className="p-4 pb-0">
                                <CardTitle className="text-lg">Acertos</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-2">
                                <div className="text-3xl font-bold text-green-500">
                                  {estatisticasParaMostrar?.acertos || 0}
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-0">
                              <CardHeader className="p-4 pb-0">
                                <CardTitle className="text-lg">Erros</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-2">
                                <div className="text-3xl font-bold text-red-500">
                                  {estatisticasParaMostrar?.erros || 0}
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-0">
                              <CardHeader className="p-4 pb-0">
                                <CardTitle className="text-lg">Ajudas</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-2">
                                <div className="text-3xl font-bold text-yellow-500">
                                  {estatisticasParaMostrar?.ajudas || 0}
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-0">
                              <CardHeader className="p-4 pb-0">
                                <CardTitle className="text-lg">Pulos</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-2">
                                <div className="text-3xl font-bold text-blue-500">
                                  {estatisticasParaMostrar?.pulos || 0}
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-0">
                              <CardHeader className="p-4 pb-0">
                                <CardTitle className="text-lg">Universitários</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-2">
                                <div className="text-3xl font-bold text-purple-500">
                                  {estatisticasParaMostrar?.universitarios || 0}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="game-card mt-6">
                        <CardHeader>
                          <CardTitle>Posição no Ranking</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                          <div className="text-9xl font-black text-center text-monster-green">
                            {selectedAluno.position}
                          </div>
                          <div className="text-lg mt-2">
                            {selectedAluno.position === 1 && (
                              <div className="flex items-center justify-center">
                                <Trophy className="h-8 w-8 text-gold mr-2" />
                                <span className="text-gold">Primeiro Lugar</span>
                              </div>
                            )}
                            {selectedAluno.position === 2 && (
                              <div className="flex items-center justify-center">
                                <Medal className="h-8 w-8 text-silver mr-2" />
                                <span className="text-silver">Segundo Lugar</span>
                              </div>
                            )}
                            {selectedAluno.position === 3 && (
                              <div className="flex items-center justify-center">
                                <Award className="h-8 w-8 text-bronze mr-2" />
                                <span className="text-bronze">Terceiro Lugar</span>
                              </div>
                            )}
                            {selectedAluno.position > 3 && (
                              <span className="text-muted-foreground">
                                de {filteredRanking.length} alunos
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="game-card mt-6">
                        <CardHeader>
                          <CardTitle>Evolução do Desempenho</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                          {individualChartData.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-muted-foreground">
                                Não há dados de desempenho disponíveis para este aluno.
                              </p>
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={individualChartData}
                                margin={{
                                  top: 5,
                                  right: 30,
                                  left: 20,
                                  bottom: 30,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                  dataKey="name" 
                                  tick={{ fontSize: 10 }}
                                  height={60}
                                  angle={-45}
                                  textAnchor="end"
                                />
                                <YAxis />
                                <Tooltip formatter={(value, name) => {
                                  if (name === "saldo") return [formatCurrency(Number(value)), name];
                                  return [value, name];
                                }} />
                                <Legend />
                                <Bar dataKey="acertos" fill="#84bd00" name="Acertos" />
                                <Bar dataKey="erros" fill="#dc2626" name="Erros" />
                                <Bar dataKey="saldo" fill="#3b82f6" name="Saldo" />
                              </BarChart>
                            </ResponsiveContainer>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Aba de Dados Financeiros */}
                    <TabsContent value="estatisticas-financeiras">
                      <Card className="game-card">
                        <CardHeader>
                          <CardTitle>Detalhamento de Gastos</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="bg-gray-800 border-0">
                              <CardHeader className="p-4 pb-0">
                                <CardTitle className="text-md">Gasto com Erros</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-2">
                                <div className="text-xl font-bold text-red-400">
                                  {formatCurrency(estatisticasParaMostrar?.gastoErro || 0)}
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-0">
                              <CardHeader className="p-4 pb-0">
                                <CardTitle className="text-md">Gasto com Ajudas</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-2">
                                <div className="text-xl font-bold text-yellow-400">
                                  {formatCurrency(estatisticasParaMostrar?.gastoAjuda || 0)}
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-0">
                              <CardHeader className="p-4 pb-0">
                                <CardTitle className="text-md">Gasto com Pulos</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-2">
                                <div className="text-xl font-bold text-blue-400">
                                  {formatCurrency(estatisticasParaMostrar?.gastoPulo || 0)}
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-0">
                              <CardHeader className="p-4 pb-0">
                                <CardTitle className="text-md">Gasto com Universitários</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-2">
                                <div className="text-xl font-bold text-purple-400">
                                  {formatCurrency(estatisticasParaMostrar?.gastoUniversitarios || 0)}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="game-card mt-6">
                        <CardHeader>
                          <CardTitle>Histórico Completo de Jogadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {!selectedAluno.estatisticas || selectedAluno.estatisticas.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                              Nenhum histórico de jogadas disponível.
                            </div>
                          ) : (
                            <>
                              <div className="mb-4 p-3 bg-gray-800 rounded-md border-l-4 border-monster-green">
                                <div className="flex items-center">
                                  <PlayCircle className="h-5 w-5 mr-2 text-monster-green" />
                                  <span className="text-white font-medium">Selecione uma partida para ver o desempenho específico do aluno!</span>
                                </div>
                              </div>
                              <div className="rounded-md border overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Data</TableHead>
                                      <TableHead>Acertos</TableHead>
                                      <TableHead>Erros</TableHead>
                                      <TableHead>Ajudas</TableHead>
                                      <TableHead>Pulos</TableHead>
                                      <TableHead>Universitários</TableHead>
                                      <TableHead>Saldo</TableHead>
                                      <TableHead>Total Ganho</TableHead>
                                      <TableHead>Total Gasto</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {[...selectedAluno.estatisticas]
                                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                      .map((estat, index) => {
                                        const totalGasto = estat.gastoErro + estat.gastoAjuda + 
                                                        estat.gastoPulo + estat.gastoUniversitarios;
                                        return (
                                          <TableRow 
                                            key={index}
                                            className={`cursor-pointer ${selectedJogada === estat ? 'bg-gray-800' : ''}`}
                                            onClick={() => handleSelectJogada(estat)}
                                          >
                                            <TableCell>
                                              {new Date(estat.createdAt).toLocaleDateString()} 
                                              {" "} 
                                              {new Date(estat.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </TableCell>
                                            <TableCell className="font-medium text-green-500">{estat.acertos}</TableCell>
                                            <TableCell className="font-medium text-red-500">{estat.erros}</TableCell>
                                            <TableCell className="font-medium text-yellow-500">{estat.ajudas}</TableCell>
                                            <TableCell className="font-medium text-blue-500">{estat.pulos}</TableCell>
                                            <TableCell className="font-medium text-purple-500">{estat.universitarios}</TableCell>
                                            <TableCell className="font-medium text-blue-500">{formatCurrency(estat.saldo)}</TableCell>
                                            <TableCell className="font-medium text-green-400">{formatCurrency(estat.totalGanho)}</TableCell>
                                            <TableCell className="font-medium text-red-400">{formatCurrency(totalGasto)}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                  </TableBody>
                                </Table>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Componente para o botão de visualizar detalhes
const Button = ({ 
  children, 
  className = "", 
  variant = "default", 
  size = "default", 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50";
  
  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
  };
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };
  
  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Ranking;