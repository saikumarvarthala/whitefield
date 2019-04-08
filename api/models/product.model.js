"use strict";
var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);


var ProductSchema = new Schema(
  {
    productName:{
        type:String
    },
    shortDescription:{
        type:String
   },
   description:{
     type:String
   },
   imageUrl:{},
    categoryId:{
        type: Schema.ObjectId,
        ref: 'Category'
    },
    stockSize:{
        type:Number
    },
    offerPercentage: {
        type:Number,
        default:0
      },
      price: {
        type:Number,
        default:0
      },
      productID: {
        type: Number,
        default: 10000,
        unique: true
        },
        createdAt:{
            type:Date,
            default:Date.now
       },
       updatedAt:{
           type:Date
       }
  },
    
  {
    timestamps: true
  }
);

ProductSchema.plugin(autoIncrement.plugin, {
    model: 'Product',
    field: 'productID',
    startAt: 10000,
    incrementBy: 1
  });
  
module.exports = mongoose.model("Products", ProductSchema);

