"use strict";
var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
//   autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(mongoose.connection);

var CategorySchema = new Schema({
    title:{
      type:String
    },
    imageId:{
      type:String
    },
    imageUrl:{
       type:String
     },
    shortDescription:{
      type:String
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

module.exports = mongoose.model("Category", CategorySchema);