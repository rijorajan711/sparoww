var express = require("express");
var router = express.Router();
const { response } = require("express");
var usercollection = require("../config/collection");
var {} = require("../helpers/userhelper");
var {
  home,
  userExist,
  signupInertion,
  userLogin,
  verifyemailjwt,
  OTPlogin,
  Mobilesend,
  Otpsend,
  logout,
  addtocart,
  getcartproduct,
  changeproductquantity,
  categoryboxed,
  cartproductremove,
  checkoutpage,
  adresspage,
  viewproduct,
  adresssubmition,
  changedefauladress,
  makedefaultadress,
  cardoffer,
  checkoutformdata,
  ordersuccess,
  vieworder,
  ordercancel,
  ordreturn,
  verifypayment,nextpage,previouspage,wishlist,addtowishlist,wishlistproductremove,contact,notsignup
} = require("../controller/userController");

/* GET users listing. */
router.get("/", home);
router.get("/cart", userExist, getcartproduct);
router.post("/signup", signupInertion);
router.post("/login", userLogin);
router.get("/verify", verifyemailjwt);
router.get("/otplogin", OTPlogin);
router.post("/mobilesend", Mobilesend);
router.post("/otpsend", Otpsend);
router.get("/logout", logout);
router.post("/addToCart", addtocart);
router.post("/changeProductQuantity", changeproductquantity);
router.get("/categoryboxed", categoryboxed);
router.get("/cartremove/:id", cartproductremove);
router.get("/checkout", checkoutpage);
router.get("/Adress", adresspage);
router.get("/viewproduct:id", viewproduct);
router.post("/adresssubmition", adresssubmition);
router.get("/changedefaultadress", changedefauladress);
router.post("/makedefaultadress", makedefaultadress);
router.post("/cardoffer", cardoffer);
router.post("/checkoutformdata", checkoutformdata);
router.get("/ordersuccess", ordersuccess);
router.get("/vieworder", vieworder);
router.post("/ordercancel", ordercancel);
router.post("/ordreturn", ordreturn);
router.post("/verifypayment", verifypayment);
router.get("/nextpage:page", nextpage);
router.get("/previouspage:page",previouspage)
router.get("/wishlist",userExist,wishlist)
router.post("/addTowishlist",addtowishlist)
router.get("/wishlistproductremove/:id",wishlistproductremove)
router.get("/contact",contact)
router.get("/notsignup",notsignup)

// router.post('/login',verifyLogin)

module.exports = router;
