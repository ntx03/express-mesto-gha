const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const BadRequest = require('../errors/BadRequest');

// валидируем URL
const validationUrl = (url) => {
  const validate = isUrl(url);
  if (validate) {
    return url;
  }
  throw new BadRequest('Некорректный адрес URL');
};

// валидируем usrer ID
const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().min(24),
  }),
});
// валидируем обновление профиля пользователя
const updateProfileUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});
// валидируем обновление аватара пользователя
const updateProfileAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validationUrl),
  }),
});
// валидируем создание карточки
const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validationUrl),
  }),
});
// валидируем айди карточки
const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().min(24),
  }),
});
// валидиуем почту и пароль
const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
// валидируем все данные при создании пользователя
const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validationUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  userIdValidation,
  updateProfileUserValidation,
  updateProfileAvatarValidation,
  createCardValidation,
  cardIdValidation,
  validationLogin,
  validationCreateUser,
};
