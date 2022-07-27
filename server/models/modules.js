const mongoose = require('mongoose');

const moduleSubscriptionSchema = new mongoose.Schema({
    'Faculty/School': { type:  String },
    'Department': { type: String },
    'Module Code': { type:  String },
    'Module Title': { type:  String },
    'Module Class': { type:  String },
    'UG': { type:  String },
    'GD': { type:  String },
    'DK': { type:  String },
    'NG': { type:  String },
    'CPE': { type:  String }
    }, {
        collection: 'Module Subscription Data'
    }
)

const modules = mongoose.model('Module Subcription Data', moduleSubscriptionSchema);

module.exports = { modules };