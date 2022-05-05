const router = require('express').Router();

const { allUsers, createUser, user, updateProfileUser, updateProfileAvatar } = require('../controllers/users.js');

router.get('/users', allUsers);

router.get('/users/:userId', user);

router.post('/users', createUser);

router.patch('/users/me', updateProfileUser);

router.patch('/users/me/avatar', updateProfileAvatar);

module.exports = router;

