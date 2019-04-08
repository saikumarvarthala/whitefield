"use strict";
var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  bcrypt = require("bcryptjs"),
  SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    password: {
      type: String,
      required: true
    },
    fullname: {
      type: String,
      required: false,
      default: ""
    },
    userrole: {
      type: String,
      enum: ["USER", "ADMIN", "DELIVERYBOY", "AGENT"],
      default: "USER"
    },
    userstatus: {
      type: String,
      enum: ["active", "rejected", "pending", "blocked"],
      default: "pending"
    },
    payment: {
      type: Array
    },
    city: {
      type: String,
      required: true
    },
    useremail: {
      type: String,
      required: true
    },
    userphone: {
      type: String,
      required: true
    },
    managedBy:{
      type: Schema.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

UserSchema.pre("save", function(next) {
  var user = this;

  // only hash password if it has been modified or is new
  if (!user.isModified("password")) {
    return next();
  }

  if (user.password.length >= 60) {
    return next();
  } else {
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password along with our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  }
});

// Password Verification
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);

    callback(null, isMatch);
  });
};

module.exports = mongoose.model("Users", UserSchema);
