const express = require('express');
const route = express.Router();
const CommentController = require('../controllers/commentController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRole = require('../middleware/verifyRole');

route.get('/api/v1/comments', verifyJWT, CommentController.getAllComments);
route.get('/api/v1/comments/me', verifyJWT, CommentController.getCommentByMe);
route.get('/api/v1/comments/:id', verifyJWT, CommentController.getComment);
route.post('/api/v1/comments', verifyJWT, CommentController.createNewComment);
route.put('/api/v1/comments/:id', verifyJWT, CommentController.updateComment);
route.delete('/api/v1/comments/:id', verifyJWT, CommentController.deleteComment);

module.exports = route;