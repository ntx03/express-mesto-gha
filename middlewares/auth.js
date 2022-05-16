const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError('Необходима авторизация JWT');
  }
  req.user = payload;
  next();
};
// проверка авторизации
