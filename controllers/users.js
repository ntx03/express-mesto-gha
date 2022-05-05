const User = require('../models/user');

const allUsers = (req, res, next) => {
  User.find({})
    .then(users => res.status(200).send(users))
    .catch((err) => {
      if (err.statusCode === 500) {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
        return;
      }
    })
};

const user = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      res.status(200).send(
        {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id
        }
      )
    }
    )
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
      return;
    }
    )
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      if (err.statusCode === 500) {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
        return;
      }
    })
};

const updateProfileUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => { res.status(404).send({ message: 'Пользователь с указанным _id не найден' }); })
    .then((user) => {
      res.status(200).json({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id
        }, message: 'Профиль обновлен'
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      if (err.statusCode === 500) {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => { res.status(404).send({ message: 'Пользователь с указанным _id не найден' }); })
    .then((user) => {
      res.status(200).json({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id
        }, message: 'Профиль обновлен'
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      if (err.statusCode === 500) {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  createUser,
  allUsers,
  user,
  updateProfileUser,
  updateProfileAvatar
};