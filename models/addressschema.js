const { default: mongoose } = require("mongoose") 
const db = require("../config/connection")

const addressschema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true

    },
    state:{
        type:String,
        required:true
    },
    pin:{
        type:Number,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },    
    email:{
        
        type:String,
        required:true
      
    },
    status:{
        type:Boolean,
        default:false
    }
   
    
})

module.exports=mongoose.model('adress',addressschema)