/* jshint esversion:6 */

// Requiring Modules //
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const favicon = require("serve-favicon");
const braintree= require("braintree");
const publicKey = dotenv.parsed.PUBLIC_KEY;
const merchantId = dotenv.parsed.MERCHANT_ID;
const privateKey = dotenv.parsed.PRIVATE_KEY;
const bcrypt = require("bcryptjs");
const expressValidator = require('express-validator');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const flash = require("connect-flash");
const product = require("./controllers/database.js")[0];
const MongoConnection = require("./controllers/database.js")[1];
const order = require("./controllers/database.js")[2];
const User = require("./controllers/database.js")[3];
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
  secret: `${dotenv.parsed.SESSION_SECRET}`,
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
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use("/admin", adminRoute);

// Intializing Controllers //

require("./controllers/routes.js")(app, product, braintree, order, bcrypt, merchantId, publicKey, privateKey);
require("./controllers/authentication.js")(app, passport, User, LocalStrategy);

// Listening Server //
app.listen(app.get("port"), function(){
  console.log(`Listening at port ${app.get("port")}`);
});
