const Friendship = require('../model/Friendship');

const checkFriendshipExists = async (user1, user2) => {
    const existingFriendship = await Friendship.findOne({
        $or: [
            { user: user1, friend: user2 },
            { user: user2, friend: user1 },
        ],
    }).exec();
    return existingFriendship !== null;
}
class FriendshipController {
    static getAllFriendships = async (req, res) => {
        const friendships = await Friendship.find();
        if (!friendships || friendships.length === 0) return res.status(204).json({ 'message': 'No friendships found' });
        res.json(friendships);
    }
    static getFriendship = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Friendship ID required' });
        const friendship = await Friendship.findOne({ _id: req.params.id }).exec();
        if (!friendship) {
            return res.status(400).json({ 'message': `Friendship ID ${req.params.id} not found` });
        }
        res.json(friendship);
    }
    static getFriendshipsByMe = async (req, res) => {
        if (!req?.user_id) return res.status(400).json({ 'message': 'User ID NOT FOUND' });
        const friendship = await Friendship.find({
            $or: [
                { user: req.user_id },
                { friend: req.user_id }
            ],
        });
        if (!friendship) {
            return res.status(400).json({ 'message': `Your friendships not found` });
        }
        res.json(friendship);
    }
    static createNewFriendship = async (req, res) => {
        const { friend } = req.body;
        if (!friend) return res.status(400).json({ 'message': 'friend ID required' });

        // Check duplicate relationship between user and friend
        const duplicateFriendship = await checkFriendshipExists(req.user_id, friend);
        if (duplicateFriendship) return res.status(409).json({ 'message': 'friend request or friend in friends list exists' });

        try {
            await Friendship.create({
                "user": req.user_id,
                "friend": friend,
            });
            res.status(201).json({ 'message': `friendship between User ID ${req.user_id} and User ID ${friend} created` });
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }

    }
    static updateFriendship = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Friendship ID required' });
        const friendship = await Friendship.findOne({ _id: req.params.id }).exec();
        if (!friendship) {
            return res.status(400).json({ 'message': `friendship ID ${req.params.id} not found` });
        }
        // Only admin or receiver can update friendship
        if (!(req?.role === 'admin' || req?.user_id == friendship.friend)) return res.sendStatus(401);

        if (req.body?.status) friendship.status = req.body.status;
        const result = await friendship.save();
        res.json(result);
    }
    static deleteFriendship = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Friendship ID required' });
        const friendship = await Friendship.findOne({ _id: req.params.id }).exec();
        if (!friendship) {
            return res.status(400).json({ 'message': `Friendship ID ${req.params.id} not found` });
        }
        if (!(req?.role === 'admin' || req?.user_id == friendship.user || req?.user_id == friendship.friend)) return res.sendStatus(401);

        const result = await friendship.deleteOne({ _id: req.params.id });
        res.json(result);
    }
}

module.exports = FriendshipController;