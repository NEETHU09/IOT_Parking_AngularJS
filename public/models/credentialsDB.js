var mongoose = require('mongoose');
var schema= mongoose.Schema;
var credentialSchema = new schema({
  userName : String,
  eMail:String,
  password: String,
  userType:String
});

var userModel = mongoose.model('userDetail',credentialSchema,'userDetailCollection');
var user = {};

user.getAllUser = function(callback){
  userModel.find({},callback);
}
user.findOneUser = function(user,callback){
  userModel.findOne({eMail:user.eMail,password:user.password},callback);
}
user.addingUser = function(userObject,callback){
   var newUser =new userModel(userObject);
    return newUser.save(callback);
}
module.exports = user;
