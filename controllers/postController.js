const Post = require('../model/Post');
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
        if (!(req?.role === 'admin' || req?.user_id == post.user)) return res.sendStatus(401);

        const result = await post.deleteOne({ _id: req.params.id });
        res.json(result);
    }
}

module.exports = PostController;