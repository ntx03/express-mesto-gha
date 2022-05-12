const routerCard = require('express').Router();
const { createCardValidation, cardIdValidation } = require('../middlewares/validation');

const {
  allCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
// получаем все карточки
routerCard.get('/cards', allCard);
// создаем карточку
routerCard.post('/cards', createCardValidation, createCard);
// удаляем  карточку
routerCard.delete('/cards/:cardId', cardIdValidation, deleteCard);
// ставим лайк  карточке
routerCard.put('/cards/:cardId/likes', cardIdValidation, likeCard);
// убираем лайк карточке
routerCard.delete('/cards/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = routerCard;
