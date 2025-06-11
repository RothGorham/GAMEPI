const mongoose = require('mongoose');

// Schema para perguntas do modo web
const perguntaWebSchema = new mongoose.Schema({
  pergunta: {
    type: String,
    required: true
  },
  correta: {
    type: String,
    required: true
  },
  nivel: {
    type: String,
    enum: ['facil', 'medio', 'dificil'],
    required: true
  },
  aceita: {
    type: Boolean,
    default: false
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

// Exportamos apenas o schema, sem criar o modelo
// A conexão específica será feita na rota
module.exports = perguntaWebSchema;