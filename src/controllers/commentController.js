const Comment = require('../model/Comment');
class CommentController {
    static getAllComments = async (req, res) => {
        try {
            const comments = await Comment.find();
            if (!comments || comments.length === 0) return res.status(204).json({ 'message': 'No comments found' });
            res.json(comments);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getComment = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Comment ID required' });

        try {
            const comment = await Comment.findOne({ _id: req.params.id }).exec();
            if (!comment) {
                return res.status(400).json({ 'message': `Comment ID ${req.params.id} not found` });
            }
            res.json(comment);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getCommentsByMe = async (req, res) => {
        if (!req?.user_id) return res.status(400).json({ 'message': 'User ID NOT FOUND' });

        try {
            const comments = await Comment.find({ user: req.user_id });
            if (!comments || comments.length === 0) {
                return res.status(400).json({ 'message': `Your comment not found` });
            }
            res.json(comments);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static createNewComment = async (req, res) => {
        const { content, post } = req.body;
        if (!content || !post) return res.status(400).json({ 'message': 'details of comment required' });

        try {
            await Comment.create({
                "user": req.user_id,
                "post": post,   // post is Post ID
                "content": content
            });
            res.status(201).json({ 'message': `Comment ${content} of Post ID ${post} created` });
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }

    }
    static updateComment = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Comment ID required' });

        try {
            const comment = await Comment.findOne({ _id: req.params.id }).exec();
            if (!comment) {
                return res.status(400).json({ 'message': `comment ID ${req.params.id} not found` });
            }

            // verifyOwnership 
            if (!(req?.role === 'admin' || req?.user_id == comment.user)) return res.sendStatus(401);

            if (req.body?.content) comment.content = req.body.content;
            const result = await comment.save();
            res.json(result);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static deleteComment = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Comment ID required' });

        try {
            const comment = await Comment.findOne({ _id: req.params.id }).exec();
            if (!comment) {
                return res.status(400).json({ 'message': `comment ID ${req.params.id} not found` });
            }
            // verifyOwnership 
            if (!(req?.role === 'admin' || req?.user_id == comment.user)) return res.sendStatus(401);

            const result = await comment.deleteOne({ _id: req.params.id });
            res.json(result);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getUserByCommentID = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Comment ID required' });

        try {
            const comment = await Comment.findOne({ _id: req.params.id }).exec();
            if (!comment) {
                return res.status(400).json({ 'message': `comment ID ${req.params.id} not found` });
            }
            const user = await User.findOne({ _id: comment.user }).exec();
            if (!user) return res.status(400).json({ 'message': `User ID ${comment.user} not found` });
            res.json(user);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
}

module.exports = CommentController;