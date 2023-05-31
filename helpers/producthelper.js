const db = require("../config/connection");
const userModel = require("../models/usermodel");
const adminModel = require("../models/productaddschema");
const categoryModel = require("../models/categoryschema");
const orderModel=require("../models/orderschema")
const couponModel=require("../models/couponschema")

module.exports = {
  Index:()=>{
          return new Promise(async(resolve, reject) => {
            let delivered=await orderModel.find({ "deliveredto.status":"delivered"}).countDocuments()
            let packed=await orderModel.find({ "deliveredto.status":"packed"}).countDocuments()
            let shipped=await orderModel.find({ "deliveredto.status":"shipped"}).countDocuments()
            let cancel=await orderModel.find({ "deliveredto.status":"cancel"}).countDocuments()
            let returnn=await orderModel.find({ "deliveredto.status":"delivered"}).countDocuments()
            data={
              delivered:delivered,
              packed:packed,
              shipped:shipped,
              cancel:cancel,
              returnn:returnn
            }
            resolve(data)

          })
  },
  userdetails: () => {
    return new Promise(async (resolve, reject) => {
      const usersD = await userModel.find();
      resolve(usersD);
    });
  },
  Block: (userid) => {
    return new Promise(async (resolve, reject) => {
      await userModel.updateOne({ _id: userid }, { $set: { status: false } });
      resolve();
    });
  },
  Unblock: (userid) => {
    return new Promise(async (resolve, reject) => {
      await userModel.updateOne({ _id: userid }, { $set: { status: true } });
      resolve();
    });
  },
  addproduct: (data, image, orgname) => {
    return new Promise((resolve, reject) => {
      let adminmodel = new adminModel({
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        quantity: data.quantity,
        stoke: data.stoke,
        imageurl: image,
      });
      adminmodel.save();
      resolve();
    });
  },
  getproduct: () => {
    return new Promise(async (resolve, reject) => {
      var product = await adminModel.find();

      resolve(product);
    });
  },
  Editproduct: (productid) => {
    return new Promise(async (resolve, reject) => {
      productdetails = await adminModel.findOne({ _id: productid });
      resolve(productdetails);
    });
  },
  Editedproduct: (data, image, id) => {
    return new Promise(async (resolve, reject) => {
      await adminModel.updateOne(
        { _id: id },
        {
          $set: {
            title: data.title,
            description: data.description,
            category: data.category,
            price: data.price,
            quantity: data.quantity,
            stoke: data.stoke,
            imageurl: image,
          },
        }
      );
      resolve();
    });
  },
  Deleteproduct: (id) => {
    return new Promise(async (resolve, reject) => {
      await adminModel.deleteOne({ _id: id });
      resolve();
    });
  },
  Postaddcategory: (body) => {
    return new Promise(async (resolve, reject) => {
      const category = body.category;
     
      const existCategory = await categoryModel.findOne({ category: category });
      if (!existCategory) {
        const categorySchema = new categoryModel({
          category: category,
        });
        categorySchema.save();

        resolve(existCategory);
      }
    });
  },
  Postcoupon:(body)=>{
    return new Promise((resolve, reject) => {
      let couponmodel =new couponModel({
         couponid:body.id,
         expiredate:body.date,
         percentage:body.percentage,
         maxoff:body.maxoffer


      })
      couponmodel.save().then((response)=>{
        resolve()
      })
    })

  },
  Newcoupon:()=>{
    return new Promise(async(resolve, reject) => {
      let  coupondetail= await couponModel.find()
     
            resolve(coupondetail)
    })
  },
  Couponcancel:(couponid)=>{
    return new Promise(async(resolve, reject) => {
       await couponModel.deleteOne({_id:couponid})
       resolve()
    })
  },
  Orderlist:()=>{
    return new Promise(async(resolve, reject) => {
      let orders=await orderModel.find()
      
      const maporder = orders.map((file) => {
        obj={
            deliveredto:file.deliveredto,
            orderid:file._id
        }
       
        return obj
      });
 
    
        
          resolve(maporder)
          
    })
  },
  Updatestatus:(orderid,status)=>{
    return new Promise(async(resolve, reject) => {
    
       await orderModel.updateOne({_id:orderid},{"deliveredto.status":status})
       let updateddorder=  await orderModel.findOne({_id:orderid})
       let updatedstatus=updateddorder.deliveredto.status
       
       resolve(updatedstatus)

    })
  },
  Orderdetail:(orderid)=>{
    return new Promise(async (resolve, reject) => {
      let orderdetails=await orderModel.findById(orderid).populate("productids.productid")
     
      let orderdetail=orderdetails.productids
      let deliveredto=orderdetails.deliveredto
      let obj={
        orderdetail:orderdetail,
        deliveredto:deliveredto
      }
      resolve(obj)
       
    })
  }
};
