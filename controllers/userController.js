const User = require('../model/User');

const Post = require('../model/Post');
const Comment = require('../model/Comment');
const Friendship = require('../model/Friendship');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkFriendshipExists = require('../utils/checkFriendshipExists');

class UserController {
    // Features for accounts
    static register = async (req, res) => {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ 'message': 'username, email and password are required' });

        try {
            // Check got duplicate username and email in the db
            const duplicate = await User.find({
                $or: [
                    { username: username },
                    { email: email }
                ]
            }).exec();
            if (duplicate) return res.sendStatus(409); // Conflict

            // encrypt the password
            const hashedPwd = await bcrypt.hash(password, 10);

            // Create and store the new user
            await User.create({
                "username": username,
                "email": email,
                "password": hashedPwd
            });

            res.status(201).json({ 'success': `New user ${username} created` });
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static login = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ 'message': 'email and password are required' })
        try {
            const foundUser = await User.findOne({ email: email }).exec();
            if (!foundUser) return res.sendStatus(401); // Unauthorized
            // evaluate password
            const match = await bcrypt.compare(password, foundUser.password);
            if (match) {
                // create JWTs
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "username": foundUser.username,
                            "user_id": foundUser._id,
                            "role": foundUser.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '900s' }
                );
                const refreshToken = jwt.sign(
                    { "username": foundUser.username },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d' }
                )
                // Saving refreshToken with current user
                foundUser.refreshToken = refreshToken;
                await foundUser.save();

                res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }) // secure: true
                res.json({ accessToken })
            } else {
                res.sendStatus(401);
            }
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static refreshToken = async (req, res) => {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt;

        try {
            const foundUser = await User.findOne({ refreshToken }).exec();
            if (!foundUser) return res.sendStatus(403); // Forbidden
            // evaluate jwt
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) => {
                    if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
                    const accessToken = jwt.sign(
                        {
                            "UserInfo": {
                                "username": decoded.username,
                                "user_id": decoded._id,
                                "role": decoded.role
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '900s' }
                    )
                    res.json({ accessToken })
                }
            )
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static logout = async (req, res) => {
        // On client, also delete the access Token
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204);
        const refreshToken = cookies.jwt;

        try {
            // Is refreshToken in db?
            const foundUser = await User.findOne({ refreshToken }).exec();
            if (!foundUser) {
                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                return res.sendStatus(204);
            }

            // Delete refreshToken in db
            foundUser.refreshToken = '';
            await foundUser.save();
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.sendStatus(204);
    }
    // CRUD API
    static getAllUsers = async (req, res) => {
        try {
            const users = await User.find();
            if (!users || users.length === 0) return res.status(204).json({ 'message': 'No users found' });
            res.json(users);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getUser = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required' });

        try {
            const user = await User.findOne({ _id: req.params.id }).exec();
            if (!user) {
                return res.status(400).json({ 'message': `User ID ${req.params.id} NOT FOUND` })
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getUserByMe = async (req, res) => {
        if (!req?.user_id) return res.status(400).json({ 'message': 'User ID NOT FOUND' });

        try {
            const user = await User.findOne({ _id: req.user_id }).exec();
            if (!user) {
                return res.status(400).json({ 'message': `User ID ${req.user_id} NOT FOUND` })
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static updateUser = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required' });

        try {
            const user = await User.findOne({ _id: req.params.id }).exec();
            if (!user) {
                return res.status(400).json({ 'message': `User ID ${req.params.id} NOT FOUND` })
            }
            if (req.body?.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
            }
            if (req.body?.username) {
                const duplicateUsername = await User.findOne({ username: req.body.username }).exec();
                if (duplicateUsername) return res.sendStatus(409); // Conflict
                user.username = req.body.username;
            }
            const result = await user.save();
            res.json(result);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static updateUserByMe = async (req, res) => {
        if (!req?.user_id) return res.status(400).json({ 'message': 'User ID NOT FOUND' });

        try {
            const user = await User.findOne({ _id: req.user_id }).exec();
            if (!user) {
                return res.status(400).json({ 'message': `User ID ${req.user_id} NOT FOUND` })
            }
            if (req.body?.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
            }
            if (req.body?.username) {
                const duplicateUsername = await User.findOne({ username: req.body.username }).exec();
                if (duplicateUsername) return res.sendStatus(409); // Conflict
                user.username = req.body.username;
            }
            const result = await user.save();
            res.json(result);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static deleteUser = async (req, res) => {   // Delete user require delete relation of user from other table of database
        if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required' });

        try {
            const user = await User.findOne({ _id: req.params.id }).exec();
            if (!user) {
                return res.status(400).json({ 'message': `User ID ${req.params.id} NOT FOUND` })
            }
            const result = await user.deleteOne({ _id: req.params.id });
            res.json(result);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    // Advanced API
    static getPostsByUserID = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required' });
        try {
            const posts = await Post.find({ user: req.params.id });
            if (!posts || posts.length === 0) return res.status(204).json({ 'message': `No posts of user ID ${req.params.id} found` });
            res.json(posts);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getCommentsByUserID = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required' });
        try {
            const comments = await Comment.find({ user: req.params.id });
            if (!comments || comments.length === 0) return res.status(204).json({ 'message': `No comments of user ID ${req.params.id} found` });
            res.json(comments);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getFriendsByUserID = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required' });

        try {
            const friendships = await Friendship.find({
                $or: [
                    { user: req.params.id },
                    { friend: req.params.id }
                ],
                status: "accepted"
            });
            if (!friendships || friendships.length === 0) return res.status(204).json({ 'message': `No friends of user ID ${req.params.id} found` });
            res.json(friendships.map((friendship) => friendship.user == req.params.id ? { "friend": friendship.friend } : { "friend": friendship.user }));
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getUsersByQuery = async (req, res) => {
        const { username, email } = req.query;
        try {
            const query = {};
            if (username) query.username = { $regex: username, $options: 'i' };
            if (email) query.email = { $regex: email, $options: 'i' };

            const users = await User.find(query).exec();
            res.json(users);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }

    }
    static createNewFriendshipByAdmin = async (req, res) => {
        const { id, friendId } = req.params;
        if (!id || !friendId) return res.status(400).json({ 'message': 'User ID and friend ID are required' });

        try {
            // Check relationship between user and friend
            const existingFriendship = await checkFriendshipExists(id, friendId);

            if (existingFriendship) {
                if (existingFriendship.status === "accepted") {
                    return res.status(409).json({ 'message': 'friend in friends list exists' });
                }
                existingFriendship.status = "accepted";
                await existingFriendship.save();
                return res.status(201).json({ 'message': `friendship between User ID ${id} and User ID ${friendId} created` });
            } else {
                await Friendship.create({
                    "user": id,
                    "friend": friendId,
                    "status": "accepted"
                });
                return res.status(201).json({ 'message': `friendship between User ID ${id} and User ID ${friendId} created` });
            }
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static deleteFriendshipByAdmin = async (req, res) => {
        const { id, friendId } = req.params;
        if (!id || !friendId) return res.status(400).json({ 'message': 'User ID and friend ID are required' });

        try {
            const existingFriendship = await checkFriendshipExists(id, friendId);
            if (!existingFriendship) {
                return res.status(400).json({ 'message': `friendship between User ID ${id} and User ID ${friendId} NOT FOUND` });
            }
            const result = await existingFriendship.deleteOne({ _id: existingFriendship._id });
            res.json(result);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }

}

module.exports = UserController;