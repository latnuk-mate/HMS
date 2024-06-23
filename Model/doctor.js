const mongoose = require('mongoose')


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
        Department:{
        type: String,
        required : true 
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
    createdAt:{
        type: Date,
        default : Date.now()
    }
});

module.exports.Doctor = mongoose.model("Doctor" , DoctorSchema);