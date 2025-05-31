require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Configuração CORS mais permissiva para desenvolvimento
app.use(cors({
  origin: '*', // Permite todas as origens em ambiente de desenvolvimento
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'x-auth-token']
}));

app.use(express.json());

// URI do MongoDB Atlas com a estrutura correta - usando banco GAME inicialmente para outras coleções
const ATLAS_URI = "mongodb+srv://24950092:W7e3HGBYuh1X5jps@game.c3vnt2d.mongodb.net/GAME?retryWrites=true&w=majority&appName=GAME";
console.log("Tentando conectar ao MongoDB Atlas...");

mongoose.connect(ATLAS_URI)
.then(() => {
    console.log("MongoDB Atlas Conectado com Sucesso.");
})
.catch(err => {
    console.error("Erro ao conectar ao MongoDB Atlas:", err.message);
});

// Melhorar tratamento de erros de conexão
mongoose.connection.on('error', (err) => {
    console.error(`Erro de conexão MongoDB: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.warn("MongoDB desconectado!");
});

mongoose.connection.on('reconnected', () => {
    console.log("MongoDB reconectado!");
});

// Definir Rotas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/perguntas", require("./routes/perguntas"));
app.use("/api/alunos", require("./routes/alunos"));
app.use("/api/ranking", require("./routes/ranking"));

// Rota de health check básica
app.get("/health", (req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado';
    res.status(200).json({ 
        status: "UP", 
        timestamp: new Date(),
        mongodb: mongoStatus 
    });
});

// Rota de teste para verificar se o servidor está respondendo
app.get("/", (req, res) => {
    res.json({ message: "Servidor backend funcionando!" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Servidor backend a correr na porta ${PORT}`));

// Aguardar conexão estabilizar antes de verificar o banco de dados
mongoose.connection.once('open', async () => {
    console.log("Conexão com MongoDB estabelecida.");
    
    try {
        // Listar bancos de dados disponíveis
        const adminDb = mongoose.connection.db.admin();
        const dbInfo = await adminDb.listDatabases();
        console.log("Bancos de dados disponíveis:");
        dbInfo.databases.forEach(db => {
            console.log(`- ${db.name}`);
        });
        
        // Testar conexão com o banco de dados PROFESSORES
        const professoresDB = mongoose.connection.useDb('PROFESSORES');
        console.log("Conectado ao banco de dados PROFESSORES");
        
        // Método alternativo para listar coleções
        professoresDB.db.listCollections().toArray((err, collections) => {
            if (err) {
                console.error("Erro ao listar coleções de PROFESSORES:", err);
                return;
            }
            
            console.log("Coleções em PROFESSORES:");
            collections.forEach(coll => {
                console.log(`- ${coll.name}`);
            });
            
            // Verificar se a coleção usuarios existe
            const usuariosCollection = collections.find(c => c.name === 'usuarios');
            if (usuariosCollection) {
                console.log("✓ Coleção 'usuarios' encontrada no banco PROFESSORES");
            } else {
                console.warn("⚠ Coleção 'usuarios' NÃO encontrada no banco PROFESSORES");
            }
        });
    } catch (error) {
        console.error("Erro ao listar bancos/coleções:", error);
    }
});
