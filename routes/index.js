const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFound = require('../errors/NotFound');
const { validationLogin, validationCreateUser } = require('../middlewares/validation');
const {
  login, createUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res, next) => {
  next(new NotFound('Запрашиваемая страница не существует'));
});

module.exports = router;
