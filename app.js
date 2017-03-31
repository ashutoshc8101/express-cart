/* jshint esversion:6 */

// Requiring Modules //
const express = require('express');

// Configuring App //
const app = express();
app.set("port", process.env.PORT || 8101);

// Intializing Controllers //

require("./controllers/routes.js")(app);

// Listening Server //
app.listen(app.get("port"), function(){
  console.log(`Listening at port ${app.get("port")}`);
});
