const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const alunoSchema = require("../models/Aluno");

// Conexão específica ao banco ALUNOS
const alunosDB = mongoose.connection.useDb('ALUNOS');
const Aluno = alunosDB.model('Aluno', alunoSchema, 'usuarios');

// @route   POST api/alunos
// @desc    Adicionar um novo aluno
// @access  Privado (Professor)
router.post("/", authMiddleware, async (req, res) => {
    const { nome, cpf, senha } = req.body;

    if (!nome || !cpf || !senha) {
        return res.status(400).json({ msg: "Por favor, preencha todos os campos." });
    }

    try {
        // Verificar se o aluno já existe
        const alunoExistente = await Aluno.findOne({ cpf });
        if (alunoExistente) {
            return res.status(400).json({ msg: "Aluno já cadastrado com este CPF." });
        }

        // Normalizar CPF (remover pontos, traços, etc.)
        const cpfNormalizado = cpf.replace(/\D/g, '');
        
        console.log("Criando novo aluno:", { nome, cpf: cpfNormalizado });

        const novoAluno = new Aluno({
            nome,
            cpf: cpfNormalizado,
            senha,
            dataCadastro: new Date()
        });

        const alunoSalvo = await novoAluno.save();
        console.log("Aluno cadastrado com sucesso:", alunoSalvo._id);
        res.json(alunoSalvo);
    } catch (err) {
        console.error("Erro ao cadastrar aluno:", err.message);
        res.status(500).json({ msg: "Erro no servidor ao cadastrar aluno.", error: err.message });
    }
});

// @route   GET api/alunos
// @desc    Obter todos os alunos
// @access  Privado (Professor)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const alunos = await Aluno.find().select("-estatisticas");
        console.log(`Retornando ${alunos.length} alunos cadastrados`);
        res.json(alunos);
    } catch (err) {
        console.error("Erro ao listar alunos:", err.message);
        res.status(500).json({ msg: "Erro no servidor ao listar alunos.", error: err.message });
    }
});

// @route   GET api/alunos/:id
// @desc    Obter um aluno específico
// @access  Privado (Professor)
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.params.id);
        
        if (!aluno) {
            return res.status(404).json({ msg: "Aluno não encontrado." });
        }
        
        res.json(aluno);
    } catch (err) {
        console.error("Erro ao buscar aluno:", err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Aluno não encontrado (ID inválido)." });
        }
        res.status(500).json({ msg: "Erro no servidor ao buscar aluno.", error: err.message });
    }
});

// @route   DELETE api/alunos/:id
// @desc    Excluir um aluno
// @access  Privado (Professor)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.params.id);
        
        if (!aluno) {
            return res.status(404).json({ msg: "Aluno não encontrado." });
        }
        
        await Aluno.findByIdAndDelete(req.params.id);
        console.log("Aluno excluído com sucesso:", req.params.id);
        
        res.json({ msg: "Aluno removido com sucesso." });
    } catch (err) {
        console.error("Erro ao excluir aluno:", err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Aluno não encontrado (ID inválido)." });
        }
        res.status(500).json({ msg: "Erro no servidor ao excluir aluno.", error: err.message });
    }
});

module.exports = router;
