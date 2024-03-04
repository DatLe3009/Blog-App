const express = require('express');
const route = express.Router();
const PostController = require('../controllers/postController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRole = require('../middleware/verifyRole');

route.get('/api/v1/posts', verifyJWT, PostController.getAllPosts);
route.get('/api/v1/posts/me', verifyJWT, PostController.getPostsByMe);
route.get('/api/v1/posts/:id', verifyJWT, PostController.getPost);
route.post('/api/v1/posts', verifyJWT, PostController.createNewPost);
route.put('/api/v1/posts/:id', verifyJWT, PostController.updatePost);
route.delete('/api/v1/posts/:id', verifyJWT, PostController.deletePost);

module.exports = route;