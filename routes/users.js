const router = require('express').Router();
const { userIdValidation, updateProfileUserValidation } = require('../middlewares/validation');

const {
  allUsers, findUserId, updateProfileUser, updateProfileAvatar, getUser,
} = require('../controllers/users');
// получаем информацию обо всех пользователях
router.get('/users', allUsers);
// получаем информацию о текущем пользователе
router.get('/users/me', getUser);
// находим пользователя по ID
router.get('/users/:userId', userIdValidation, findUserId);
// обновляем профиль пользователя(имя и о себе)
router.patch('/users/me', updateProfileUserValidation, updateProfileUser);
// обновляем профиль аватара пользователя
router.patch('/users/me/avatar', updateProfileAvatar);

module.exports = router;
