const { default: mongoose } = require("mongoose");
const db = require("../config/connection");

const orderschema = new mongoose.Schema({
  deliveredto: {
    userid: {
      type: mongoose.Types.ObjectId,
    },
    method: {
      type: String,
    },
    total: {
      type: Number,
    },
    date: {
      type: Date,
    },
    status: {
      type: String,
    },

    fname: {
      type: String,
    },
    lname: {
      type: String,
    },
    country: {
      type: String,
    },
    adress: {
      type: String,
    },
    city: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
  },

  productids: [
    {
      productid: {
        type: mongoose.Types.ObjectId,
        ref: "admin",
      },
      quantity: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("order", orderschema);
