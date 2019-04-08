const BearerModule = require("./servicemodules/bearer"),
  bearerfunc = BearerModule.bearerfunc,
  CLIENT_SECRET = BearerModule.ClientSecretKey;

// ============================
function sendDbError(response, error) {
  response.json({
    error: error.message,
    type: error.name,
    success: false
  });
}

// To send missing error of an absent field
function sendMissError(response, myString) {
  response.json({
    error: myString,
    success: false
  });
}

const mongoose = require("mongoose"),
  jwt = require("jsonwebtoken"),
  Product = mongoose.model("Products"),
  fs = require("fs"),
  uniqid = require("uniqid");

exports.create_new_product = function(req, res) {
    // var myToken = bearerfunc(req);
    // console.log("hitting....")
    // if (myToken.userrole == "ADMIN") {
        var product = new Product(req.body);
        product.save(function(err, product) {
            if (err) {
                sendDbError(res, err);
            }
            else {
                res.json({error: false,success: true});
            }
        });
    }
// }
  
exports.getProductById=function(req,res){
     Product.findById(req.body.id).exec(function(err,product){
        if(err){
            throw err;
        }
        if(product){
            res.json({result:true,produc:product});
        }
        else{
            res.json({result:false})
        }
    })
}

exports.getProducts=function(req,res){
  Product.find({}).exec(function(err,product){
     if(err){
         throw err;
     }
     if(product.length==0){
         res.json({result:true,products:[]});
     }
     else{
         res.json({result:true,products:product})
     }
 })
}

exports.upsert=function(req,res){
  Product.findByIdAndUpdate({_id:req.body.id},req.body,{new:true}).exec(function(err,product){
     if(err){
         throw err;
     }
     else{
         res.json({result:true,products:product})
     }
 })
}