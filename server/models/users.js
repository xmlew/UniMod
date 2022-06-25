const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userDataSchema = new mongoose.Schema({
    'username': String,
    'password': String,
    'modules': Array
});

const users = mongoose.model('User Info', userDataSchema);
module.exports = users;