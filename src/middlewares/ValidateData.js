const HTTP_BADREQ_STATUS = 400;
const HTTP_UNAUTHORIZED_STATUS = 401;
const MIN_AGE = 18;
const NAME_LENGTH = 3;
const PASSWORD_LENGTH = 6;
const TOKEN_LENGTH = 16;

const validationToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(HTTP_UNAUTHORIZED_STATUS).json({ message: 'Token não encontrado' });
  }
  if (typeof authorization !== 'string' || authorization.length !== TOKEN_LENGTH) {
    return res.status(HTTP_UNAUTHORIZED_STATUS).json({ message: 'Token inválido' });
  }
  return next();  
};

const validationEmail = (req, res, next) => {
  const { email } = req.body;
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{3}$/g;
  if (!email) { 
    return res.status(HTTP_BADREQ_STATUS).json({ message: 'O campo "email" é obrigatório' });
  } 
  if (!(regex.test(email))) { 
    return res.status(HTTP_BADREQ_STATUS)
      .json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  return next();
};

const validationPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  } 
  if (password.length < PASSWORD_LENGTH) {
    return res.status(HTTP_BADREQ_STATUS)
      .json({ message: `O "password" deve ter pelo menos ${PASSWORD_LENGTH} caracteres` });
  } 
  return next();
};

const validationName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(HTTP_BADREQ_STATUS).json({ message: 'O campo "name" é obrigatório' });
  } 
  if (name.length < NAME_LENGTH) {
    return res.status(HTTP_BADREQ_STATUS)
      .json({ message: `O "name" deve ter pelo menos ${NAME_LENGTH} caracteres` });
  }
  return next();
};

const validationAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(HTTP_BADREQ_STATUS).json({ message: 'O campo "age" é obrigatório' });
  } 
  if (typeof age !== 'number') {
    return res.status(HTTP_BADREQ_STATUS)
      .json({ message: 'O campo "age" deve ser do tipo "number"' });
  }
  if (!Number.isInteger(age)) {
    return res.status(HTTP_BADREQ_STATUS)
      .json({ message: 'O campo "age" deve ser um "number" do tipo inteiro' });
  }
  if (age < MIN_AGE) {
    return res.status(HTTP_BADREQ_STATUS)
      .json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }  
  return next();
};

const validationTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) { 
    return res.status(HTTP_BADREQ_STATUS).json({ message: 'O campo "talk" é obrigatório' });
  }
  next();
};

const validationWhatched = (req, res, next) => {
  const { talk } = req.body;
  const { watchedAt } = talk;
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!watchedAt) { 
    return res.status(HTTP_BADREQ_STATUS).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!watchedAt.match(dateRegex)) { 
    return res.status(HTTP_BADREQ_STATUS)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
}; 

const validationRate = (req, res, next) => {
  const { talk } = req.body;
  const { rate } = talk;
  if (rate === undefined) { 
    return res.status(HTTP_BADREQ_STATUS).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (rate < 1 || rate > 5 || Math.floor(rate) !== rate) { 
    return res.status(HTTP_BADREQ_STATUS)
      .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  return next();
};

module.exports = {
  validationToken,
  validationEmail,
  validationPassword,
  validationName,
  validationAge,
  validationTalk,
  validationWhatched,
  validationRate,
};