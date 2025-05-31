const mongoose = require('mongoose');

// Definição do sub-schema para estatísticas
const estatSub = new mongoose.Schema({
    saldo: Number,
    acertos: Number,
    erros: Number,
    ajudas: Number,
    pulos: Number,
    universitarios: Number,
    totalGanho: Number,
    gastoErro: Number,
    gastoAjuda: Number,
    gastoPulo: Number,
    gastoUniversitarios: Number,
    createdAt: { type: Date, default: Date.now }
}, { _id: false });

// Schema para alunos
const alunoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    estatisticas: [estatSub],
    dataCadastro: {
        type: Date,
        default: Date.now
    }
});

// Exportamos diretamente o modelo sem configurar a coleção
// A conexão específica será feita na rota
module.exports = alunoSchema;
