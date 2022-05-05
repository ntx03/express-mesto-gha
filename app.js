const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/users');
const routerCard = require('./routes/cards');
//const routerCard = require('./routes/cards');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '62710eb1a899f1aba6a8da42' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});
app.use(router);
app.use(routerCard);
app.use('*', (req, res, next) => {
  res.status(404).send({ message: 'страница не нейдена' });
})
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})






