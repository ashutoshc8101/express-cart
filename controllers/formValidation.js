/* jshint esversion: 6 */

module.exports = function(req){

  req.checkBody("name", "Please enter receiver name").notEmpty();
  req.checkBody("email", "Please enter a valid email").notEmpty().isEmail();
  req.checkBody("telephone", "Please enter a valid Contact No.").notEmpty().len(10,20);
  req.checkBody("address", "Please enter receiver address").notEmpty();
  req.checkBody("City", "Please enter receiver city").notEmpty();
  req.checkBody("state", "Please enter receiver state").notEmpty();
  req.checkBody("postal", "Please enter a valid postal code").notEmpty().isInt().len(6, 10);
  req.checkBody("password", "Please enter a password").notEmpty();
  req.checkBody("password", "Please enter a password between 6 to 20 characters").len(6, 20);
  req.checkBody("cpassword", "Passwords donot match").equals(req.body.password);
};
