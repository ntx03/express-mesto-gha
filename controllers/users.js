const User = require('../models/user');

const allUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const user = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    // eslint-disable-next-line no-shadow
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(200).send(
          {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            _id: user._id,
          },
        );
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пользователь по указанному _id не найден' });
      } else res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    // eslint-disable-next-line no-shadow
    .then((user) => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateProfileUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => { res.status(404).send({ message: 'Пользователь с указанным _id не найден' }); })
    // eslint-disable-next-line no-shadow
    .then((user) => {
      res.status(200).json({
        data: {
          name: user.name,
          about: user.about,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateProfileAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => { res.status(404).send({ message: 'Пользователь с указанным _id не найден' }); })
    // eslint-disable-next-line no-shadow
    .then((user) => {
      res.status(200).json({
        data: {
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  createUser,
  allUsers,
  user,
  updateProfileUser,
  updateProfileAvatar,
};
