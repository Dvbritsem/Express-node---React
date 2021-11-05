let mongoose = require('mongoose');
const { head } = require('../routes/afspraakRoute');

let Schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Afspraak', Schema);