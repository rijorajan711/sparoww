const { default: mongoose } = require("mongoose") 
const db = require("../config/connection")
 
const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        
        type:String,
        required:true,
      

    },
    password:{
        type:String,
        
    },
    mobile:{
        type:Number,
      
        
    },
    otpp:{
        type:String,
       
    },
    status:{
        type:Boolean,
        default:true
    }


})

module.exports=mongoose.model('user',userSchema)