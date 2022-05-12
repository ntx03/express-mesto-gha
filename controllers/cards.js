const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const Card = require('../models/card');

const allCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при создании карточки.');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFound('Карточка с указанным _id не найдена.');
      }
      if (card.owner.toString() === req.user._id) {
        throw new Forbidden('В доступе отказано');
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Карточка с указанным _id не найдена');
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  ).orFail(() => { throw new NotFound('Передан несуществующий _id карточки'); })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные для постановки лайка');
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true },
  ).orFail(() => { throw new NotFound('Передан несуществующий _id карточки'); })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные для постановки лайка');
      }
      next(err);
    });
};

module.exports = {
  allCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
