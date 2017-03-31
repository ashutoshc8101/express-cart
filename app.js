/* jshint esversion:6 */

// Requiring Modules //
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const morgan = require('morgan');
const session = require("express-session");
const product = require("./controllers/database.js")[0];
const adminRoute = require("./controllers/adminRoutes.js");

// Configuring App //
const app = express();
app.set("port", process.env.PORT || 8101);
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extended : false}));
app.use(expressLayouts);
app.use(morgan("dev"));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 6000000}
}));

app.use("/admin", adminRoute);

// Intializing Controllers //

require("./controllers/routes.js")(app, product);

// Listening Server //
app.listen(app.get("port"), function(){
  console.log(`Listening at port ${app.get("port")}`);
});
