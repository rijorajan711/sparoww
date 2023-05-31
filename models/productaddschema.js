const { default: mongoose } = require("mongoose") 
const db = require("../config/connection")

const productschema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    stoke:{
        type:String,
        required:true
    },
    imageurl:{
        type:Array,
      
    },
    orgname:{
        type:Array
    }
})

module.exports=mongoose.model('admin',productschema)