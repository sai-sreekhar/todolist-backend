const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    name: {
        type : String,
        required : true
    },
    phone: {
        type : String,
        required : true
    },  
    dob: {
        type : Date,
        required : false
    },
    address: {
        type : String,
        required : false
    },
    city: {
        type : String,
        required : false
    },
    state: {
        type : String,
        required : false
    },
    country: {
        type : String,
        required : false
    },
    pincode: {
        type : String,
        required : false
    },
})

module.exports = mongoose.model('Users',UserSchema);
