import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { perguntasService } from "@/lib/api";

interface Question {
  _id: string;
  pergunta: string;
  correta: string;
}

const Materias = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ pergunta: "", correta: "" });
  
  // Carregar perguntas do backend
  useEffect(() => {
    const fetchPerguntas = async () => {
      try {
        setLoading(true);
        const data = await perguntasService.obterPerguntas();
        console.log("Perguntas carregadas:", data);
        setQuestions(data);
      } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        toast.error("Falha ao carregar perguntas do servidor");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPerguntas();
  }, []);

  const handleAddQuestion = async () => {
    if (newQuestion.pergunta.trim() === "" || newQuestion.correta.trim() === "") {
      toast.error("Preencha todos os campos!");
      return;
    }

    try {
      const pergunta = {
        pergunta: newQuestion.pergunta.trim(),
        correta: newQuestion.correta.trim(),
      };

      console.log("Enviando pergunta para o servidor:", pergunta);
      const novaPergunta = await perguntasService.adicionarPergunta(pergunta);
      setQuestions([...questions, novaPergunta]);
      setNewQuestion({ pergunta: "", correta: "" });
      setIsDialogOpen(false);
      toast.success("Pergunta adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar pergunta:", error);
      toast.error("Erro ao adicionar pergunta");
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await perguntasService.excluirPergunta(id);
      setQuestions(questions.filter((q) => q._id !== id));
      toast.success("Pergunta removida com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir pergunta:", error);
      toast.error("Erro ao excluir pergunta");
    }
  };

  const handleDeleteAllQuestions = async () => {
    try {
      // Excluir todas as perguntas uma por uma
      await Promise.all(questions.map(q => perguntasService.excluirPergunta(q._id)));
      setQuestions([]);
      setIsDeleteDialogOpen(false);
      toast.success("Todas as perguntas foram removidas!");
    } catch (error) {
      console.error("Erro ao excluir todas as perguntas:", error);
      toast.error("Erro ao excluir perguntas");
    }
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.correta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gerenciar Perguntas</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Pesquisar pergunta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="game-button-primary"
        >
          Adicionar Pergunta
        </Button>
        <Button
          onClick={() => setIsDeleteDialogOpen(true)}
          variant="destructive"
          disabled={questions.length === 0}
        >
          Excluir Todas
        </Button>
      </div>

      <Card className="game-card">
        <CardHeader>
          <CardTitle>Perguntas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white">
              Carregando perguntas...
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {questions.length === 0
                ? "Nenhuma pergunta cadastrada."
                : "Nenhuma pergunta encontrada para a sua busca."}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">Pergunta</TableHead>
                    <TableHead className="w-[30%]">Resposta</TableHead>
                    <TableHead className="w-[10%]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((q) => (
                    <TableRow key={q._id}>
                      <TableCell className="font-medium">{q.pergunta}</TableCell>
                      <TableCell>{q.correta}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteQuestion(q._id)}
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Pergunta</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar uma nova pergunta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pergunta">Pergunta</Label>
              <Textarea
                id="pergunta"
                placeholder="Digite a pergunta..."
                value={newQuestion.pergunta}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, pergunta: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correta">Resposta Correta</Label>
              <Input
                id="correta"
                placeholder="Digite a resposta correta..."
                value={newQuestion.correta}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, correta: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddQuestion} className="game-button-primary">
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir todas as perguntas? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAllQuestions}
            >
              Excluir Todas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Materias;
