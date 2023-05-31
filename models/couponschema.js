const { default: mongoose } = require("mongoose") 
const db = require("../config/connection")

const couponschema = new mongoose.Schema({
    couponid:{
        type:String,
        required:true
    },
    expiredate:{
        type:Date,
        required:true
    },
    percentage:{
        type:Number,
        required:true
    },
    maxoff:{
        type:Number,
        required:true
    },
   
   
    
})

module.exports=mongoose.model('coupon',couponschema)