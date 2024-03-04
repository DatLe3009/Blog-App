const express = require('express');
const route = express.Router();
const UserController = require('../controllers/userController');
const verifyJWT = require('../middleware/verifyJWT');

route.post('/register', UserController.register);
route.post('/login', UserController.login);
route.get('/refresh', UserController.refreshToken);
route.get('/logout', UserController.logout);

route.get('/api/v1/users', verifyJWT, UserController.getAllUsers);
route.get('/api/v1/users/:id', verifyJWT, UserController.getUser);
route.put('/api/v1/users/:id', verifyJWT, UserController.updateUser);
route.delete('/api/v1/users/:id', verifyJWT, UserController.deleteUser);

module.exports = route;