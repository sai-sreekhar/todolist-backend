const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    task : {
        type : String,
        required : true
    },
    isCompleted : {
        type : Boolean,
        default : false
    },
    time : {
        type : Date,
        default : Date.now
    },
})

module.exports = mongoose.model('Tasks',TaskSchema);
