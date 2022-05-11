const routerCard = require('express').Router();
const { createCardValidation, cardIdValidation } = require('../middlewares/validation');

const {
  allCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCard.get('/cards', allCard);

routerCard.post('/cards', createCardValidation, createCard);

routerCard.delete('/cards/:cardId', cardIdValidation, deleteCard);

routerCard.put('/cards/:cardId/likes', cardIdValidation, likeCard);

routerCard.delete('/cards/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = routerCard;
