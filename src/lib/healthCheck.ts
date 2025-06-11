import { toast } from "sonner";

// Obter a URL base da API
const API_BASE_URL = import.meta.env.VITE_API_URL?.split('/api')[0] || 'http://localhost:5001';

// Função para verificar a saúde do servidor
export const verificarSaudeServidor = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Adicionar timeout para não esperar indefinidamente
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      toast.error("O servidor backend não está respondendo corretamente.");
      return false;
    }
    
    const data = await response.json();
    if (data.mongodb !== 'conectado') {
      toast.error("Problema de conexão com o banco de dados.");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar saúde do servidor:', error);
    toast.error("Não foi possível conectar ao servidor backend. Verifique se o servidor está em execução.");
    return false;
  }
};

// Função para verificar periodicamente a saúde do servidor
export const iniciarVerificacaoSaude = (intervaloMs = 30000): () => void => {
  const intervalId = setInterval(async () => {
    await verificarSaudeServidor();
  }, intervaloMs);
  
  // Retorna uma função para parar a verificação
  return () => clearInterval(intervalId);
};