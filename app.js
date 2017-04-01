/* jshint esversion:6 */

// Requiring Modules //
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const favicon = require("serve-favicon");
const braintree= require("braintree");
const bcrypt = require("bcryptjs");
const expressValidator = require('express-validator');
const product = require("./controllers/database.js")[0];
const MongoConnection = require("./controllers/database.js")[1];
const order = require("./controllers/database.js")[2];
const adminRoute = require("./controllers/adminRoutes.js");

// Configuring App //
const app = express();
app.set("port", process.env.PORT || 8101);
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extended : false}));
app.use(expressLayouts);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(session({
  secret: '45tgu8i7654eruhbgu',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 600089000},
   store: new MongoStore({
     mongooseConnection : MongoConnection,
     ttl: 14 * 24 * 60 * 60,
     autoRemove: 'native',
   })
}));

app.use(expressValidator());

app.use(favicon("./public/favicon.ico"));

app.use("/admin", adminRoute);

// Intializing Controllers //

require("./controllers/routes.js")(app, product, braintree, order, bcrypt);

// Listening Server //
app.listen(app.get("port"), function(){
  console.log(`Listening at port ${app.get("port")}`);
});
