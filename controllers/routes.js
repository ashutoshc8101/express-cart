/* jshint esversion:6 */

const Cart = require("./Cart.js");

module.exports = function(app, product, braintree){

  var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'y4gcr9vq3y99mc9t',
    publicKey:    'h2tmd3xmx5tgzr6c',
    privateKey:   'e0ad3b3a3c8813bdedfba89d1f7ea835'
  });

  function pCart(req){
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.generateArray();
    cart.processCart();
    req.session.cart = cart;
  }

  app.get("/", function(req,res){
    product.find({},function(err,data){
      res.render("home", {"data" : data, "message" : false});
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
    pCart(req);
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

  app.get("/checkout", function(req,res){

    pCart(req);
    var items = req.session.cart ? req.session.cart.arr : false;
    res.render("checkout", {"items" : items, "cart" : req.session.cart, "errors" : false});
  });

  app.get("/client_token", function (req, res) {
    gateway.clientToken.generate({}, function (err, response) {
      res.send(response.clientToken);
    });
  });

  app.post("/checkout", function(req,res){
    require("./formValidation.js")(req);
    pCart(req);
    var cart = req.session.cart ? req.session.cart : {};
    var am = cart.totalPrice;
    req.getValidationResult().then(function(result) {
      if(result.isEmpty()){

        var nonceFromTheClient = req.body.payment_method_nonce;
          gateway.transaction.sale({
          amount: am,
          paymentMethodNonce: nonceFromTheClient,
          options: {
            submitForSettlement: true
          }
        }, function (err, result) {
          if(err) throw err;
          delete req.session.cart;
          console.log(result);
          res.redirect("/");
        });

      }else{
        var items = req.session.cart ? req.session.cart.arr : false;
        res.render("checkout", {"items" : items, "cart" : req.session.cart, "errors" : result.array(), "predata" : req.body});
      }

    });
  });

};
