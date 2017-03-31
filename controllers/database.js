/* jshint esversion:6 */
const mongoose = require("mongoose");

mongoose.connect("mongodb://user:password@ds123410.mlab.com:23410/shopping-cart");

mongoose.connection.once("open",function(){
  console.log("Connected to MongoDb");
});

var ProductSchema = mongoose.Schema({
  name : String,
  price : Number,
  description : String,
  img : String,
  stock : Number
});

var product = mongoose.model("product", ProductSchema);

module.exports = [product];
