const routerCard = require('express').Router();

const {
  allCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCard.get('/cards', allCard);

routerCard.post('/cards', createCard);

routerCard.delete('/cards/:cardId', deleteCard);

routerCard.put('/cards/:cardId/likes', likeCard);

routerCard.delete('/cards/:cardId/likes', dislikeCard);

module.exports = routerCard;
