const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    pw: {
        type: String,
        required: true
    },
    refreshToken: {
        type: [String]
    }, hacked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
