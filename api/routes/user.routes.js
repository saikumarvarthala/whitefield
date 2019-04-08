"use strict";
module.exports = function(app) {
  var userList = require("../controllers/user.controller");

  // userList Routes
  app.route("/users/createnew").post(userList.create_new_user);
  app.route("/users/login").post(userList.login_user);
  app.route("/admin/setuserstatus").post(userList.admin_set_user_status);
  app.route("/admin/getallusers").post(userList.admin_get_all_users);
  app.route("/admin/getallagents").post(userList.admin_get_all_agents);
  app
    .route("/admin/getallagentsbycity")
    .post(userList.admin_get_all_agents_by_city);
  app.route("/admin/assign/deliveryboy/toagent").post(userList.admin_assign_deliveryboy_to_agent);
  app.route("/users/get/deliveryboys/under/agent").post(userList.get_deliveryboys_under_agent);
  app.route("/users/getuserdetails").post(userList.get_user_details);
  app.route("/users/update").post(userList.updateanyrole);

};
