const express = require('express');
const route = express.Router();
const UserController = require('../controllers/userController');

route.post('/register', UserController.register);
route.post('/login', UserController.login);

module.exports = route;