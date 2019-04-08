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
  Category = mongoose.model("Category");
  fs = require("fs"),
  uniqid = require("uniqid");

exports.create_new_Category = function(req, res) {
    var myToken = bearerfunc(req);
    console.log("hitting....")
    if ( myToken.userrole == "ADMIN") {
        var category = new Category(req.body);
        category.save(function(err, product) {
            if (err) {
                sendDbError(res, err);
            }
            else {
                res.json({error: false,success: true});
            }
        });
    }
}
  
exports.getcategoryById=function(req,res){
     Category.findById(req.body.id).exec(function(err,category){
        if(err){
          sendDbError(res, err);
        }
        if(category){
            res.json({result:true,category:category});
        }
        else{
            res.json({result:false})
        }
    })
}

exports.getAllcategorys=function(req,res){
  Category.find({}).exec(function(err,category){
      if(err){
        sendDbError(res, err);
      }
      if(category.length==0){
        res.json({result:false});
      }
      else{
        res.json({result:true,categorys:category})
      }
  })
}

exports.upsert=function(req,res){
  Category.findOneAndUpdate(req.body.id,req.body,{new:true},function(err,category){
      if(err){
        sendDbError(res, err);
      }
      else{
        res.json({message:"category updated successfully.",success:true});
      }
  })
}

