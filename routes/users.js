const userRoutes = require('express').Router();
const { getUser, updateUserInfo } = require('../controllers/users');

const { validationUpdateUserInfo } = require('../middlewares/validation');

userRoutes.get('/me', getUser);

userRoutes.patch('/me', validationUpdateUserInfo, updateUserInfo);

module.exports = userRoutes;
