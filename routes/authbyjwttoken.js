var jwt = require('jsonwebtoken');

var UserModel = require("../public/models/credentialsDB");

module.exports = function(app) {

  app.get("/signout", function(req, res, next) {
    console.log("Logging out user...!");
    // req.session.destroy();
    return res.status(200).json();
  });

  app.post('/signin', function(req,res,next) {

    console.log("inside authbyjwttoken with email "+req.body.eMail);
    console.log(req.body);
    if (!req.body.eMail) {
      console.log("invalid credentials");
      res.json({
        error: "Please try with valid credentials..!"
      });
      return;
    }
    UserModel.findOneUser(req.body,
    function(err, user) {
      console.log("user is "+user);
      if (err) {
        console.log("error found");
        // logger.error("Database error in finding user, error: ", err);
        res.status(500).json({
          error: "Failed to process request, please try later..!"
        });
        return;
      }

      if (!user) {
        console.log("user is null");
        console.error('User ',req.body.eMail, ' not found..!');
        // res.status(403).json({
        //   error: "Invalid credentials...!"
        // });
        return res.status(403).json({error:"Invalid credentials...!"});
      }

      var sessionUser = {
        "userName": user.userName,
        "eMail": user.eMail,
        "userType": user.userType
      };

      // return done(null, sessionUser);
      generateJWTToken(req,res,sessionUser); //generate JWTToken

    }); //end of user find query
  });

  function generateJWTToken(req,res,user){
    console.log("***************");
    console.log(user);
    console.log("generating sessionUser token ");
    var payload = {
      eMail: user.eMail,
    };
    var secretOrPrivateKey = 'IOTsecretishere';
    var options = {
      algorithm: "HS256",
      expiresIn: 3600,
      issuer: user.eMail
    };
    console.log("payload:" ,payload);

    jwt.sign(payload, secretOrPrivateKey, options, function(err, jwtToken) {
      if (err) {
        //console.log("payload in sign:" ,payload);
        //logger.error("Error in generating auth token, error: ", err);
        res.status(500).json({
          error: "Internal error in processing request, please retry later..!"
        });
      }

      if(!jwtToken) {
        console.error("Empty token generated...!");
        // var err = new Error("Internal error in processing request, please retry later..!");
        // err.status=401;
        // throw err;
      }
      console.log("user whichis sending to controller is ");
      console.log(user);
      res.status(201).json({
        'user': user,
        'token': jwtToken
      });
      return;
    });
  }
}
