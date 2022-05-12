const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const serverError = require('./middlewares/serverError');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

// создаем сервер на фреймворке express
const app = express();

// подключаемся к базе данных MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// преобразование в строку
app.use(express.json());

// подключаем роуты
app.use(router);

// обрабатываем ошибки с предварительной валидации данных перед контрооллерами
app.use(errors());

// eslint-disable-next-line no-unused-vars
// обрататываем общие ошибки
app.use(serverError);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
