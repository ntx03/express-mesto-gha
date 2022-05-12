const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Некорректый адрес почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator:
        // eslint-disable-next-line no-useless-escape
        (url) => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url),
      message: 'Некорректный адрес URL',
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // eslint-disable-next-line no-undef
        return res.status(401).send({ message: 'Неправильные почта или пароль' });
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // eslint-disable-next-line no-undef
            return res.status(401).send({ message: 'Неправильные почта или пароль' });
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
