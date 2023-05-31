const { default: mongoose } = require("mongoose");
var db = require("../config/connection");

var addcartschema = new mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  cartproductsids: [
   {
      productid: {
        type: mongoose.Types.ObjectId,
        ref:'admin'

      },
      quantity:{
        type:Number
      }

   }

  ],
});

module.exports = mongoose.model("addcart", addcartschema);
