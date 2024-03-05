const Post = require('../model/Post');

const Comment = require('../model/Comment');
const Like = require('../model/Like');
class PostController {
    static getAllPosts = async (req, res) => {
        const posts = await Post.find();
        if (!posts || posts.length === 0) return res.status(204).json({ 'message': 'No posts found' });
        res.json(posts);
    }
    static getPost = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Post ID required' });
        const post = await Post.findOne({ _id: req.params.id }).exec();
        if (!post) {
            return res.status(400).json({ 'message': `Post ID ${req.params.id} not found` });
        }
        res.json(post);
    }
    static getPostsByMe = async (req, res) => {
        if (!req?.user_id) return res.status(400).json({ 'message': 'User ID NOT FOUND' });
        const post = await Post.find({ user: req.user_id });
        if (!post) {
            return res.status(400).json({ 'message': `Your post not found` });
        }
        res.json(post);
    }
    static createNewPost = async (req, res) => {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ 'message': 'details of post required' });

        try {
            await Post.create({
                "user": req.user_id,
                "title": title,
                "content": content
            });
            res.status(201).json({ 'message': `post ${title} created` });
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }

    }
    static updatePost = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Post ID required' });
        const post = await Post.findOne({ _id: req.params.id }).exec();
        if (!post) {
            return res.status(400).json({ 'message': `Post ID ${req.params.id} not found` });
        }

        // verifyOwnership 
        if (!(req?.role === 'admin' || req?.user_id == post.user)) return res.sendStatus(401);

        if (req.body?.title) post.title = req.body.title;
        if (req.body?.content) post.content = req.body.content;
        const result = await post.save();
        res.json(result);
    }
    static deletePost = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Post ID required' });
        const post = await Post.findOne({ _id: req.params.id }).exec();
        if (!post) {
            return res.status(400).json({ 'message': `Post ID ${req.params.id} not found` });
        }

        // verifyOwnership 
        if (!(req?.role === 'admin' || req?.user_id == post.user)) return res.sendStatus(401);

        const result = await post.deleteOne({ _id: req.params.id });
        res.json(result);
    }
    static getCommentsByPostID = async (req, res) => {
        if (!req?.params.id) return res.status(400).json({ 'message': 'Post ID required' });
        const comments = Comment.find({ post: req.params.id });
        if (!comments) return res.status(204).json({ 'message': `No comments of PostID ${req.params.id} FOUND` });
        res.json(comments);
    }
    static createNewComment = async (req, res) => {
        const { content } = req.body;
        if (!content || !req?.params.id) return res.status(400).json({ 'message': 'details of comment required' });
        try {
            await Comment.create({
                "user": req.user_id,
                "post": req.paramss.id,   // post is Post ID
                "content": content
            });
            res.status(201).json({ 'message': `Comment ${content} of Post ID ${post} created` });
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getPostsByQuery = async (req, res) => {
        const { title, content } = req.query;
        try {
            const query = {};
            if (title) query.title = { $regex: title, $options: 'i' };
            if (content) query.content = { $regex: content, $options: 'i' };
            const posts = await Post.find(query).exec();
            res.json(posts);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getLikesByPostID = async (req, res) => {
        if (!req?.params.id) return res.status(400).json({ 'message': 'details of Like required' });
        const likes = await Like.find({ post: req.params.id });
        res.json(likes);
    }
    static createNewLike = async (req, res) => {
        if (!req?.params.id || !req?.user_id) return res.status(400).json({ 'message': 'details of Like required' });
        // Check duplicate Like
        const duplicateLike = await Like.findOne({ user: req.user_id, post: req.params.id }).exec();
        if (duplicateLike) return res.status(400).json({ 'message': 'You already liked this post' });
        try {
            await Like.create({
                user: req.user_id,
                post: req.params.id
            });
            res.status(201).json({ 'message': `You liked a post with postID ${req.params.id}` });
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static deleteLike = async (req, res) => {
        if (!req?.params.id || !req?.user_id) return res.status(400).json({ 'message': 'details of Like required' });
        // Check exist of Like
        const like = await Like.findOne({ user: req.user_id, post: req.params.id }).exec();
        if (!like) return res.status(400).json({ 'message': 'You did not like this post yet' });
        const result = await like.deleteOne({ _id: like._id });
        res.json(result);
    }
}

module.exports = PostController;