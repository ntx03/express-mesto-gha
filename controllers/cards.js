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
        throw new BadRequest('Переданы некорректные данные при создании карточки.');
      }
    })
    .catch(next);
};
// удаляем карточку
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId).orFail(() => { throw new NotFound('карточка не найдена'); })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(cardId)
          .then((item) => { res.status(200).send(item); });
      } else {
        throw new Forbidden('В доступе отказано');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Карточка с указанным _id не найдена');
      }
      next(err);
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
        throw new BadRequest('Переданы некорректные данные для постановки лайка');
      }
      next(err);
    });
};
// убираем лайк карточке
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
