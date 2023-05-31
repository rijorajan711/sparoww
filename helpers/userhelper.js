var userModel = require("../models/usermodel");
var productModel = require("../models/productaddschema");
const addcartModel = require("../models/addcartscheema");
const addressModel = require("../models/addressschema");
const couponModel = require("../models/couponschema");
const orderModel = require("../models/orderschema");
const wishlistModel=require("../models/wishlistschema")
const mongoose = require("mongoose");
mongoose.set('strictPopulate', false);
const db = require("../config/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const { promises } = require("nodemailer/lib/xoauth2");
const Razorpay = require("razorpay");
const { addproduct } = require("./producthelper");
const { log } = require("console");

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = {
  homeproduct: () => {
    return new Promise(async (resolve, reject) => {
      const userproduct = await productModel.find({category:"Iphone"});
      const earbuds = await productModel.find({category:"earbuds"});
       let productdata={
        userproduct:userproduct,
        earbuds:earbuds
       }
      resolve(productdata);
    });
  },
  signupinsertion: (userdata) => {
    return new Promise((resolve, reject) => {
      const name = userdata.name;
      const email = userdata.email;
      const password = userdata.password;
      const mobile = userdata.mobile;

      const user = { id: Math.floor(Math.random() * 9000 + Date.now()) };
      const secret = "mysecreatkey";
      const token = jwt.sign(user, secret, { expiresIn: "1h" });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,

        auth: {
          user: "oceansparrowww@gmail.com",
          pass: "fewvxuhjhvtenkha",
        },
      });

      const mailOptions = {
        from: "oceansparrowww@gmail.com",
        to: userdata.email,
        subject: "Verify your email address",
        text: `Please click on the following link to verify your email address:http://localhost:3000/verify?token=${token}&name=${name}&email=${email}&password=${password}&mobile=${mobile}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
        resolve();
      });
    });
  },
  userlogin: (userdata) => {
    return new Promise(async (resolve, reject) => {
      let userr = await userModel.findOne({ email: userdata.Email });

      let response = {};
      let loginStatus = false;
      if (userr) {
        await bcrypt
          .compare(userdata.Password, userr.password)
          .then((status) => {
            if (status) {
              response.user = userr;
              response.loginStatus = true;
              resolve(response);
            } else {
              reject({ loginStatus: false });
            }
          });
      } else {
        
        resolve({ loginStatus: false });
      }
    });
  },
  MobileSend: (data) => {
    return new Promise(async (resolve, reject) => {
      let Userr = await userModel.findOne({ mobile: data.mobile });
      global.Userr = Userr;
      if (Userr) {
        const accountSid = process.env.TWILIO_accountSid;
        const authToken = process.env.TWILIO_authToken;
        const client = require("twilio")(accountSid, authToken);
        const phoneNumber = `+${Userr.mobile}`;
    

        const otp = Math.floor(1000 + Math.random() * 9000);
        const message = `Your OTP code is ${otp}.`;
        global.OTP = otp;
 

        client.messages
          .create({
            body: message,
            from: "+1 475 348 8623", // replace with your Twilio phone number
            to: phoneNumber,
          })
          .then((message) => console.log(`OTP sent to ${phoneNumber}`))
          .catch((error) => console.log(`Error sending OTP: ${error.message}`));
      }

      resolve();
    });
  },
  OTPsend: (data) => {
    return new Promise((resolve, reject) => {
      var Userr = global.Userr;
      const otp = data.otp;
      const storedotp = global.OTP;
 

      if (storedotp == otp) {
        resolve(Userr);
      }
    });
  },
  Addtocart: (userid, proid) => {
    return new Promise(async (resolve, reject) => {
      const product = {
        productid: proid,
        quantity: 1,
      };
      let cartuser = await addcartModel.findOne({ userid: userid });
      let cartproductid = await addcartModel.findOne({
        "cartproductsids.productid": proid,
      });
      if (cartuser) {
        const productarray = cartuser.cartproductsids;
        const index = productarray.findIndex(
          (product) => product.productid == proid
        );
        if (index != -1) {
          await addcartModel.updateOne(
            { "cartproductsids.productid": proid, userid: userid },
            { $inc: { "cartproductsids.$.quantity": 1 } }
          );  
          resolve();
        } else {
          await addcartModel.updateOne(
            { userid: userid },
            { $push: { cartproductsids: product } }
          );
          resolve();
        }
      } else {
        let addcartmodel = new addcartModel({
          userid: userid,
          cartproductsids: product,
        });
        addcartmodel.save();
        resolve();
      }
    });
  },
  Getcartproduct: (userid) => {
    return new Promise(async (resolve, reject) => {
      addcartModel
        .findOne({ userid: userid })
        .populate("cartproductsids.productid")
        .then((data) => {
          if (data) {
            resolve(data.cartproductsids);
          } else {
            reject();
          }
        });
    });
  },

  Changeproductqunatity: (reqbody, userid) => {
    let count = parseInt(reqbody.count);

    let quantity = parseInt(reqbody.quantity);
    let price = parseInt(reqbody.Price);
    let productid = reqbody.product;

    return new Promise(async (resolve, reject) => {
      let cartid = await addcartModel.findOne({ userid: userid });

      if (count == -1 && quantity == 1) {
        await addcartModel
          .updateOne(
            { userid: userid },
            { $pull: { cartproductsids: { productid: productid } } }
          )
          .then((response) => {
            resolve({ removeproduct: true });
          });
      } else {
        let total = 0;

      
        let productsprice = (quantity + count) * price;
        let product = await addcartModel.updateOne(
          { "cartproductsids.productid": productid },
          { $inc: { "cartproductsids.$.quantity": count } }
        );
        let totalproduct = await addcartModel
          .findOne({ userid: userid })
          .populate("cartproductsids.productid");
        if (totalproduct) {
          let prodetails = totalproduct.cartproductsids;

          for (const produc of prodetails) {
            total += produc.productid.price * produc.quantity;
          }
        }

        resolve({ productsprice, removeproduct: false, total });
      }
    });
  },
  Categoryboxed: (lim) => {
    return new Promise(async (resolve, reject) => {
      const page = 1;
      const limit = 2;

      let totalproduct = await productModel.countDocuments();
      let totalpage=totalproduct/limit
      let data = await productModel.find().skip(0).limit(limit);
      let datas = {
        data: data,
        page: 1,
        totalpage:totalpage
      };
      resolve(datas);
    });
  },
  Cartproductremove: (proid, userid) => {
    return new Promise(async (resolve, reject) => {
      await addcartModel.updateOne(
        { userid: userid, "cartproductsids.productid": proid },
        { $pull: { cartproductsids: { productid: proid } } }
      );
      resolve();
    });
  },
  Checkoutpage: (userid) => {
    return new Promise(async (resolve, reject) => {
      let cartproduct = await addcartModel
        .findOne({ userid: userid })
        .populate("cartproductsids.productid");
      let onlyproduct = cartproduct.cartproductsids;
      let adress = await addressModel.find({ status: true });
      let productotal = onlyproduct.reduce((total, data) => {
        return total + data.productid.price * data.quantity;
      }, 0);
      let response = {
        adress: adress,
        productotal: productotal,
      };
      resolve(response);
    });
  },
  Viewproduct: (proid) => {
    return new Promise(async (resolve, reject) => {
      let product = await productModel.findOne({ _id: proid });
      resolve(product);
    });
  },
  Adresssubmition: (reqdata) => {
    
    return new Promise(async (resolve, reject) => {
      let adressmodel = new addressModel({
        fname: reqdata.fname,
        lname: reqdata.lname,
        country: reqdata.country,
        address: reqdata.address,
        city: reqdata.city,
        state: reqdata.state,
        pin: reqdata.pin,
        phone: reqdata.phone,
        email: reqdata.email,
      });
      adressmodel.save().then((response) => {
        resolve(response);
      });
    });
  },
  Changedefauladress: () => {
    return new Promise(async (resolve, reject) => {
      let adress = await addressModel.find();
      resolve(adress);
    });
  },
  Makedefaultadress: (adressid) => {
    return new Promise(async (resolve, reject) => {
      await addressModel.updateMany({ status: false });
      await addressModel.updateOne({ _id: adressid }, { status: true });

      resolve();
    });
  },
  Cardid: (code, userid) => {
    return new Promise(async (resolve, reject) => {
      let couponoffer = await couponModel.findOne({ couponid: code });
 
      let usercartpro = await addcartModel
        .findOne({ userid: userid })
        .populate("cartproductsids.productid");
      let cartproarray = usercartpro.cartproductsids;
      let total = cartproarray.reduce((total, data) => {
        return total + data.productid.price * data.quantity;
      }, 0);

      let datee = new Date();
     
    
      if (couponoffer.expiredate > datee) {
        let percentage = (total * couponoffer.percentage) / 100;
       
        if (percentage < couponoffer.maxoff) {
          let subtotal = total - percentage;

          let result = {
            offcash: percentage,
            subtotal: subtotal,
          };
          resolve(result);
        } else {
          let subtotal = total - couponoffer.maxoff;

          let result = {
            offcash: couponoffer.maxoff,
            subtotal: subtotal,
          };
          resolve(result);
        }
      }
      else{
        reject()
      }
    });
  },
  Checkoutformdata: (body, userid) => {
    return new Promise(async (resolve, reject) => {
      let phone = parseInt(body.phone);
      let subb = parseInt(body.subb);
      let fulltotal = parseInt(body.fulltotal);
      let total = 0;
      let date = new Date();
      if (subb != 0) {
        total = subb;
      } else {
        total = fulltotal;
      }
      let productids = await addcartModel.findOne({ userid: userid });
      let cartproductid = productids.cartproductsids;
      const mapcart = cartproductid.map((file) => {
        let obj = {
          productid: file.productid,
          quantity: file.quantity,
        };

        return obj;
      });

     
      const ordermodel = new orderModel({
        deliveredto: {
          userid: userid,
          method: body.paymentmethod,
          total: total,
          date: date,
          status: "placed",

          fname: body.fname,
          lname: body.lname,
          country: body.country,
          adress: body.adress,
          city: body.city,
          email: body.email,
          phone: body.phone,
        },
        productids: mapcart,
      });
      ordermodel.save().then(async (order) => {
        
        // await addcartModel.deleteOne({ userid: userid });
        resolve(order);
      });
    });
  },
  Vieworder: () => {
    return new Promise(async (resolve, reject) => {
      let order = await orderModel.find();
      
      resolve(order);
    });
  },
  Ordercancel: (orderid) => {
    return new Promise(async (resolve, reject) => {
      await orderModel.updateOne(
        { _id: orderid },
        { "deliveredto.status": "cancel" }
      );
      let neworderd = await orderModel.findById(orderid);

      resolve(neworderd.deliveredto.status);
    });
  },
  Ordreturn: (orderid) => {
    return new Promise(async (resolve, reject) => {
      await orderModel.updateOne(
        { _id: orderid },
        { "deliveredto.status": "return" }
      );
      let neworderd = await orderModel.findById(orderid);

      resolve(neworderd.deliveredto.status);
    });
  },
  generaterazorpay: (orderid, total) => {
    return new Promise((resolve, reject) => {
        
          
      var options = {
        amount: total*100, // amount in the smallest currency unit
        currency: "INR",
        receipt: "" + orderid,
      };
      instance.orders.create(options, function (err, order) {
      
        resolve(order);
      });
    });
  },
  VerifyPayment: (detail) => {
    return new Promise((resolve, reject) => {
    
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", "ApWG6KNV1cxyX9H3WhnNH15h");
      hmac.update(
        detail["response[razorpay_order_id]"] +
          "|" +
          detail["response[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");
      if (hmac == detail["response[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    });
  },
  changePaymentStatus: (orderid) => {

    return new Promise(async (resolve, reject) => {
      await orderModel
        .updateOne(
          { _id: orderid },
          {
            $set: {
              "deliveredto.status": "placed",
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  Nextpage: (page) => {
    return new Promise(async (resolve, reject) => {
      let pagee = parseInt(page) || 1;

      let pge = pagee + 1;
      const limit = 2;
      const totalCount = await productModel.countDocuments();
      let totalpage = totalCount / limit;

      const offset = (pge - 1) * limit;

      const limitdata = await productModel.find().skip(offset).limit(limit);

      let data = {
        pagenum: pge,
        limitdata: limitdata,
        totalpage: totalpage,
      };
      resolve(data);
    });
  },
  Previouspage: (page) => {
    return new Promise(async (resolve, reject) => {
      if (page < 1 || page == 1) {
        const limit = 2;

        let data = await productModel.find().skip(0).limit(limit);
        let datas = {
          data: data,
          page: 1,
        };

        reject(datas);
      } else {
        let pagee = parseInt(page);
        const limit = 1;
        const totalCount = await productModel.countDocuments();
        let totalpage = totalCount / limit;

        const offset = (pagee - 2) * limit;
        let pge = page - 1;
        const limitdata = await productModel.find().skip(offset).limit(limit);

        let data = {
          pagenum: pge,
          limitdata: limitdata,
          totalpage: totalpage,
        };
        resolve(data);
      }
    });
  },
  Wishlist:(userid)=>{
    return new Promise(async(resolve, reject) => {
    
         let wishlistdata=await wishlistModel.findOne({userid:userid}).populate("wishlistproductsids.productid")
        
         if(wishlistdata){
            resolve(wishlistdata.wishlistproductsids)
         }
         else{
          reject()
         }
       
    })

  },
  Addtowishlist:(proid,userid)=>{
         
        return new Promise(async(resolve, reject) => {
              let product={
                productid:proid
              }
          let wishlistuser = await wishlistModel.findOne({ userid: userid });
       
          if (wishlistuser) {
            const productarray = wishlistuser.wishlistproductsids;
            const index = productarray.findIndex(
              (product) => product.productid == proid
            );
            if (index == -1) {
              
              await wishlistModel.updateOne(
                { userid: userid },
                { $push: { wishlistproductsids:product} }
              );
              resolve();
            } else {
              reject();
            }
          } else {
            let wishlistmodel = new wishlistModel({
              userid: userid,
              wishlistproductsids:product,
            });
            wishlistmodel.save();
            resolve();
          }
        })

  },
  Wishlistproductremove: (proid, userid) => {
    
    return new Promise(async (resolve, reject) => {
      await wishlistModel.updateOne(
        { userid: userid, "wishlistproductsids.productid": proid },
        { $pull: { wishlistproductsids: { productid: proid } } }
      );
      resolve();
    });
  },
};
