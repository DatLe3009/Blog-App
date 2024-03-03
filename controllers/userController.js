const User = require('../model/User');
const bcrypt = require('bcrypt');
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
}

module.exports = UserController;