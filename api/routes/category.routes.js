"use strict";
module.exports = function(app) {
  var categoryList = require("../controllers/category.controller");

  // categoryList Routes
  app.route("/category/createnew").post(categoryList.create_new_Category);
  app.route("/category/particular").post(categoryList.getcategoryById);
  app.route("/category/update").post(categoryList.upsert);
  app.route("/category/all").post(categoryList.getAllcategorys);
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
