const mongoose = require('mongoose');

let doctorSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    fullName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    dob: Date,
    address: {
        state: {
            type: String,
            validate: {
                validator: function (newState) {
                    return newState.length >= 2 && newState.length <= 3;
                },
                message: 'State should be 2 or 3 characters long'
            }
        },
        suburb: String,
        street: String,
        unit: Number
    },
    numPatients: {
        type: Number,
        validate: {
            validator: function (newNumPatients) {
                return newNumPatients >= 0;
            },
            message: 'Number of patients a doctor has seen should be positive'
        }
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);