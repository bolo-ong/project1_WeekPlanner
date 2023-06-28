const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const routineSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    time: {
        type: String,
        required: true
    },
    weekCheck: {
        type: Object,
        required: true
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

module.exports = mongoose.model('Routine', routineSchema);