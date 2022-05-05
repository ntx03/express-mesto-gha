const Card = require('../models/card');

const allCard = (req, res, next) => {
  Card.find({})
    .then(cards => res.status(200).send(cards))
    .catch((err) => {
      if (err.statusCode === 500) {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
        return;
      }
    })
}

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      if (err.statusCode === 500) {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
        return;
      }
    })
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card === null)
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' })
      else
        res.status(200).send(card)
    })
    .catch((err) => {
      if (err.statusCode === 500) {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
        return;
      }
    })
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const _id = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => { res.status(404).send({ message: 'Передан несуществующий _id карточки' }); })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      if (err.statusCode === 500) {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
        return;
      }
    })
}

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const _id = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => { res.status(404).send({ message: 'Передан несуществующий _id карточки' }); })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      if (err.statusCode === 500) {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
        return;
      }
    })
}

module.exports = {
  allCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
};