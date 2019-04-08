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
  User = mongoose.model("Users"),
  fs = require("fs"),
  uniqid = require("uniqid");

exports.create_new_user = function(req, res) {
  var fields = [
    "username",
    "password",
    "fullname",
    "userrole",
    "useremail",
    "userphone",
    "city"
  ];
  var missCount = 0;

  for (var i in fields) {
    if (!req.body[fields[i]]) {
      res.json({error: "No " + fields[i] + " found",success: false});
      missCount++;
      break;
    }
  }
  if (missCount == 0) {
    User.findOne({username: req.body.username},function(err, user) {
        if (err) {
          res.json({error: err.message,type: err.name});
        } 
        else {
          if (user) {
            res.json({error: "User name already exists",success: false});
          } 
          else {
            User.findOne({useremail: req.body.useremail},function(err, user2) {
                if (err) {
                  res.json({error: err.message,type: err.name});
                } 
                else {
                  if (user2) {
                    res.json({error: "User email already exists",success: false});
                  } 
                  else {
                    var newUser = new User(req.body);
                    newUser.save(function(err, newuser) {
                      if (err) {
                        sendDbError(res, err);
                      } 
                      else {
                        res.json({error: false,success: true});
                      }
                    });
                  }
                }
              }
            );
          }
        }
      }
    );
  }
};

exports.login_user = function(req, res) {
  var inputusername = req.body.useremail;
  var inputpassword = req.body.password;

  if (inputusername == null) {
    res.json({error: "Error! Username has not been entered"});
  } 
  else if (inputpassword == null) {
    res.json({error: "Error! Password has not been entered"});
  } 
  else {
    User.findOne({ useremail: inputusername }, function(err, user) {
      if (err) res.send(err);
      if (user) {
        // test a matching password:
        user.comparePassword(inputpassword, function(err, isMatch) {
          if (err) res.send(err);
          if (!isMatch) {
            res.json({error: true,access: "Access denied - username and password are incorrect",match: isMatch,inputusername: inputusername});
          }
          if (isMatch) {
            var myToken = jwt.sign({ username: inputusername, userrole: user.userrole },CLIENT_SECRET);
            res.json({error: false,access: "Access granted - username and password are correct",match: isMatch,inputusername: inputusername,accesstoken: myToken,userrole: user.userrole,userfullname: user.fullname});
          }
        });
      }
      if (!user) {
        res.json({error: true,errormsg: "ERROR: User does NOT exist!"});
      }
    });
  }
};

exports.admin_set_user_status = function(req, res) {
  var myToken = bearerfunc(req);
  if (myToken.userrole != "ADMIN") {
    res.json({error: true,success: false,message: "You do not have the necessary admin privileges."});
  } 
  else {
    if (!req.body.userstatus ||(req.body.userstatus !== "rejected" &&req.body.userstatus !== "pending" &&req.body.userstatus !== "active" &&req.body.userstatus !== "blocked")) {
      res.json({error: "Status is missing or isn't valid",success: false});
    } 
    else {
      User.findOneAndUpdate({_id: req.body.id},
        {
          $set: {
            userstatus: req.body.userstatus
          }
        },
        {
          new: true
        },function(err, user) {
          if (err) {
            sendDbError(res, err);
          } 
          else {
            res.json({success: true,error: false,message:"Changed the status of " +user.username +" to " +user.userstatus});
          }
        }
      );
    }
  }
};

exports.updateanyrole = function(req, res) {
  var myToken = bearerfunc(req);
  if (myToken.userrole != "ADMIN") {
    res.json({error: true,success: false,message: "You do not have the necessary admin privileges."});
  } 
  else {
    if (!req.body.userstatus ||(req.body.userstatus !== "rejected" &&req.body.userstatus !== "pending" &&req.body.userstatus !== "active" &&req.body.userstatus !== "blocked")) {
      res.json({error: "Status is missing or isn't valid",success: false});
    } 
    else {
      User.findOneAndUpdate({_id: req.body.id},req.body,{new: true},function(err, user) {
          if (err) {
            sendDbError(res, err);
          } 
          else {
            res.json({success: true,error: false,message:"Changed the status of " +user.username +" to " +user.userstatus});
          }
        }
      );
    }
  }
};

exports.admin_get_all_users = function(req, res) {
  var myToken = bearerfunc(req);
  if (myToken.userrole != "ADMIN") {
    res.json({error: true,success: false,message: "You do not have the necessary admin privileges."});
  } 
  else {
    User.find({}, function(err, docs) {
      if (err) {
        sendDbError(res, err);
      } else {
        res.json({success: true,error: false,message: "Sent all documents",users: docs});
      }
    });
  }
};


exports.admin_get_all_agents = function(req, res) {
  var myToken = bearerfunc(req);
  if (myToken.userrole != "ADMIN") {
    res.json({error: true,success: false,message: "You do not have the necessary admin privileges."});
  } 
  else {
    User.find({userrole: "AGENT"},function(err, docs) {
        if (err) {
          sendDbError(res, err);
        } else {
          res.json({success: true,error: false,message: "Sent all documents",users: docs});
        }
      }
    );
  }
};

exports.admin_get_all_agents_by_city = function(req, res) {
  var myToken = bearerfunc(req);
  if (myToken.userrole != "ADMIN") {
    res.json({error: true,success: false,message: "You do not have the necessary admin privileges."});
  } 
  else if (!req.body.city) {
    res.json({error: true,success: false,message: "City not given"});
  } 
  else {
    User.find({userrole: "AGENT",city: req.body.city},function(err, docs) {
        if (err) {
          sendDbError(res, err);
        } else {
          res.json({success: true,error: false,message: "Sent all documents",users: docs});
        }
      }
    );
  }
};

exports.admin_assign_deliveryboy_to_agent = function(req, res) {
  var myToken = bearerfunc(req);
  if (myToken.userrole != "ADMIN") {
    res.json({error: true,success: false,message: "You do not have the necessary admin privileges."});
  } 
  
  else {
    User.findByIdAndUpdate(req.body.id,{ $set: { managedBy: req.body.managedBy } },function(err, doc) {
        if (err) {
          sendDbError(res, err);
        } 
        else {
          res.json({message:"Admin successfully assigned to agent.",success:true});
        }
      }
    );
  }
};

exports.get_deliveryboys_under_agent = function(req, res) {
  var myToken = bearerfunc(req);
  if (myToken.userrole != "ADMIN") {
    res.json({error: true,success: false,message: "You do not have the necessary admin or super privileges.",userrole: myToken.userrole});
  } 
  
    
    else {
      User.find({managedBy: req.body.agentId},function(err, user) {
          if (err) {
            sendDbError(res, err);
          } 
          else {
            if (user.length==0) {
              res.json({success: false,error: true,message: "No deliveryboys assigned to agent."});
            } 
            else {
              res.json({success: true,error: false,deliveryboys: user});
            }
          }
        }
      );
    }
  }

exports.get_user_details = function(req, res) {
  var rb = req.body;
  if (!rb.username) {
    sendMissError(res, "Username is not given");
  } else {
    User.findOne({username: rb.username},function(err, user) {
        if (err) {
          sendDbError(res, err);
        } 
        else {
          if (user) {
            res.json({success: true,error: false,userdetails: user});
          } 
          else {
            res.json({success: false,error: true,message: "No user found"});
          }
        }
      }
    );
  }
};
