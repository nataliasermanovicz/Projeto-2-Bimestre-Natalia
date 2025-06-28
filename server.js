const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'usuarios.json');
const PRODUTOS_FILE = path.join(__dirname, 'produtos.json');

app.use(cors());
app.use(express.json());

// Função para ler usuários
function lerUsuarios() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}

// Função para salvar usuários
function salvarUsuarios(usuarios) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2));
}

// Função para ler produtos
function lerProdutos() {
  if (!fs.existsSync(PRODUTOS_FILE)) return [];
  const data = fs.readFileSync(PRODUTOS_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}

// Função para salvar produtos
function salvarProdutos(produtos) {
  fs.writeFileSync(PRODUTOS_FILE, JSON.stringify(produtos, null, 2));
}

// Rota de cadastro
app.post('/api/cadastro', (req, res) => {
  const { email, senha, nome, dataNascimento } = req.body;
  let perfil = 'cliente';
  if (email === 'natalinhasermanovicz@email.com') {
    perfil = 'gerente';
  }
  if (!email || !senha || !nome || !dataNascimento) {
    return res.status(400).json({ erro: 'Dados incompletos' });
  }
  const usuarios = lerUsuarios();
  if (usuarios.find(u => u.email === email)) {
    return res.status(409).json({ erro: 'Usuário já cadastrado' });
  }
  usuarios.push({ email, senha, perfil, nome, dataNascimento });
  salvarUsuarios(usuarios);
  res.json({ mensagem: 'Cadastro realizado com sucesso' });
});

// Rota de login
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  const usuarios = lerUsuarios();
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);
  if (!usuario) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }
  res.json({ mensagem: 'Login realizado com sucesso', usuario });
});

// Rotas CRUD de produtos
app.get('/api/produtos', (req, res) => {
  res.json(lerProdutos());
});

app.post('/api/produtos', (req, res) => {
  const { id, nome, descricao, imagem, preco } = req.body;
  if (!id || !nome || !descricao || !imagem || !preco) {
    return res.status(400).json({ erro: 'Dados incompletos' });
  }
  let produtos = lerProdutos();
  if (produtos.find(p => p.id == id)) {
    return res.status(409).json({ erro: 'ID já cadastrado' });
  }
  produtos.push({ id, nome, descricao, imagem, preco });
  salvarProdutos(produtos);
  res.json({ mensagem: 'Produto cadastrado com sucesso' });
});

app.put('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, descricao, imagem, preco } = req.body;
  let produtos = lerProdutos();
  const idx = produtos.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ erro: 'Produto não encontrado' });
  produtos[idx] = { id, nome, descricao, imagem, preco };
  salvarProdutos(produtos);
  res.json({ mensagem: 'Produto atualizado com sucesso' });
});

app.delete('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let produtos = lerProdutos();
  const novoArray = produtos.filter(p => p.id !== id);
  if (novoArray.length === produtos.length) return res.status(404).json({ erro: 'Produto não encontrado' });
  salvarProdutos(novoArray);
  res.json({ mensagem: 'Produto excluído com sucesso' });
});

// Rotas CRUD de usuários (admin)
app.get('/api/usuarios', (req, res) => {
  res.json(lerUsuarios());
});

app.put('/api/usuarios/:email', (req, res) => {
  const email = req.params.email;
  const { nome, dataNascimento, senha, perfil } = req.body;
  let usuarios = lerUsuarios();
  const idx = usuarios.findIndex(u => u.email === email);
  if (idx === -1) return res.status(404).json({ erro: 'Usuário não encontrado' });
  // Atualiza apenas os campos enviados
  if (nome !== undefined) usuarios[idx].nome = nome;
  if (dataNascimento !== undefined) usuarios[idx].dataNascimento = dataNascimento;
  if (senha !== undefined) usuarios[idx].senha = senha;
  if (perfil !== undefined) usuarios[idx].perfil = perfil;
  salvarUsuarios(usuarios);
  res.json({ mensagem: 'Usuário atualizado com sucesso' });
});

app.delete('/api/usuarios/:email', (req, res) => {
  const email = req.params.email;
  let usuarios = lerUsuarios();
  const novoArray = usuarios.filter(u => u.email !== email);
  if (novoArray.length === usuarios.length) return res.status(404).json({ erro: 'Usuário não encontrado' });
  salvarUsuarios(novoArray);
  res.json({ mensagem: 'Usuário excluído com sucesso' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
