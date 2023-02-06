const fs = require('fs').promises;
const path = require('path');
const express = require('express');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
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
}

app.get('/talker', async (_req, res) => {
  const data = await readData();
  res.status(200).json(data);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readData();
  const findTalker = data.find((e) => e.id === Number(id));
  if (!findTalker) res.status(404).send({ "message": "Pessoa palestrante não encontrada"});
  res.status(200).json(findTalker);
});


// app.get('/chocolates', async (_req, res) => {
//   const chocolates = await cacauTrybe.getAllChocolate();
//   res.status(200).json({ chocolates });
// });


