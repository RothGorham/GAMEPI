const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definimos um esquema para o Professor
const ProfessorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    senha: {
        type: String,
        required: true,
        select: true // Mantém visível para comparação
    }
});

// Método para comparar a senha em texto puro
ProfessorSchema.methods.compararSenha = async function(senhaFornecida) {
    console.log("Comparando senhas:");
    console.log("Senha fornecida:", senhaFornecida);
    console.log("Senha do banco:", this.senha);
    
    // Verifica se as senhas são idênticas (formato texto puro)
    return senhaFornecida === this.senha;
};

// Exportamos o modelo, especificando explicitamente o banco/coleção
// Aqui usamos 'Professor' como nome do modelo, 'usuarios' como nome da coleção
module.exports = mongoose.model('Professor', ProfessorSchema);
