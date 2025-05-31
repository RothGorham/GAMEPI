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
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { alunosService } from "@/lib/api";

interface Student {
  _id: string;
  nome: string;
  cpf: string;
  senha: string;
}

const Usuarios = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ nome: "", cpf: "", senha: "" });
  
  // Carregar alunos do MongoDB Atlas ao iniciar
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        setLoading(true);
        const data = await alunosService.obterAlunos();
        console.log("Alunos carregados:", data);
        setStudents(data);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
        toast.error("Falha ao carregar alunos do servidor");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlunos();
  }, []);

  const formatCPF = (cpf: string) => {
    const numericCPF = cpf.replace(/\D/g, "");
    if (numericCPF.length <= 3) return numericCPF;
    if (numericCPF.length <= 6) return `${numericCPF.slice(0, 3)}.${numericCPF.slice(3)}`;
    if (numericCPF.length <= 9) return `${numericCPF.slice(0, 3)}.${numericCPF.slice(3, 6)}.${numericCPF.slice(6)}`;
    return `${numericCPF.slice(0, 3)}.${numericCPF.slice(3, 6)}.${numericCPF.slice(6, 9)}-${numericCPF.slice(9, 11)}`;
  };

  const handleAddStudent = async () => {
    if (
      newStudent.nome.trim() === "" ||
      newStudent.cpf.trim() === "" ||
      newStudent.senha.trim() === ""
    ) {
      toast.error("Preencha todos os campos!");
      return;
    }

    const formattedCPF = formatCPF(newStudent.cpf);
    if (formattedCPF.length < 14) {
      toast.error("CPF inválido!");
      return;
    }

    const exists = students.some(s => s.cpf === formattedCPF);
    if (exists) {
      toast.error("Já existe um aluno com este CPF!");
      return;
    }

    try {
      const aluno = {
        nome: newStudent.nome.trim(),
        cpf: formattedCPF,
        senha: newStudent.senha.trim()
      };

      console.log("Enviando aluno para o servidor:", aluno);
      const novoAluno = await alunosService.adicionarAluno(aluno);
      setStudents([...students, novoAluno]);
      setNewStudent({ nome: "", cpf: "", senha: "" });
      setIsDialogOpen(false);
      toast.success("Aluno adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar aluno:", error);
      toast.error("Erro ao adicionar aluno");
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await alunosService.excluirAluno(id);
      setStudents(students.filter((s) => s._id !== id));
      toast.success("Aluno removido com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      toast.error("Erro ao excluir aluno");
    }
  };

  const handleDeleteAllStudents = async () => {
    try {
      // Excluir todos os alunos um por um
      await Promise.all(students.map(s => alunosService.excluirAluno(s._id)));
      setStudents([]);
      setIsDeleteDialogOpen(false);
      toast.success("Todos os alunos foram removidos!");
    } catch (error) {
      console.error("Erro ao excluir todos os alunos:", error);
      toast.error("Erro ao excluir alunos");
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setNewStudent({ ...newStudent, cpf: formatted });
  };

  const filteredStudents = students.filter(
    (s) =>
      s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cpf.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gerenciar Alunos</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Pesquisar alunos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="game-button-primary"
        >
          Adicionar Aluno
        </Button>
        <Button
          onClick={() => setIsDeleteDialogOpen(true)}
          variant="destructive"
          disabled={students.length === 0}
        >
          Excluir Todos
        </Button>
      </div>

      <Card className="game-card">
        <CardHeader>
          <CardTitle>Alunos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white">
              Carregando alunos...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {students.length === 0
                ? "Nenhum aluno cadastrado."
                : "Nenhum aluno encontrado para a sua busca."}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Nome</TableHead>
                    <TableHead className="w-[25%]">CPF</TableHead>
                    <TableHead className="w-[15%]">Senha</TableHead>
                    <TableHead className="w-[10%]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell className="font-medium">{s.nome}</TableCell>
                      <TableCell>{s.cpf}</TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">••••••••</span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteStudent(s._id)}
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
            <DialogTitle>Adicionar Novo Aluno</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para cadastrar um novo aluno.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="Digite o nome completo..."
                value={newStudent.nome}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, nome: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                placeholder="Digite o CPF..."
                value={newStudent.cpf}
                onChange={handleCPFChange}
                maxLength={14}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="Digite a senha..."
                value={newStudent.senha}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, senha: e.target.value })
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
            <Button onClick={handleAddStudent} className="game-button-primary">
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
              Tem certeza que deseja excluir todos os alunos? Esta ação não pode ser desfeita.
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
              onClick={handleDeleteAllStudents}
            >
              Excluir Todos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Usuarios;
