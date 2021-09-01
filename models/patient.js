const mongoose = require('mongoose');

let patientSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    fullName: {
        type: String,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    age: {type: Number, min: 0, max: 120},
    dateOfVisit: {
        type: Date,
        default: Date.now
    },
    caseDescription: {
        type: String,
        validate: {
            validator: function (newCaseDescription) {
                return newCaseDescription.length >= 10;
            },
            message: 'Case description must be at least 10 characters'
        }
    }
});

module.exports = mongoose.model('Patient', patientSchema);