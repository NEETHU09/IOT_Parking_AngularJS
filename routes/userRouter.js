var express = require('express');
var credentialsDB=require('../public/models/credentialsDB');
var bookingDB = require('../public/models/bookingDetailsBD');
// var operationDB = require('../public/models/operationsDB')
var router= express.Router();
router.route('/addNewUser')
.post(function(req,res){
  var form = req.body;
  credentialsDB.addingUser(form,function(err,result){
    if(err){
      res.send("sorry error found");
    }
    else{
      res.json(result);
    }
  })
})
router.route('/checkUserCredential')
.get(function(req,res){
  credentialsDB.getAllUser(function(err,result){
    if(err){
      res.send("sorry error found");
    }
    else{
      res.json(result);
    }
  })
})

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
router.route('/getAllBookings')
.get(function(req,res){
  bookingDB.getAllBookingsDB(function(err,result){
    if(err){
      res.send("sorry error found");
    }
    else{
      res.json(result);
    }
  })
})


router.route('/deleteTheBooking/:id')
.delete(function(req,res){
  console.log("inside the routes delete function");
  data = req.params.id;
  console.log(data);
  bookingDB.deleteReserve(data,function(err,result){
    if(err){
      res.send("sorry error found");
    }
    else{
      res.json(result);
    }
  })
})


module.exports = router;
