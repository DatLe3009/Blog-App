const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class UserController {
    static register = async (req, res) => {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ 'message': 'username, email and password are required' });

        // Check got duplicate username and email in the db
        const duplicateUsername = await User.findOne({ username: username }).exec();
        const duplicateEmail = await User.findOne({ email: email }).exec();
        if (duplicateUsername || duplicateEmail) return res.sendStatus(409); // Conflict

        try {
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
                        "role": foundUser.role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '150s' }
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

    }
}

module.exports = UserController;