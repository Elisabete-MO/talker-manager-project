const fs = require('fs').promises;
const CryptoJS = require('crypto-js');
const path = require('path');
const express = require('express');
const { validationEmail, validationPassword, validationName, validationAge, validationTalk, 
  validationWhatched, validationRate, validationToken } = require('./middlewares/ValidateData');

const secretKey = 'secret-key';

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;
const HTTP_NFOUND_STATUS = 404;
const PORT = '3000';

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
  res.status(HTTP_OK_STATUS).json(data);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readData();
  const findTalker = data.find((e) => e.id === Number(id));
  if (!findTalker) {
    return res.status(HTTP_NFOUND_STATUS)
      .json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(findTalker);
});

app.post('/login', validationEmail, validationPassword, async (req, res) => {
  const { email, password } = req.body;
  const data = email + password;
  const token = createToken(data);
  res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker',
  validationToken,
  validationName,
  validationAge,
  validationTalk,
  validationWhatched,
  validationRate,
  async (req, res) => {
  const { name, age, talk } = req.body;
  const { watchedAt, rate } = talk;
  const data = await readData();
  const newPerson = {
    id: data[data.length - 1].id + 1,
    name, 
    age,
    talk: {
      watchedAt, 
      rate,
    },
  };
  await fs.writeFile(dataPath, JSON.stringify([...data, newPerson]));
  return res.status(HTTP_CREATED_STATUS).json(newPerson);
});

app.put('/talker/:id', 
  validationToken,
  validationName,
  validationAge, 
  validationTalk,
  validationWhatched,
  validationRate, 
  async (req, res) => {
  const { id } = req.params;
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const data = await readData();
  const index = data.findIndex((e) => e.id === Number(id));
  if (index < 0) { 
    return res.status(HTTP_NFOUND_STATUS)
      .json({ message: 'Pessoa palestrante não encontrada' });
  }
  data[index] = { 
    id: Number(id), 
    name, 
    age,
    talk: { watchedAt, rate },
  };
  const updated = JSON.stringify(data, null, 2);
  await fs.writeFile(dataPath, updated);
  return res.status(200).json(data[index]);
});
