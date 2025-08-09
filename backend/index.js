require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bem-vindo ao backend do E-commerce!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

const cors = require('cors');
app.use(cors());