const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const routineSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    time: {
        type: String
    },
    weekCheck: {
        type: Object
    }
});

module.exports = mongoose.model('routine', routineSchema);
