from pymongo import MongoClient

# URI fornecida
uri = "mongodb+srv://24950092:W7e3HGBYuh1X5jps@game.c3vnt2d.mongodb.net/GAME?retryWrites=true&w=majority&appName=GAME"

# Conectar ao MongoDB
client = MongoClient(uri)

# Selecionar banco e coleção
db = client["PROFESSORES"]
colecao = db["usuarios"]

# Coletar dados do usuário
email = input("Digite o e-mail do professor: ")
senha = input("Digite a senha do professor: ")

# Criar documento
professor = {
    "email": email,
    "senha": senha
}

# Inserir no banco
resultado = colecao.insert_one(professor)

print("✅ Professor adicionado com _id:", resultado.inserted_id)
