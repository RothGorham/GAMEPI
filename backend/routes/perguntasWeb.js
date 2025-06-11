const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const perguntaWebSchema = require("../models/PerguntaWeb");
const perguntaSchema = require("../models/Pergunta");

// Conexão específica ao banco PERGUNTAS
const perguntasDB = mongoose.connection.useDb('PERGUNTAS');
// Alterando o nome da coleção para 'gameweb' conforme mostrado no MongoDB Atlas
const PerguntaWeb = perguntasDB.model('PerguntaWeb', perguntaWebSchema, 'gameweb');
// Modelo para perguntas normais (para copiar funcionalidade)
const Pergunta = perguntasDB.model('Pergunta', perguntaSchema, 'GAME');

// Rota para verificar a conexão com a coleção gameweb
router.get("/check-connection", async (req, res) => {
    try {
        // Verificar se a coleção existe
        const collections = await perguntasDB.db.listCollections({name: 'gameweb'}).toArray();
        if (collections.length === 0) {
            return res.status(404).json({ msg: "A coleção 'gameweb' não foi encontrada no banco PERGUNTAS." });
        }
        
        // Tentar contar documentos na coleção
        const count = await PerguntaWeb.countDocuments();
        
        res.json({ 
            msg: "Conexão com a coleção 'gameweb' estabelecida com sucesso.", 
            count: count,
            collectionName: 'gameweb',
            database: 'PERGUNTAS'
        });
    } catch (err) {
        console.error("Erro ao verificar conexão com a coleção gameweb:", err.message);
        res.status(500).json({ msg: "Erro ao verificar conexão com a coleção gameweb.", error: err.message });
    }
});

// @route   POST api/perguntasweb
// @desc    Adicionar uma nova pergunta para o modo web
// @access  Privado (Professor)
router.post("/", authMiddleware, async (req, res) => {
    const { pergunta, correta, nivel } = req.body;

    if (!pergunta || !correta || !nivel) {
        return res.status(400).json({ msg: "Por favor, forneça a pergunta, a resposta correta e o nível de dificuldade." });
    }

    // Validar o nível
    if (!['facil', 'medio', 'dificil'].includes(nivel)) {
        return res.status(400).json({ msg: "Nível de dificuldade inválido. Use 'facil', 'medio' ou 'dificil'." });
    }

    try {
        console.log("Tentando salvar pergunta web:", { pergunta, correta, nivel });
        
        // Salvar na coleção gameweb (PerguntaWeb)
        const novaPerguntaWeb = new PerguntaWeb({
            pergunta,
            correta,
            nivel
        });
        const perguntaWebSalva = await novaPerguntaWeb.save();
        
        // Também salvar na coleção GAME (Pergunta) - mesma funcionalidade que perguntas.js
        const novaPergunta = new Pergunta({
            pergunta,
            correta,
            nivel,
            modo: 'web' // Definir como modo web
        });
        await novaPergunta.save();
        
        console.log("Pergunta web salva com sucesso em ambas coleções:", perguntaWebSalva);
        res.json(perguntaWebSalva);
    } catch (err) {
        console.error("Erro ao salvar pergunta web:", err.message);
        res.status(500).json({ msg: "Erro no servidor ao adicionar pergunta web.", error: err.message });
    }
});

// @route   GET api/perguntasweb
// @desc    Visualizar todas as perguntas web ou filtrar por nível e/ou pesquisa
// @access  Privado (Professor)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const { q, nivel, aceita } = req.query; // q é o parâmetro de busca, nivel é o filtro de nível, aceita é o filtro de aceitação
        let query = {};
        
        // Adicionar filtro de busca por texto se fornecido
        if (q) {
            query.pergunta = { $regex: q, $options: "i" }; // Busca case-insensitive
        }
        
        // Adicionar filtro de nível se fornecido
        if (nivel && ['facil', 'medio', 'dificil'].includes(nivel)) {
            query.nivel = nivel;
        }
        
        // Adicionar filtro de aceitação se fornecido
        if (aceita !== undefined) {
            query.aceita = aceita === 'true';
        }
        
        console.log("Buscando perguntas web com query:", query);
        const perguntas = await PerguntaWeb.find(query).sort({ dataCriacao: -1 });
        console.log(`Encontradas ${perguntas.length} perguntas web`);
        
        res.json(perguntas);
    } catch (err) {
        console.error("Erro ao buscar perguntas web:", err.message);
        res.status(500).json({ msg: "Erro no servidor ao buscar perguntas web.", error: err.message });
    }
});

// @route   DELETE api/perguntasweb/:id
// @desc    Excluir uma pergunta web individualmente
// @access  Privado (Professor)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        console.log("Buscando pergunta web para exclusão, ID:", req.params.id);
        
        const pergunta = await PerguntaWeb.findById(req.params.id);

        if (!pergunta) {
            return res.status(404).json({ msg: "Pergunta web não encontrada." });
        }

        // Excluir da coleção gameweb
        await PerguntaWeb.findByIdAndDelete(req.params.id);
        
        // Também excluir da coleção GAME se existir uma pergunta com o mesmo texto
        // Isso garante que a pergunta seja removida de ambas as coleções
        await Pergunta.deleteOne({ pergunta: pergunta.pergunta, modo: 'web' });
        
        console.log("Pergunta web excluída com sucesso de ambas coleções:", req.params.id);
        
        res.json({ msg: "Pergunta web removida com sucesso." });
    } catch (err) {
        console.error("Erro ao excluir pergunta web:", err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Pergunta web não encontrada (ID inválido)." });
        }
        res.status(500).json({ msg: "Erro no servidor ao excluir pergunta web.", error: err.message });
    }
});

// @route   DELETE api/perguntasweb
// @desc    Excluir todas as perguntas web
// @access  Privado (Professor)
router.delete("/", authMiddleware, async (req, res) => {
    try {
        console.log("Excluindo todas as perguntas web");
        
        // Excluir todas as perguntas da coleção gameweb
        await PerguntaWeb.deleteMany({});
        
        // Também excluir todas as perguntas com modo 'web' da coleção GAME
        await Pergunta.deleteMany({ modo: 'web' });
        
        console.log("Todas as perguntas web foram excluídas com sucesso de ambas coleções");
        res.json({ msg: "Todas as perguntas web foram removidas com sucesso." });
    } catch (err) {
        console.error("Erro ao excluir todas as perguntas web:", err.message);
        res.status(500).json({ msg: "Erro no servidor ao excluir todas as perguntas web.", error: err.message });
    }
});

// @route   PUT api/perguntasweb/aceitar/:id
// @desc    Aceitar uma pergunta web específica
// @access  Privado (Professor)
router.put("/aceitar/:id", authMiddleware, async (req, res) => {
    try {
        console.log("Tentando aceitar pergunta web, ID:", req.params.id);
        
        const pergunta = await PerguntaWeb.findById(req.params.id);

        if (!pergunta) {
            return res.status(404).json({ msg: "Pergunta web não encontrada." });
        }

        // Marcar a pergunta como aceita na coleção gameweb
        pergunta.aceita = true;
        await pergunta.save();
        
        // Verificar se existe uma pergunta correspondente na coleção GAME
        // Se não existir, criar uma nova com os mesmos dados
        const perguntaExistente = await Pergunta.findOne({ pergunta: pergunta.pergunta, modo: 'web' });
        
        if (!perguntaExistente) {
            // Criar nova pergunta na coleção GAME
            const novaPergunta = new Pergunta({
                pergunta: pergunta.pergunta,
                correta: pergunta.correta,
                nivel: pergunta.nivel,
                modo: 'web'
            });
            await novaPergunta.save();
            console.log("Pergunta web aceita e adicionada à coleção GAME:", req.params.id);
        }

        console.log("Pergunta web aceita com sucesso:", req.params.id);
        
        res.json({ msg: "Pergunta web aceita com sucesso.", pergunta });
    } catch (err) {
        console.error("Erro ao aceitar pergunta web:", err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Pergunta web não encontrada (ID inválido)." });
        }
        res.status(500).json({ msg: "Erro no servidor ao aceitar pergunta web.", error: err.message });
    }
});

module.exports = router;