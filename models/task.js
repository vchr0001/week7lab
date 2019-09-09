let mongoose = require('mongoose');
let taskSchema = mongoose.Schema({
    id : mongoose.Schema.Types.ObjectId,
    taskName: String,
    assignto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'developer'
    },
    due: {
        type: Date,
        default : Date.now()
    },
    status: {
        type: String,
        toUpperCase:true,
        validate: {
            validator: function (value) {
                if (value.toUpperCase() === 'INPROGRESS' || value.toUpperCase() === 'COMPLETE' ) {
                    return true;
                } else {
                    return false;
                }

            },
            message: 'Should be INPROGRESS or COMPLETE'
        },
    },
    description: String
});

let taskModel = mongoose.model("task", taskSchema);
module.exports = taskModel;