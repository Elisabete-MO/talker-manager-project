const fs = require('fs').promises;
const CryptoJS = require('crypto-js');
const path = require('path');
const express = require('express');

const secretKey = 'secret-key';

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const PASSWORD_LENGTH = 6;

const dataPath = path.resolve(__dirname, './talker.json');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online XD');
});

const readData = async () => {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    const response = await JSON.parse(data);
    return response;
  } catch (error) {
    console.error(`Erro ao ler o arquivo: ${error.message}`);
  }
};

const createToken = (data) => CryptoJS.AES.encrypt(JSON
  .stringify(data), secretKey).toString().substring(0, 16);

app.get('/talker', async (_req, res) => {
  const data = await readData();
  res.status(200).json(data);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readData();
  const findTalker = data.find((e) => e.id === Number(id));
  if (!findTalker) res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
  res.status(200).json(findTalker);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{3}$/g;
  if (!email) return res.status(400).send({ message: 'O campo "email" é obrigatório' });
  if (!(regex.test(email))) { 
    return res.status(400).send({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) return res.status(400).send({ message: 'O campo "password" é obrigatório' });
  if (password.length < PASSWORD_LENGTH) {
    return res.status(400)
      .send({ message: `O "password" deve ter pelo menos ${PASSWORD_LENGTH} caracteres` });
  }
  const data = email + password;
  const token = createToken(data);
  res.status(200).json({ token });
});
