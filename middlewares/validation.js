const { celebrate, Joi } = require('celebrate');

// валидируем usrer ID
const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().min(24),
  }),
});

const updateProfileUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});
// надо провалидировать ссылку!!!
const updateProfileAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
});
// надо провалидировать ссылку!!!
const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().min(24),
  }),
});

module.exports = {
  userIdValidation,
  updateProfileUserValidation,
  updateProfileAvatarValidation,
  createCardValidation,
  cardIdValidation,
};
