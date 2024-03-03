const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendshipSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    friend: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending'
    }
})

module.exports = mongoose.model('Friendship', friendshipSchema);