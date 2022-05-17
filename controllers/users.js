const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');

const SALT_ROUNDS = 10;

// находим всех пользователей в базе
const allUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

// находим пользователя по ID
const findUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId).orFail(() => { throw new NotFound('Пользователь по указанному _id не найден'); })
    // eslint-disable-next-line no-shadow
    .then((user) => {
      res.status(200).send(
        {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        },
      );
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Пользователь по указанному _id не найден');
      }
      next(err);
    });
};

// создаем пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    // eslint-disable-next-line no-shadow
    .then((user) => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        throw new Conflict('Такой пользователь уже существует');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при создании пользователя!.');
      }
    })
    .catch(next);
};

// получаем информацию о текущем пользователе
const getUser = (req, res, next) => {
  User.findById(req.user._id).orFail(() => { throw new NotFound('Пользователь не найден'); })
    // eslint-disable-next-line no-shadow
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при обновлении профиля');
      }
    })
    .catch(next);
};

// обновляем данные пользователя имя и о себе
const updateProfileUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFound('Пользователь с указанным _id не найден'); })
    // eslint-disable-next-line no-shadow
    .then((user) => {
      res.status(200).json({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при обновлении профиля');
      }
    })
    .catch(next);
};

// обновляем данные пользователя аватар
const updateProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => { res.status(404).send({ message: 'Пользователь с указанным _id не найден' }); })
    // eslint-disable-next-line no-shadow
    .then((user) => {
      res.status(200).json({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при обновлении профиля');
      }
    })
    .catch(next);
};

// проходим авторизацию
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    // eslint-disable-next-line no-shadow
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        throw new AuthError('Неверный логин или пароль');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  allUsers,
  findUserId,
  updateProfileUser,
  updateProfileAvatar,
  login,
  getUser,
};
