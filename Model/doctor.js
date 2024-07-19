const mongoose = require('mongoose');


const DoctorSchema = new mongoose.Schema({
        Name : {
        type: String,
        required : true
    },
        Email : {
        type: String,
        unique: true,
        required : true,
        validate: {
            validator: function(value) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
          }
    },
        Phone:{
        type : Number,
        required: true
    },
        Date1:{
        type: String,
        required : true 
    },

        Date2:{
        type: String,
        required : true 
    },
    Image:{
        type: String,
        required : true 
    },

    License:{
        type: String,
        required: true
    },
    Academics: {
        type: String,
        require: true
    },
    Speciality: {
        type: String,
        required: true
    },
    sub_Speciality: {
        type: String
    },
    EmploymentField:{
        type: String,
        required: true
    },
    Department:{
        type: String,
        required : true 
    },
    EmploymentStatus:{
        type: String,
        required: true
    },
    EmploymentDate:{
        type: Date,
        required: true
    },
    DoctorHours1:{
        type: String,
        required: true
    },
    DoctorHours2:{
        type: String,
        required: true
    },
    DoctorFee:{
        type: Number,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    Password:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default : Date.now()
    }
});

module.exports.Doctor = mongoose.model("Doctor" , DoctorSchema);