angular.module('appRoute')
.factory('mainService',function($http){
  var currentUser = {};
  function set(data){
    console.log("data"+data);
    currentUser = data;
    console.log("setdata"+currentUser);
  }
   function get(){
     return currentUser;
   }
   function setData(data){
     currentUserBookings = data;
   }
   function getData(){
     return currentUserBookings;
   }

  return{
    set: set,
    get: get,
    registerUser : function(formData){
      return $http.post('http://localhost:3000/UserRoute/addNewUser',formData);
    },
    checkCredentials: function(){
        return $http.get('http://localhost:3000/UserRoute/checkUserCredential');
    },
    addBookingDetails: function(formDetails){
    console.log(formDetails);
        return $http.post('http://localhost:3000/UserRoute/addBookingDetails',formDetails);
    },
    getAllTheBookings :function(){
      return $http.get('http://localhost:3000/UserRoute/getAllBookings');
    },
    saveBookingSeats : function(){
      return $http.post('http://localhost:3000/UserRoute/addBookingSeats');
    },
    deleteSelected:function(data){
      var id = data._id;
    return $http.delete('http://localhost:3000/UserRoute/deleteTheBooking/'+id);
  },
  getBookings : function(location,floor){
    console.log("printing location : "+location+" printing floor  : "+floor);
    return $http.get('http://localhost:3000/UserRoute/getBookingsRoute/'+location+'/'+floor);
  }
  }
})
