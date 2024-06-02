const mongoose = require('mongoose')


const PatientSchema = new mongoose.Schema({
    userName : {
        type: String,
        required : true
    },
    userEmail : {
        type: String,
        unique: true,
        required : true
    },
    userPhone:{
        type : Number,
        required: true
    },
    userPass:{
        type: String,
        required : true 
    },
    createdAt:{
        type: Date,
        default : Date.now()
    }
});

module.exports.Patient = mongoose.model("Patient" , PatientSchema);