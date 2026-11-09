require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Instrumento = require('./models/instrumento');

const app = express();

// ---------- Conexão com o MongoDB ----------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err.message));

// ---------- Configuração do EJS ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Permite ler os dados enviados pelo formulário (req.body)
app.use(express.urlencoded({ extended: true }));

// ---------- Rota inicial ----------
app.get('/', (req, res) => {
  res.redirect('/instrumento/lst');
});

// ---------- CADASTRO ----------

// GET: exibe o formulário
app.get('/instrumento/add', (req, res) => {
  res.render('instrumento/add');
});

// POST: recebe os dados e grava no MongoDB
app.post('/instrumento/add', async (req, res) => {
  try {
    const novo = new Instrumento({
      nome:       req.body.nome,
      fabricante: req.body.fabricante,
      preco:      req.body.preco,
      tipo:       req.body.tipo
    });
    await novo.save();
    res.render('instrumento/addok', { instrumento: novo });
  } catch (erro) {
    res.status(500).send('Erro ao cadastrar: ' + erro.message);
  }
});

// ---------- LISTAGEM ----------
app.get('/instrumento/lst', async (req, res) => {
  try {
    const instrumentos = await Instrumento.find();
    res.render('instrumento/lst', { instrumentos });
  } catch (erro) {
    res.status(500).send('Erro ao listar: ' + erro.message);
  }
});

// ---------- Servidor ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor rodando na porta ' + PORT);
});