const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String},
    email: { type: String},
    password: { type: String},
    posts: [
        {
            postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
            post: {type: String},
            created: {type: Date, default: Date.now()}
        }
    ],
    following: [
        {userFollowed: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}}
    ],
    followers: [
        {follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}}
    ],
    notifications: [
        {
            senderId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            message: {type: String},
            viewProfile: {type: Boolean, default: false},
            created: {type: Date, default: Date.now()},
            read: { type: Boolean, default: false},
            date: { type: String, default: ''}
        }
    ],
    picVersion: { type: String, default: '1590047677' },
    picId: {type: String, default: '3a52978c16c9b0e1a2d19a0b16b94f1b_vyc6sk.jpg'},
    photos: [
        {
            imgId: {type: String, default: ''},
            imgVersion: {type: String, default: ''}
        }
    ]
});

module.exports = mongoose.model('User', userSchema);