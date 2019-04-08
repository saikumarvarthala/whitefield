"use strict";
module.exports = function(app) {
  var productList = require("../controllers/product.controller");

  // productList Routes
  app.route("/products/createnew").post(productList.create_new_product);
  app.route("/products/particular").post(productList.getProductById);
  app.route("/products/list").post(productList.getProducts);
  app.route("/products/update").post(productList.upsert);
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
