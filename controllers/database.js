/* jshint esversion:6 */
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
mongoose.connect(`${dotenv.parsed.CONNECTION_STRING}`);

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

var productId = mongoose.Schema({
    item_id : mongoose.Schema.Types.ObjectId,
    qty : Number
});

var OrderSchema = mongoose.Schema({
    username : String,
    email : String,
    contact : Number,
    address : String,
    city : String,
    state : String,
    postalCode : Number,
    password : String,
    trasactionId : String,
    amount : Number,
    createdAt : String,
    products : [productId]
});

var UserSchema = mongoose.Schema({
  username : String,
  password : String,
  email : String,
  contact : Number,
  address : String,
  city : String,
  state : String,
  postalCode : Number,

});

var order = mongoose.model("order", OrderSchema);

var product = mongoose.model("product", ProductSchema);

var user = mongoose.model("user", UserSchema);

module.exports = [product , mongoose.connection, order, user];
