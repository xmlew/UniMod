const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userDataSchema = new mongoose.Schema({
    _id: String,
    username: String,
    password: String
});

const users = mongoose.model('User Info', userDataSchema);
module.exports = users;