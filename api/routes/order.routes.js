"use strict";
module.exports = function(app) {
  var orderList = require("../controllers/order.controller");

  // orderList Routes
  app.route("/order/createnew").post(orderList.create_new_order);
  app.route("/order/particular").post(orderList.getorderById);
  app.route("/order/update").post(orderList.upsert);
  // app.route("/admin/setuserstatus").post(productList.admin_set_user_status);
  // app.route("/admin/getallusers").post(productList.admin_get_all_users);
  // app.route("/admin/getallagents").post(productList.admin_get_all_agents);
  // app
  //   .route("/admin/getallagentsbycity")
  //   .post(productList.admin_get_all_agents_by_city);
  // app.route("/users/getonboardstatus").post(productList.get_user_onboard_status);
  // app.route("/users/setonboardstatus").post(productList.set_user_onboard_status);
  // app
  //   .route("/admin/assignagenttouser")
  //   .post(productList.admin_assign_agent_to_user);
  // app.route("/users/getagentsunderuser").post(productList.get_agents_under_user);
  // app.route("/users/getuserdetails").post(productList.get_user_details);
};
