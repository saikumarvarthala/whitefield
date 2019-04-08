// generating client secret -> Convert 'indiabuyspanel' to A1Z26 Cipher
const CLIENT_SECRET = "914491221251916114512";

// Import Packages:
const express = require("express"),
  cors = require("cors"),
  app = express(),
  port = process.env.PORT || 4040,
  ip = "0.0.0.0",
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  fs = require("fs"),
  expressjwt = require("express-jwt"),
  jwt = require("jsonwebtoken");

// Import Database Models:
require("./api/models/user.model");
require("./api/models/product.model");
require("./api/models/category.model");
require("./api/models/order.model");

// Connect to MongoDB
var dbURI = "mongodb://root:root12@ds133256.mlab.com:33256/whitefield";
mongoose.connect(dbURI);
mongoose.connection.on("error", function(err) {
  console.log("Mongo connection error: " + err);
});
mongoose.connection.on("connected", function() {
  console.log("Mongo connected");
});

// Body Parser Enable
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS Support Enable:
app.use(cors());

// Unprotected Paths:
const unprotected = [
  "/",
  "/users/createnew",
  "/users/login",
  "/products/createnew",
  "/products/particular",
  "/categories/createnew",
  "/users/update",
  "/products/update",
  "/category/createnew",
  "/order/createnew"
];

// Public Files
app.use("/", express.static(__dirname + "/public/"));

// JSON Web Tokens:
app.use(
  expressjwt({
    secret: CLIENT_SECRET
    // credentialsRequired: false
  }).unless({ path: unprotected })
);

app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(err.status).send({
      message: err.message,
      flag: "Unauthorized"
    });
    console.log("Original Requested URL: " + req.originalUrl);
    console.log(err.message);
    return;
  }
  next();
});

// Import Routes:
const userRouter = require("./api/routes/user.routes");
const productRouter = require("./api/routes/product.routes");
const categoryRouter = require("./api/routes/category.routes");
const orderRouter = require("./api/routes/order.routes");

// Register Routes:
userRouter(app);
productRouter(app);
categoryRouter(app);
orderRouter(app);

app.listen(port);

console.log("Server listening on port " + port);
