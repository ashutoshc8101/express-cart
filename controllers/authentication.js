module.exports = function(app, passport, User, LocalStrategy){

  passport.serializeUser(function(user, done) {
  done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  app.post('/login', passport.authenticate('local-signin', { successRedirect: '/', failureRedirect: '/login' }));

  app.post('/signup' ,passport.authenticate("local-signup", {successRedirect: '/', failureRedirect: '/signup', failureFlash: true}));

  passport.use('local-signin',new LocalStrategy(
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username & password' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password & password' });
      }
      return done(null, user);
    });
  }
));

passport.use('local-signup',new LocalStrategy(
  {  usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  },
  function(req,username, password, done) {
     process.nextTick(function() {

    data.findOne({ email: username},function(error,result){
        if(error){
          return done(error);
        }

        if(result){
          return done(null,false, req.flash("auth_message","Email already exists.."));
        } else {
          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(password, salt);
          var new_user = new data({
            username : req.body.name,
            password : hash,
            email : req.body.email,
            contact : req.body.telephone,
            address : req.body.address,
            city : req.body.City,
            state : req.body.state,
            postalCode : req.body.postal,
          });


          new_user.save(function(err){
            if(err)
              throw err;
            return done(null, new_user);
          });

        }
        }
      );
    });
    }
    ));
  };
