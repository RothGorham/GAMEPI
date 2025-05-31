# Backend para Sistema de Perguntas e Respostas (Professores e Alunos)

Este é o backend para o sistema de gestão de perguntas, alunos e ranking, desenvolvido em Node.js com Express e MongoDB.

## Funcionalidades Principais

*   **Autenticação de Professor:** Login seguro para acesso à área restrita.
*   **Gestão de Perguntas:** Adicionar, visualizar, pesquisar e excluir perguntas.
*   **Gestão de Alunos:** Cadastrar, visualizar e excluir alunos.
*   **Ranking:** Visualizar estatísticas de desempenho dos alunos.

## Pré-requisitos

*   Node.js (versão 14.x ou superior recomendada)
*   npm (geralmente vem com o Node.js)
*   MongoDB (uma instância local ou remota acessível)

## Configuração e Instalação

1.  **Clone o repositório (se aplicável) ou copie os arquivos para o seu ambiente.**

2.  **Navegue até a pasta `backend` do projeto:**
    ```bash
    cd caminho/para/o/projeto/backend
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz da pasta `backend` (ou seja, `/home/ubuntu/teste_repo/backend/.env`) com o seguinte conteúdo, ajustando os valores conforme necessário:
    ```env
    MONGO_URI="mongodb://sua_uri_do_mongodb_aqui"
    JWT_SECRET="seu_segredo_jwt_super_secreto"
    PORT=5001
    ```
    *   `MONGO_URI`: A string de conexão para o seu banco de dados MongoDB. Exemplo local: `mongodb://localhost:27017/nome_do_banco`.
    *   `JWT_SECRET`: Uma string secreta longa e aleatória para assinar os tokens JWT.
    *   `PORT`: A porta em que o servidor backend será executado.

5.  **Inicie o Servidor:**
    ```bash
    npm start
    ```
    (Você pode adicionar um script `"start": "node server.js"` ao seu `package.json` se ainda não existir).
    Por defeito, o `server.js` tentará criar um professor inicial com as credenciais `professor@exemplo.com` e senha `senha123` se nenhum professor existir na base de dados. Pode alterar isto no ficheiro `server.js`.

## Estrutura do Projeto

```
backend/
├── config/         # (Opcional, para configurações mais complexas)
├── middleware/
│   └── authMiddleware.js # Middleware de autenticação JWT
├── models/
│   ├── Aluno.js        # Modelo Mongoose para Alunos
│   ├── Pergunta.js     # Modelo Mongoose para Perguntas
│   └── Professor.js    # Modelo Mongoose para Professores
├── routes/
│   ├── alunos.js       # Rotas para CRUD de Alunos
│   ├── auth.js         # Rotas para autenticação (login de professor)
│   ├── perguntas.js    # Rotas para CRUD de Perguntas
│   └── ranking.js      # Rota para o Ranking de Alunos
├── .env              # Arquivo de variáveis de ambiente (NÃO FAZER COMMIT DESTE ARQUIVO COM CREDENCIAIS REAIS)
├── package-lock.json
├── package.json
└── server.js         # Ponto de entrada principal do servidor Express
```

## Endpoints da API (Rotas)

Todas as rotas, exceto `/api/auth/login`, requerem um token JWT no header `x-auth-token`.

*   **Autenticação**
    *   `POST /api/auth/login`: Login do professor. Body: `{ "email": "", "senha": "" }`

*   **Perguntas**
    *   `POST /api/perguntas`: Adicionar nova pergunta. Body: `{ "pergunta": "", "respostaCorreta": "" }`
    *   `GET /api/perguntas`: Listar todas as perguntas. Suporta query param `q` para pesquisa (ex: `/api/perguntas?q=textoDaBusca`).
    *   `DELETE /api/perguntas/:id`: Excluir uma pergunta específica.
    *   `DELETE /api/perguntas`: Excluir todas as perguntas.

*   **Alunos**
    *   `POST /api/alunos`: Adicionar novo aluno. Body: `{ "nomeCompleto": "", "cpf": "", "senha": "" }`
    *   `GET /api/alunos`: Listar todos os alunos.
    *   `DELETE /api/alunos/:id`: Excluir um aluno específico.
    *   `DELETE /api/alunos`: Excluir todos os alunos.

*   **Ranking**
    *   `GET /api/ranking`: Exibir ranking dos alunos (ordenado por acertos).

## Importante: Testes e Validação

O backend foi desenvolvido e estruturado. No entanto, a validação completa das funcionalidades de CRUD (Criar, Ler, Atualizar, Excluir) e autenticação **depende de uma instância MongoDB ativa e corretamente configurada no arquivo `.env`**. Sem o MongoDB, o servidor iniciará, mas as operações que interagem com o banco de dados falharão.

Certifique-se de que o seu serviço MongoDB está a correr e que a `MONGO_URI` no seu ficheiro `.env` está correta antes de realizar testes extensivos.

