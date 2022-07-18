const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    'moduleCode': { type:  String },
    'title': { type:  String },
    'semesters': { type:  String },
    }, {
        collection: 'Modules'
    }
)

const nusmodsData = mongoose.model('Modules', moduleSchema);

module.exports = { nusmodsData };