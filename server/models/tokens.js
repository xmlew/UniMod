const mongoose = require('mongoose');

const tokenData = new mongoose.Schema({
    'username': String,
    'access': String,
    'refresh': String,
    }, {
        collection: 'tokens'
    }
)

const tokens = mongoose.model('tokens', tokenData);

module.exports = tokens;