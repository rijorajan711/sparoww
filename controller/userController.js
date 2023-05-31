const db = require("../config/connection");
var userModel = require("../models/usermodel");
var orderModel = require("../models/orderschema");

var {
  homeproduct,
  signupinsertion,
  userlogin,
  MobileSend,
  OTPsend,
  Addtocart,
  Getcartproduct,
  Changeproductqunatity,
  Categoryboxed,
  Cartproductremove,
  Checkoutpage,
  Viewproduct,
  Adresssubmition,
  Changedefauladress,
  Makedefaultadress,
  setedadress,
  Cardid,
  Checkoutformdata,
  Vieworder,
  Ordercancel,
  Ordreturn,
  generaterazorpay,VerifyPayment, changePaymentStatus, Nextpage,Previouspage,Wishlist,Addtowishlist,Wishlistproductremove
} = require("../helpers/userhelper");
const Swal = require("sweetalert2");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const userhelper = require("../helpers/userhelper");

module.exports = {
  home: (req, res, next) => {
    homeproduct().then((data) => {
      let datas=data.userproduct
      let earbuds=data.earbuds

      var user = req.session.user;

      res.render("user/home", { user, datas,earbuds });
    });
  },

  userExist: (req, res, next) => {
    return new Promise((resolve, reject) => {
      var user = req.session.user;
      if (user) {
        next();
      }
      else{
        res.render("user/signup")
      }
    
    });
  },
  signupInertion: (req, res) => {
    signupinsertion(req.body).then((response) => {
      res.redirect("/");
    });
  },

  userLogin: (req, res) => {
    userlogin(req.body).then((response) => {
      if (response.loginStatus && response.user.status) {
        req.session.userLoggedIn = true;
        req.session.user = response.user;
        userr = req.session.user;
        res.redirect("/");
      } else if (!response.user.status) {
        res.render("user/404");
      }
    }).catch(()=>{
         res.render("user/password")
    })
  },
  verifyemailjwt: (req, res) => {
    const token = req.query.token;
    const name = req.query.name;
    const email = req.query.email;
    var password = req.query.password;
    var mobile = req.query.mobile;
   
    const secret = "mysecreatkey";

    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        console.log(err);
      } else {
        return new Promise(async (resolve, reject) => {
          password = await bcrypt.hash(password, 10);
          var userDetails = new userModel({
            username: name,
            email: email,
            password: password,
            mobile: mobile,
          });
          userDetails.save().then((response) => {
            res.redirect("/");
          });
        });
      }
    });
  },
  OTPlogin: (req, res) => {
    res.render("user/otplogin");
  },
  Mobilesend: (req, res) => {
    MobileSend(req.body);
  },
  Otpsend: (req, res) => {
    OTPsend(req.body).then((Userr) => {
      req.session.userLoggedIn = true;
      req.session.user = Userr;
      var user = req.session.user;
      res.redirect("/");
    });
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
  addtocart: (req, res) => {
    var proid = req.body.product;
    var userid = req.session.user;
   if(userid){
    
    Addtocart(userid, proid);
    res.json({added:true});
   }
   else{

    res.json({added:false})
   }
  },
  getcartproduct: (req, res) => {
    let user = req.session.user;
    let userid = req.session.user._id;
       Getcartproduct(userid).then((datas) => {
      const total = datas.reduce((total, data) => {
        return total + data.productid.price * data.quantity;
      }, 0);
 
      datas.total = total;
      
        res.render("user/cart", { user, datas });
       
    }).catch(()=>{
           res.render("user/cartempty",{user})
    })
    
  
     
    
   
  },
  changeproductquantity: (req, res) => {
    let userid = req.session.user._id;
    Changeproductqunatity(req.body, userid).then((response) => {
      res.json(response);
    });
  },
  categoryboxed: (req, res) => {
    Categoryboxed().then((data) => {
      let user=req.session.user
      let datas=data.data
      let page=data.page
  
      let totalpage=data.totalpage
      res.render("user/category-boxed", { user,datas,page,totalpage});
    });
  },
  cartproductremove: (req, res) => {
    let userid = req.session.user._id;
    const removepro = req.params.id;
 
    Cartproductremove(removepro, userid,);
    res.redirect("/cart");
  },
  checkoutpage: (req, res) => {
    let user = req.session.user;
    Checkoutpage(user._id).then((datas) => {
      let adresses = datas.adress;
      let data = datas.productotal;

      res.render("user/checkout", { user, data, adresses });
    });
  },
  adresspage: (req, res) => {
    let user = req.session.user;
    setedadress().then((datas) => {
      res.render("user/defaultadress", { user, datas });
    });
  },
  viewproduct: (req, res) => {
    let proid = req.params.id;
    let user = req.session.user;
    Viewproduct(proid).then((datas) => {
     
      res.render("user/viewproduct", {datas, user });
    });
  },
  adresssubmition: (req, res) => {
   
    Adresssubmition(req.body).then((response) => {
      if (response) {
      
        res.redirect("/Adress");
      }
    });
  },
  changedefauladress: (req, res) => {
    let user = req.session.user;
    Changedefauladress().then((datas) => {
      res.render("user/defaultadressdatapage", { datas, user });
    });
  },
  makedefaultadress: (req, res) => {
    let adressid = req.body.id;
  
    Makedefaultadress(adressid).then((data) => {
      res.json({ status: true });
    });
  },
  cardoffer: (req, res) => {
    let cardid = req.body.cardid;
    let userid = req.session.user._id;

 
    Cardid(cardid, userid).then((data) => {
      
      res.json(data);
    }).catch(()=>{
         res.json({rijo:true})
    })
  },
  checkoutformdata: (req, res) => {
    let body = req.body;
    let userid = req.session.user._id;


    Checkoutformdata(body, userid).then((data) => {
  
      let orderid = data._id;
      let total = data.deliveredto.total;
      if (body.paymentmethod == "COD") {
        res.json({ codStatus: true });
      } else {
        generaterazorpay(orderid, total).then((response) => {
       
          res.json(response);
        });
      }
    });
  },
  ordersuccess: (req, res) => {
    let user = req.session.user;
    res.render("user/ordersuccess", { user });
  },
  vieworder: (req, res) => {
    let user = req.session.user;
    Vieworder().then((datas) => {
      const maporder = datas.map((file) => {
        obj = {
          deliveredto: file.deliveredto,
          orderid: file._id,
        };

        return obj;
      });

     ;

      res.render("user/vieworder", { maporder, user });
    });
  },
  ordercancel: (req, res) => {
    let orderid = req.body;


    Ordercancel(req.body.orderid).then((data) => {
      res.json(data);
    });
  },
  ordreturn: async (req, res) => {
    let user = await orderModel.findById(req.body.orderid);

    var orderdate = user.deliveredto.date;

    var afterseven = new Date(orderdate.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (afterseven > new Date()) {
      Ordreturn(req.body.orderid).then((data) => {
        res.json(data);
      });
    } else {
      res.json({ status: false });
    }
  },
  verifypayment:(req,res)=>{
    let da=req.body['order[receipt]']
    
        VerifyPayment(req.body).then((response)=>{
             
             changePaymentStatus(da).then((response)=>{
              res.json({status:true})
             })
        }).catch((err)=>{
          res.json({status:false})
        })
  },
  nextpage:(req,res)=>{
  
         let page=req.params.page
         Nextpage(page).then((data)=>{
           let datas=data.limitdata
           let page=data.pagenum
           let totalpage=data.totalpage
           res.render("user/category-boxed", { datas,page,totalpage })
         
      }
      )

  },
  previouspage:(req,res)=>{
      let page=req.params.page
      Previouspage(page).then((data)=>{
        let datas=data.limitdata
        let page=data.pagenum
        let totalpage=data.totalpage
               res.render("user/category-boxed", { datas,page,totalpage })
      }).catch((data)=>{
         let datas=data.data
        let page=data.page
        let totalpage=1
        res.render("user/category-boxed", { datas,page,totalpage});
      })
       
      
  },
  wishlist:(req,res)=>{
    let userid=req.session.user._id
    Wishlist(userid).then((datas)=>{
   
       res.render("user/wishlist",{datas})
    }).catch(()=>{
        res.redirect("/")
    })
   
  },
  addtowishlist:(req,res)=>{
    var proid = req.body.product;
    var user=req.session.user
    if(user){

      var userid = req.session.user._id;
      Addtowishlist(proid,userid).then((response)=>{
        res.json({status:true})
      }).catch((response)=>{
        res.json({status:false})
      })
    }
    else{
      res.json({nouser:true})
    }
  },
  wishlistproductremove:(req,res)=>{
    let userid = req.session.user._id;
    const proid= req.params.id;

    
    Wishlistproductremove(proid, userid,);
    res.redirect("/wishlist");
  },
  contact:(req,res)=>{
    res.render("user/contact")
  },
  notsignup:(req,res)=>{
    res.render("user/signup")
  }
 
};
