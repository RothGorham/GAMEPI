const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Professor = require("../models/Professor");

// Rota de Login do Professor: POST /api/auth/login
router.post("/login", async (req, res) => {
    console.log("Recebida requisição de login:", req.body);
    
    const { email, senha } = req.body;

    if (!email || !senha) {
        console.log("Email ou senha não fornecidos");
        return res.status(400).json({ msg: "Por favor, forneça email e senha." });
    }

    try {
        console.log(`Tentativa de login: ${email} / ${senha}`);
        
        // Conexão ao banco de dados PROFESSORES
        const professoresDB = mongoose.connection.useDb('PROFESSORES');
        
        // Buscar diretamente na coleção 'usuarios' usando o driver nativo do MongoDB
        const usuariosCollection = professoresDB.db.collection('usuarios');
        
        // Busca o professor pelo email
        const professor = await usuariosCollection.findOne({ email });
        
        console.log("Resultado da busca:", professor ? "Professor encontrado" : "Professor não encontrado");
        
        if (!professor) {
            console.log(`Professor não encontrado com email: ${email}`);
            return res.status(400).json({ msg: "Credenciais inválidas." });
        }

        console.log(`Professor encontrado:`, {
            id: professor._id,
            email: professor.email,
            senha: professor.senha ? "Senha presente" : "Senha ausente"
        });
        
        // Verificar a senha (texto puro)
        console.log(`Comparando senhas: "${senha}" com "${professor.senha}"`);
        if (professor.senha !== senha) {
            console.log("Senha incorreta fornecida");
            return res.status(400).json({ msg: "Credenciais inválidas." });
        }

        console.log("Login bem-sucedido, gerando token JWT");

        // Criar e enviar o token JWT
        const payload = {
            professor: {
                id: professor._id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || "suasenhasupersecreta",
            { expiresIn: 3600 }, // Token expira em 1 hora
            (err, token) => {
                if (err) {
                    console.error("Erro ao gerar token JWT:", err);
                    return res.status(500).json({ msg: "Erro ao gerar token" });
                }
                return res.json({ token });
            }
        );

    } catch (err) {
        console.error("Erro durante autenticação:", err.message);
        return res.status(500).json({ msg: "Erro no servidor", error: err.message });
    }
});

module.exports = router;
