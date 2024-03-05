const Friendship = require('../model/Friendship');

const checkFriendshipExists = async (user1, user2) => {
    const existingFriendship = await Friendship.findOne({
        $or: [
            { user: user1, friend: user2 },
            { user: user2, friend: user1 },
        ],
    }).exec();
    return existingFriendship;
}

module.exports = checkFriendshipExists;