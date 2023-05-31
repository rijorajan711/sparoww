const { default: mongoose } = require("mongoose")
var db = require("../config/connection")

var otpschema = new mongoose.Schema({
 
    otpp:{
        type:String,
        required:true
    }

})

module.exports=mongoose.model('otp',otpschema)