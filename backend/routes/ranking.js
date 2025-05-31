const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const alunoSchema = require("../models/Aluno");

// Conexão específica ao banco ALUNOS
const alunosDB = mongoose.connection.useDb('ALUNOS');
const Aluno = alunosDB.model('Aluno', alunoSchema, 'usuarios');

// @route   GET api/ranking
// @desc    Exibir as estatísticas dos alunos para o ranking
// @access  Privado (Professor)
router.get("/", authMiddleware, async (req, res) => {
    try {
        console.log("Buscando alunos para o ranking...");
        
        // Buscar todos os alunos com suas estatísticas
        const alunos = await Aluno.find().lean();
        
        if (!alunos || alunos.length === 0) {
            console.log("Nenhum aluno encontrado para o ranking");
            return res.status(404).json({ msg: "Nenhum dado de ranking encontrado." });
        }

        console.log(`Encontrados ${alunos.length} alunos para o ranking`);
        
        // Processar o ranking global baseado nas estatísticas mais recentes
        const ranking = alunos.map(aluno => {
            // Se não houver estatísticas, retornar valores padrão
            if (!aluno.estatisticas || aluno.estatisticas.length === 0) {
                return {
                    ...aluno,
                    estatisticas: [{
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
                        createdAt: new Date()
                    }]
                };
            }
            
            return aluno;
        });
        
        res.json(ranking);
    } catch (err) {
        console.error("Erro ao buscar ranking:", err.message);
        res.status(500).json({ msg: "Erro no servidor ao buscar o ranking.", error: err.message });
    }
});

module.exports = router;
