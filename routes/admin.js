var express = require("express");
var router = express.Router();
var layout = "adminLayout";
var {
  index,
  Users,
  blocked,
  unblock,
  viewproduct,
  createproduct,
  addproductsubmit,
  editproduct,
  editedproduct,
  deleteprodut,
  createcategory,
  addcategory,
  postaddcategory,
  couponpage,newcoupon,postcoupon,couponcancel,orderlist,updatestatus,orderdetail
} = require("../controller/adminController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + file.originalname);
    console.log("fileeeeeeeee", file);
  },
});

const upload = multer({ storage: storage });

/* GET home page. */
router.get("/", index);
const cpUpload = upload.array("images", 4);
router.get("/userlist", Users);
router.get("/block/:id", blocked);
router.get("/unblock/:id", unblock);
router.get("/viewproducts", viewproduct);
router.get("/createproductpage", createproduct);

router.post("/createproductpage", cpUpload, addproductsubmit);
router.get("/editproduct/:id", editproduct);
router.post("/editproduct/:id", cpUpload, editedproduct);
router.get('/deleteproduct/:id',deleteprodut)
router.get('/createcategory',createcategory)
router.get('/addcategory',addcategory)
router.post('/addcategory',postaddcategory)
router.get("/couponpage",couponpage)
router.get("/newcoupon",newcoupon)
router.post("/newcoupon",postcoupon)
router.get("/couponcancel/:id",couponcancel)
router.get("/orderlist",orderlist)
router.post("/updatestatus",updatestatus)
router.get("/orderdetail/:id",orderdetail)
module.exports = router;
