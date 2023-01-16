const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routinesSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    time: {
        type: Number
    },
    day: {
        type: Sting,
    }
});

module.exports = mongoose.model('Routines', routinesSchema);
