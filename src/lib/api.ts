// Arquivo para gerenciar as requisições HTTP ao backend

// Obter a URL da API do ambiente ou usar o padrão localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Função para obter o token JWT do localStorage
const getToken = () => localStorage.getItem('token');

// Função para definir headers de autenticação
const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'x-auth-token': token || ''
  };
};

// Serviço de autenticação
export const authService = {
  // Login do professor
  login: async (email: string, senha: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Erro ao fazer login');
      }
      
      const data = await response.json();
      // Salvar o token no localStorage
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },
  
  // Verificar se o usuário está autenticado
  verificarToken: async () => {
    const token = getToken();
    if (!token) return false;
    
    try {
      // Verificar o token fazendo uma requisição para uma rota protegida
      const response = await fetch(`${API_URL}/perguntas`, {
        method: 'GET',
        headers: authHeaders()
      });
      
      // Se o token é válido, a requisição será bem-sucedida
      return response.ok;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
  }
};

// Serviço de alunos
export const alunosService = {
  // Obter todos os alunos
  obterAlunos: async () => {
    try {
      const response = await fetch(`${API_URL}/alunos`, {
        method: 'GET',
        headers: authHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Erro ao obter alunos');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter alunos:', error);
      throw error;
    }
  },
  
  // Adicionar um novo aluno
  adicionarAluno: async (aluno: { nome: string, cpf: string, senha: string }) => {
    try {
      const response = await fetch(`${API_URL}/alunos`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(aluno)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Erro ao adicionar aluno');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
      throw error;
    }
  },
  
  // Excluir um aluno
  excluirAluno: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/alunos/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Erro ao excluir aluno');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
      throw error;
    }
  }
};

// Serviço de perguntas
export const perguntasService = {
  // Obter todas as perguntas
  obterPerguntas: async (textoBusca?: string) => {
    try {
      let url = `${API_URL}/perguntas`;
      if (textoBusca) {
        url += `?q=${encodeURIComponent(textoBusca)}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: authHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Erro ao obter perguntas');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter perguntas:', error);
      throw error;
    }
  },
  
  // Adicionar uma nova pergunta
  adicionarPergunta: async (pergunta: { pergunta: string, correta: string }) => {
    try {
      const response = await fetch(`${API_URL}/perguntas`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(pergunta)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Erro ao adicionar pergunta');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao adicionar pergunta:', error);
      throw error;
    }
  },
  
  // Excluir uma pergunta
  excluirPergunta: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/perguntas/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Erro ao excluir pergunta');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao excluir pergunta:', error);
      throw error;
    }
  }
};

// Serviço de ranking
export const rankingService = {
  // Obter o ranking
  obterRanking: async () => {
    try {
      const response = await fetch(`${API_URL}/ranking`, {
        method: 'GET',
        headers: authHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Erro ao obter ranking');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter ranking:', error);
      throw error;
    }
  }
};