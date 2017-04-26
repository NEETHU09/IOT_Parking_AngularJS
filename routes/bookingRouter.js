var express = require('express');
// var credentialsDB=require('../public/models/credentialsDB');
var bookingDB = require('../public/models/bookingDetailsBD');
var router= express.Router();

router.route('/addBookingDetails')
.post(function(req,res){
  console.log("dadsadada");
  var input = req.body;
  console.log("Inside the  route-----------"+input.bookingOwner);
  bookingDB.addToBookingDB(input,function(err,response){
    if(err){
      res.send("sorry error found");
    }
    else{
      res.json(response);
    }
  })

})

module.exports = router;
