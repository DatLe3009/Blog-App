const express = require('express');
const route = express.Router();
const PostController = require('../controllers/postController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRole = require('../middleware/verifyRole');

route.get('/api/v1/posts', verifyJWT, PostController.getAllPosts);
route.get('/api/v1/posts/me', verifyJWT, PostController.getPostsByMe);

route.get('/api/v1/posts/search', verifyJWT, PostController.getPostsByQuery);

route.get('/api/v1/posts/:id', verifyJWT, PostController.getPost);
route.post('/api/v1/posts', verifyJWT, PostController.createNewPost);
route.put('/api/v1/posts/:id', verifyJWT, PostController.updatePost);
route.delete('/api/v1/posts/:id', verifyJWT, PostController.deletePost);

route.get('/api/v1/posts/:id/comments', verifyJWT, PostController.getCommentsByPostID);
route.post('/api/v1/posts/:id/comments', verifyJWT, PostController.createNewComment);

route.get('/api/v1/posts/:id/likes', verifyJWT, PostController.getLikesByPostID);
route.post('/api/v1/posts/:id/likes', verifyJWT, PostController.createNewLike);
route.delete('/api/v1/posts/:id/likes', verifyJWT, PostController.deleteLike);

module.exports = route;