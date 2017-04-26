var mongoose = require('mongoose');
var schema= mongoose.Schema;
var BookingDetailsSchema = new schema({
  BookingOwner : String,
  Location: String,
  Floor:String,
  BookingDate:String,
  StartTime:String,
  EndTime:String,
  SeatNumber:String
});

var bookingDetailsModel = mongoose.model('bookingDetails',BookingDetailsSchema,'bookingDetailsCollection');
var booking = {};
console.log("inside the schema db");
booking.addToBookingDB = function(input,callback){
  var newBook  = new bookingDetailsModel(input);
  return newBook.save(callback);
}
booking.getAllBookingsDB = function(callback){
  bookingDetailsModel.find({},callback);
}
booking.deleteReserve = function(data,callback) {
    console.log("object id is "+data);
    bookingDetailsModel.findOneAndRemove({'_id':data},callback);
}

module.exports =booking;
