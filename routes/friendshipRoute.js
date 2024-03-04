const express = require('express');
const route = express.Router();
const FriendshipController = require('../controllers/friendshipController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRole = require('../middleware/verifyRole');

route.get('/api/v1/friendships', verifyJWT, FriendshipController.getAllFriendships);
route.get('/api/v1/friendships/me', verifyJWT, FriendshipController.getFriendshipsByMe);
route.get('/api/v1/friendships/:id', verifyJWT, FriendshipController.getFriendship);
route.post('/api/v1/friendships', verifyJWT, FriendshipController.createNewFriendship);
route.put('/api/v1/friendships/:id', verifyJWT, FriendshipController.updateFriendship);
route.delete('/api/v1/friendships/:id', verifyJWT, FriendshipController.deleteFriendship);

module.exports = route;