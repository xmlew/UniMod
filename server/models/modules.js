const mongoose = require('mongoose');
const schema = mongoose.Schema;

const moduleSubscriptionSchema = new mongoose.Schema({
    _id: String,
    faculty: String,
    moduleCode: String,
    moduleTitle: String,
    moduleClass: String,
    UG: String,
    GD: String,
    DK: String,
    NG: String,
    CPE: String},
    { collection: 'Module Subscription Data'}
)

const modules = mongoose.model('Modules', moduleSubscriptionSchema);

module.exports = modules;