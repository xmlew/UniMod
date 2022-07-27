const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Users = new mongoose.Schema({
    'name': String,
    'username': String,
    'password': String,
    'course': String,
    'modules': String
});

const users = mongoose.model('Users', Users);
module.exports = users;