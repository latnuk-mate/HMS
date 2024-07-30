const mongoose = require('mongoose')


const StaffSchema = new mongoose.Schema({
    Category:{
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    
    Email:{
        type: String,
        unique: true,
        required : true
    },

    Phone:{
        type: Number,
        required: true
    },

    Shift: {
        type: String,
    },

    EmpDate:{
        type: Date,
        required: true
    },
    createdAt:{
        type: Date,
        default : Date.now()
    }
});

module.exports.Staff = mongoose.model("Staff" , StaffSchema);