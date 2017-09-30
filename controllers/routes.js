/* jshint esversion:6 */

const Cart = require("./Cart.js");

module.exports = function(app, product, braintree, order, bcrypt, merchantId, publicKey, privateKey){

  var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   merchantId,
    publicKey:    publicKey,
    privateKey:   privateKey,
  });

  function pCart(req){

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

  app.get("/login", function(req,res){
    res.render("auth/login", {"msg" : req.flash('signInErrors')});
  });

  app.get("/signup", function(req,res){
    res.render("auth/signup", {"msg" : req.flash('signUpErrors')});
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
    var kart = new Cart(req.session.cart ? req.session.cart : {});
    kart.generateArray();
    kart.processCart();
    req.session.cart = kart;
    var cart = req.session.cart ? req.session.cart : {};
    var am = cart.totalPrice;
    var items = req.session.cart ? req.session.cart.arr : false;
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
          bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
            var or = new order({
              username : req.body.name,
              email : req.body.email,
              contact : req.body.telephone,
              address : req.body.address,
              city : req.body.City,
              state : req.body.state,
              postalCode : req.body.postal,
              password : hash,
              trasactionId : result.transaction.id,
              amount : result.transaction.amount,
              createdAt : result.transaction.createdAt,
            });
            or.save(function(err,data){
              for(i=0;i<items.length;i++){
              data.products.push({
                item_id : items[i].item._id,
                qty : items[i].qty
              });
              }
              data.save(function(err,data){
                if(err) throw err;
                delete req.session.cart;
                res.redirect("/");
              });
            });
          });
          });
        });

      }else{
        res.render("checkout", {"items" : items, "cart" : req.session.cart, "errors" : result.array(), "predata" : req.body});
      }

    });
  });

  app.get("*", function(req, res){
    res.send("NOT FOUND", 404);
  });

};
