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
    weekChecked: {
        type: Object
    }
});

module.exports = mongoose.model('routine', routineSchema);
