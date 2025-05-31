const mongoose = require('mongoose');

// Schema para perguntas
const perguntaSchema = new mongoose.Schema({
  pergunta: {
    type: String,
    required: true
  },
  correta: {
    type: String,
    required: true
  }
});

// Exportamos apenas o schema, sem criar o modelo
// A conexão específica será feita na rota
module.exports = perguntaSchema;
