const { default: mongoose } = require("mongoose")
const db=require("../config/connection")

const categoryschema=mongoose.Schema({
    category:{
         type:String,
         required:true
    }
})


module.exports=mongoose.model('category',categoryschema)