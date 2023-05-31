const { default: mongoose } = require("mongoose");
var db = require("../config/connection");

var wishlistschema = new mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  wishlistproductsids: [
   {
      productid: {
        type: mongoose.Types.ObjectId,
        ref:'admin'

      }
     
   }

  ],
});

module.exports = mongoose.model("wishlist", wishlistschema);
