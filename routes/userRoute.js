const express = require('express');
const route = express.Router();
const UserController = require('../controllers/userController');

route.post('/register', UserController.register);
route.post('/login', UserController.login);
route.get('/refresh', UserController.refreshToken);
route.get('/logout', UserController.logout);

route.get('/api/v1/users', UserController.getAllUsers);
route.get('/api/v1/users/:id', UserController.getUser);
route.put('/api/v1/users/:id', UserController.updateUser);
route.delete('/api/v1/users/:id', UserController.deleteUser);

module.exports = route;