const { response } = require("express");
const categoryModel = require("../models/categoryschema");
var {
  Index,
  userdetails,
  Block,
  Unblock,
  addproduct,
  getproduct,
  Editproduct,
  Editedproduct,
  Deleteproduct,
  Postaddcategory, Postcoupon,Newcoupon,Couponcancel, Orderlist,Updatestatus, Orderdetail
  
} = require("../helpers/producthelper");
var expressejslayouts = require("express-ejs-layouts");
var layout = "adminLayout";
var userModel = require("../models/usermodel");
const {
  ContentAndApprovalsListInstance,
} = require("twilio/lib/rest/content/v1/contentAndApprovals");
const categoryschema = require("../models/categoryschema");

module.exports = {
  index:(req,res)=>{
      Index().then((datas)=>{
        console.log('daaata',datas);
        res.render("admin/index", { layout,datas })
      })
      
  },
  Users: (req, res) => {
    userdetails().then((data) => {
      res.render("admin/userlist", { layout, data });
    });
  },
  blocked: (req, res) => {
    let id = req.params.id;
    Block(id).then(() => {
      res.redirect("/admin/userlist");
    });
  },
  unblock: (req, res) => {
    let id = req.params.id;
    Unblock(id).then(() => {
      res.redirect("/admin/userlist");
    });
  },
  viewproduct: (req, res) => {
    getproduct().then((products) => {
      res.render("admin/viewproduct", { layout, products });
    });
  },

  createproduct:async (req, res) => {
    const datacategory=await  categoryModel.find()
         const Datacategory= datacategory.map((file)=>{
             return file.category
         })

    res.render("admin/addproduct", {layout,Datacategory });
  },

  addproductsubmit: (req, res) => {
    const files = req.files;

    const filename = files.map((file) => {
      return file.filename;
    });
    const orgname = files.map((file) => {
      return file.originalname;
    });
    addproduct(req.body, filename, orgname).then(() => {
      res.redirect("/admin/viewproducts");
    });
  },

  editproduct: (req, res) => {
    var id = req.params.id;
    Editproduct(id).then((productdetails) => {
      console.log(productdetails);
      res.render("admin/editproduct", { layout, productdetails });
    });
  },
  editedproduct: (req, res) => {
    var id = req.params.id;
    var files = req.files;
    const editedfilename = files.map((file) => {
      return file.filename;
    });
    Editedproduct(req.body, editedfilename, id);
    res.redirect("/admin/viewproducts");
  },
  deleteprodut: (req, res) => {
    var id = req.params.id;
    Deleteproduct(id);
    res.redirect("/admin/viewproducts");
  },
  createcategory: (req,res)=>{
    res.render('admin/managecategory',{layout})
 
    },
    addcategory:(req,res)=>{
           res.render('admin/addcategory',{layout})
    },
    postaddcategory:(req,res)=>{
        Postaddcategory(req.body).then((existCategory)=>{
            if(!existCategory){
              res.redirect("/admin/createcategory")
            }
            else{
              res.render('/admin/addcategory')
            }
        })
    },
    couponpage:(req,res)=>{
      Newcoupon().then((datas)=>{
        res.render("admin/couponpage",{layout,datas})
      })
     
    },
    newcoupon:(req,res)=>{
      
      res.render("admin/newcoupon",{layout})
 },
 postcoupon:(req,res)=>{
     let coupondata=req.body
     Postcoupon(coupondata).then((response)=>{
          res.redirect("/admin/newcoupon")
     })
 },
 couponcancel:(req,res)=>{
     let couponid=req.params.id
     console.log("coupon idddddddddd",couponid);
     Couponcancel(couponid).then((response)=>{
      res.redirect("/admin/couponpage")
     })
 },
 orderlist:(req,res)=>{
  Orderlist().then((datas)=>{
  
    res.render("admin/orderlist",{layout,datas})


  })
  
 },
 updatestatus:(req,res)=>{
      
       let userid=req.body.orderid
       let status=req.body.status
       Updatestatus(userid,status).then((response)=>{
         res.json(response)
       })
 },
 orderdetail:(req,res)=>{
        let orderid=req.params.id
        Orderdetail(orderid).then((data)=>{
          let  datas=data.orderdetail
          let deliveredto=data.deliveredto
          console.log("5555555555",deliveredto);

          res.render("admin/orderdetails",{layout,datas,deliveredto})
        })
       
 }
};
