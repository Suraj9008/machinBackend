const { string } = require('@hapi/joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Phone: {
        type: Number,
        required: true
    },
    Address:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('userData', userSchema);