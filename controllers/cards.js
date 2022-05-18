const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const Card = require('../models/card');
// достаем все карточки
const allCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};
// создаем карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      } else { next(err); }
    });
};
// удаляем карточку
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId).orFail(() => { throw new NotFound('карточка не найдена'); })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return Card.findByIdAndRemove(cardId)
          .then((item) => { res.status(200).send(item); });
      }
      throw new Forbidden('В доступе отказано');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};
// ставим лайк карточке
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => { throw new NotFound('Передан несуществующий _id карточки'); })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};
// убираем лайк карточке
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => { throw new NotFound('Передан несуществующий _id карточки'); })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  allCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
