"use strict";
var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
//   autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(mongoose.connection);

var OrderSchema = new Schema({
  status: {
    type: String,
    default: 'pending'
  },
//including  tax value
  grandTotal: {
    type: Number,
    integer: true
  },
  assignTo:{
    type: Schema.ObjectId,
    ref: 'User'
  },
  userNotification:[{}],
  payment:{
    transactionId:{
      type:String
    },
    paymentType:{
      type:String
    },
    paymentStatus:{
      type:Boolean,
      default:false
    }
  },
//excluding  tax value
  subTotal:{
    type:Number
  },
  paymentType:{
    type:String
  },
  taxAmount:{
    type:Number
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Number
  },
  cartItems:[],
  deliveryOption:{
    type: String,
  },
orderID: {
    type: Number,
    default: 10000,
    unique: true
},
date: {
  type: Number
},
month: {
  type: Number
},
year:{
  type:Number
},
 shippingDetails: {},
  
 createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", OrderSchema);