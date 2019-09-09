let mongoose = require('mongoose');
let developerSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: {
        fname: {
            type: String,
            required: true
        },
        lname: String
    },
    level: {
        type: String,
        required: true,
        toUpperCase: true,
        validate: {
            validator: function (value) {
                if (value.toUpperCase() === 'BEGINNER' || value.toUpperCase() === 'EXPERT') {
                    return true;
                } else {
                    return false;
                }

            },
            message: 'Should be beginner or expert'
        },
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: Number
    }
});

let developerModel = mongoose.model('developer', developerSchema);
module.exports = developerModel;