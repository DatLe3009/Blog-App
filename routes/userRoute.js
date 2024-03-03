const express = require('express');
const route = express.Router();
const UserController = require('../controllers/userController');

route.post('/register', UserController.register);
route.post('/login', UserController.login);
route.get('/refresh', UserController.refreshToken);
route.get('/logout', UserController.logout);

module.exports = route;