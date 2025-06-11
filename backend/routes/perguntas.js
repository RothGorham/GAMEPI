const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const perguntaSchema = require("../models/Pergunta");

// Conexão específica ao banco PERGUNTAS
const perguntasDB = mongoose.connection.useDb('PERGUNTAS');
const Pergunta = perguntasDB.model('Pergunta', perguntaSchema, 'GAME');

// @route   POST api/perguntas
// @desc    Adicionar uma nova pergunta
// @access  Privado (Professor)
router.post("/", authMiddleware, async (req, res) => {
    const { pergunta, correta, nivel, materia } = req.body;

    if (!pergunta || !correta) {
        return res.status(400).json({ msg: "Por favor, forneça a pergunta e a resposta correta." });
    }

    try {
        console.log("Tentando salvar pergunta:", { pergunta, correta, nivel, materia });
        
        const novaPergunta = new Pergunta({
            pergunta,
            correta,
            nivel: nivel || 'medio',
            materia: materia || 'misto',
            modo: 'normal' // Define explicitamente como modo normal
        });

        const perguntaSalva = await novaPergunta.save();
        console.log("Pergunta salva com sucesso:", perguntaSalva);
        res.json(perguntaSalva);
    } catch (err) {
        console.error("Erro ao salvar pergunta:", err.message);
        res.status(500).json({ msg: "Erro no servidor ao adicionar pergunta.", error: err.message });
    }
});

// @route   GET api/perguntas
// @desc    Visualizar todas as perguntas ou pesquisar
// @access  Privado (Professor)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const { q } = req.query; // q é o parâmetro de busca
        let query = {};
        if (q) {
            query = { pergunta: { $regex: q, $options: "i" } }; // Busca case-insensitive
        }
        
        console.log("Buscando perguntas com query:", query);
        const perguntas = await Pergunta.find(query).sort({ dataCriacao: -1 });
        console.log(`Encontradas ${perguntas.length} perguntas`);
        
        res.json(perguntas);
    } catch (err) {
        console.error("Erro ao buscar perguntas:", err.message);
        res.status(500).json({ msg: "Erro no servidor ao buscar perguntas.", error: err.message });
    }
});

// @route   DELETE api/perguntas/:id
// @desc    Excluir uma pergunta individualmente
// @access  Privado (Professor)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        console.log("Buscando pergunta para exclusão, ID:", req.params.id);
        
        const pergunta = await Pergunta.findById(req.params.id);

        if (!pergunta) {
            return res.status(404).json({ msg: "Pergunta não encontrada." });
        }

        await Pergunta.findByIdAndDelete(req.params.id);
        console.log("Pergunta excluída com sucesso:", req.params.id);
        
        res.json({ msg: "Pergunta removida com sucesso." });
    } catch (err) {
        console.error("Erro ao excluir pergunta:", err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Pergunta não encontrada (ID inválido)." });
        }
        res.status(500).json({ msg: "Erro no servidor ao excluir pergunta.", error: err.message });
    }
});

// @route   DELETE api/perguntas
// @desc    Excluir todas as perguntas
// @access  Privado (Professor)
router.delete("/", authMiddleware, async (req, res) => {
    try {
        console.log("Excluindo todas as perguntas");
        
        // Adicionar verificação se o professor logado tem permissão para excluir todas, se necessário
        await Pergunta.deleteMany({}); // Deleta todas as perguntas da coleção
        
        console.log("Todas as perguntas foram excluídas com sucesso");
        res.json({ msg: "Todas as perguntas foram removidas com sucesso." });
    } catch (err) {
        console.error("Erro ao excluir todas as perguntas:", err.message);
        res.status(500).json({ msg: "Erro no servidor ao excluir todas as perguntas.", error: err.message });
    }
});

module.exports = router;
