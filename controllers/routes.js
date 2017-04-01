/* jshint esversion:6 */

const Cart = require("./Cart.js");

module.exports = function(app, product){

  app.get("/", function(req,res){
    product.find({},function(err,data){
      res.render("home", {"data" : data});
    });

  });

  app.get("/product",function(req,res){
    product.findById(req.query.id,function(err,data){
      if(err) throw err;
      res.render("product", {"data" : data});
    });
  });

  app.get("/addTOCart",function(req,res){
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    product.findById(req.query.id, function(err,data){
      if(err) throw err;
      cart.add(data, data._id);
      req.session.cart = cart;
      res.redirect("/cart");
    });
  });

  app.get("/cart", function(req,res){
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.generateArray();
    cart.processCart();
    req.session.cart = cart;
    var items = req.session.cart ? req.session.cart.arr : false;
    res.render("cart", {"items" : items, "cart" : req.session.cart});
  });

  app.get("/chgQty", function(req,res){
    if(parseInt(req.query.newQty) === 0){
      delete req.session.cart.items[req.query.id];
    }else{
    req.session.cart.items[req.query.id].qty = parseInt(req.query.newQty);
    }

    res.redirect("/cart");
  });

};
