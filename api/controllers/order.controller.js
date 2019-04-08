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
  Order = mongoose.model("Order");
  fs = require("fs"),
  uniqid = require("uniqid");

exports.create_new_order = function(req, res) {
    var myToken = bearerfunc(req);
    console.log("hitting...."+myToken);
    if (myToken.userrole == "USER") {
      let date  = new Date(); 
      let datedata =  Date.now();
      console.log(date.getDate()+' '+(date.getMonth()+1)+' '+date.getFullYear());
      // console.log(datedata.getDate()+' '+datedata.getMonth()+1+' '+datedata.getFullYear());
      var order                   = new Order(req.body);
      order.user                  = myToken._id;
      order.status                = req.body.status;
      order.grandTotal            = req.body.grandTotal;
      order.timestamp             = req.body.timestamp;
      order.cartItems             = req.body.cartItems;
      order.shippingDetails       = req.body.shippingDetails;
      order.cardDetails           = req.body.cardDetails;
      order.deliveryOption        = req.body.deliveryOption;
      order.date                  = date.getDate();
      order.month                 = date.getMonth()+1;
      order.year                  = date.getFullYear();
      order.userNotification.push({'status':'Pending','time':datedata})
      order.save(function(err, product) {
          if (err) {
              sendDbError(res, err);
          }
          else {
              res.json({error: false,success: true});
          }
      });
    }
  }
  
exports.upsert=function(req, res) {  
  console.log('hitting........');
  console.log('fghjk'+JSON.stringify(req.body));
  if(req.body._id) {
    delete req.body._id;
  }
  Order.findByIdAndUpdate(req.body.id,req.body,{new:true}).exec(function(err,orderdata){
    if(err){
      return handleError(res);
    }
    if(!orderdata){
      res.json('no orderId found');
    }
    let datedata = new Date();
    datedata =  Date.now();
    if(req.body.status == 'Accepted'){
      orderdata.userNotification.push({'status':'Order Accepted by vendor.','time':datedata}) 
    }
    if(req.body.status == 'On the Way'){
      orderdata.userNotification.push({'status':'Your order is on the way.','time':datedata}) 
    }
    if(req.body.status == 'Delivered'){
      orderdata.userNotification.push({'status':'Your order is delivered.','time':datedata}) 
    }
    if(req.body.status == 'Cancelled'){
      orderdata.userNotification.push({'status':'Your order is cancelled,sorry for inconvenience.','time':datedata}) 
    }
    orderdata.save(function(err){
      if(err){
        res.status(400).send({
          message:'order couldn\'t placed.'
        })
      }
      else{
        res.json({success:true,message:"Your order status has been changed to "+req.body.status});
      }
    })
  })
}

exports.getorderById=function(req,res){
  Order.findById(req.body.id).exec(function(err,order){
    if(err){
      throw err;
    }
    if(order){
      res.json({result:true,order:order});
    }
    else{
      res.json({result:false});
    }
  })
}
