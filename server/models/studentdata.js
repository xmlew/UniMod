const mongoose = require('mongoose');

const studentData = new mongoose.Schema({
    'Course' : { String },
    'Sem1' : { Array },
    'Sem2' : { Array }
    }, {
        collection: 'studentData'
    }
)

const students = mongoose.model('studentData', studentData);

module.exports = { students };