/* jshint esversion:6 */

const router = require('express').Router();
const mongoose = require('mongoose');
const product = require("./database")[0];

router.get("/",function(req,res){
  var collections = mongoose.connection.collections;
  var names = [];

  Object.keys(collections).forEach(function(k) {
      names.push(k);
  });
  console.log(names);
  res.render("admin/adminIndex", {"collections" : names});
});

router.get("/collection",function(req,res){

  if(req.query.name === "products"){
    collection = product;
  }else{
    res.status(404).send("NOT FOUND");
  }
  collection.find({},function(err,data){
    if(err) throw err;
    res.render("admin/collection", {"data" : data , "collection" : req.query.name});
  });

});

router.post("/collection/add",function(req,res){
  var pro = product({
    name : req.body.name,
    price : parseInt(req.body.price),
    description : req.body.description,
    img : req.body.img,
    stock : parseInt(req.body.stock)
  });
  pro.save(function(err,data){
    if(err) throw err;
    res.redirect("/admin/collection?name=products");
  });
});


module.exports = router;
