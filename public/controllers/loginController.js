'use strict';
angular.module('appRoute')
.controller('loginController',function($scope,$timeout,mainService,authService,$q,$state,$stateParams){
  $scope.logValBD = false;
  $scope.logValLO = false;

  $scope.ShowBookSeat = true;
  $scope.HideBookSeat = false;

  $scope.logValBD = $stateParams.param1;
  $scope.logValLO = $stateParams.param2;
  $scope.ShowBookSeat = $stateParams.showSeat;
  $scope.HideBookSeat = $stateParams.HideBookSeat;
  console.log($stateParams.param1+"     "+$stateParams.param2);
  var userObj = authService.getUser();
  if(userObj != undefined){
    var userName = userObj.userName;
    $scope.currentUser = userName.substring(0,1).toUpperCase()+userName.substring(1,userName.length);
    console.log("current user is" +$scope.currentUser);
    $scope.User = userObj.eMail;
  }
  this.onlyWeekendsPredicate = function(date) {
    var myDate = new Date();
    var day = myDate.getDate();
    var month = myDate.getMonth();
    var year = myDate.getFullYear();
    if((date.getMonth() < month && date.getFullYear() <= year) ||  date.getFullYear() < year){
      return 0;
    }else if(date.getDate() < day && date.getMonth() == month ){
      return 0;
    }else{
      return 1;
    }
  };
  $scope.formdata = {};
  $scope.bookingDetails = {};
  $scope.userRole = "";
  //---------------log in function------------------------
  $scope.login = function(form1){

    console.log(form1);
    mainService.set(form1.eMail);
    authService.signIn(form1).then(function(user){
      console.log("user type is -----------"+user.userType);
      if(user.userType == 'admin'){
        $scope.logValBD = false;
              $scope.logValLO = true;
              $state.go("adminHomePage");
      }
      else{
              $scope.logValBD = true;
              $scope.logValLO = true;
              $state.go("bookSeat");
      }
        // $state.go(user.userType);
    },function(err) {
      console.log("error:",err);
      $scope.errorMessage = err.error;
    });
  }


  //---------------------Rgister a New User-------------------------
  $scope.registerNewUser = function(form){
    console.log("================entering inside the contorller============");
    console.log(form.eMail);
    $scope.formdata.userName = form.userName;
    $scope.formdata.eMail = form.eMail;
    $scope.formdata.password = form.password;
    console.log($scope.formdata.password);
    $scope.formdata.userType = "user";
    mainService.checkCredentials().success(function(data){
      var flag1 = 0;
      for (var i = 0; i < data.length; i++) {
        if(data[i].eMail == form.eMail){
          flag1 = 1;
        }
      }
      if(flag1 == 1){
        form.userName = "";
        form.eMail = "";
        form.password = "";
        form.retypPassword = "";
        $scope.errorMessage  = "User already exist with Username";
        console.log($scope.userExist);
      }
      else if(form.password != form.retypPassword){
        console.log($scope.form.userName);
        form.password = "";
        form.retypPassword = "";
        $scope.errorMessage  = "Password Mismatch";
      }
      else{
        $scope.errorMessage  = "";
        form.userName = "";
        form.eMail = "";
        form.password = "";
        form.retypPassword = "";
        mainService.registerUser($scope.formdata).success(function(data){
          swal("Good job!", "You are Successfully registered.", "success");
          $state.go("login");
        })
      }
    })
  }

  $scope.currentUserName = "";
  mainService.checkCredentials().success(function(response){
    for (var i = 0; i < response.length; i++) {
      if(response[i].eMail == $scope.currentUser){
        $scope.currentUserName = response[i].userName.substring(0,1).toUpperCase() + response[i].userName.substring(1,response[i].userName.length);
      }

    }
  })
  //------------------Booking Details----------------------
  $scope.bookTheSeat =  function(bookingData){
    console.log(bookingData);

    function parseDate(str) {
      var date = new Date(str),
      mnth = ("0" + (date.getMonth()+1)).slice(-2),
      day  = ("0" + date.getDate()).slice(-2);
      return [ date.getFullYear(), mnth, day ].join("-");
    }
    console.log("booking owner is "+$scope.User);
    $scope.bookingDetails.BookingOwner = $scope.User;
    $scope.bookingDetails.Location = bookingData.name;
    console.log("location is "+$scope.bookingDetails.Location);

    $scope.bookingDetails.Floor = bookingData.Floor.name;
    $scope.bookingDetails.BookingDate = parseDate(bookingData.BookingDate);
    $scope.bookingDetails.StartTime = bookingData.StartTime.name;
    $scope.bookingDetails.EndTime = bookingData.EndTime.name;
    //-----------------splitting time-------------
    var userStartTime = $scope.bookingDetails.StartTime.split(":");
    var userStartTimeHour = parseInt(userStartTime[0]);
    var userStartTimeMinute = parseInt(userStartTime[1]);

    var userEndTime = $scope.bookingDetails.EndTime.split(":");
    var userEndTimeHour = parseInt(userEndTime[0]);
    var userEndTimeMinute = parseInt(userEndTime[1]);
    var checkBooking = 0;

    if((userStartTimeHour > userEndTimeHour) || (userStartTimeHour == userEndTimeHour && userStartTimeMinute >=userEndTimeMinute)){
      swal("Booking status!", "Start Time should be less than the End Time", "warning");
    }
    else{
      mainService.getAllTheBookings().success(function(response){

        $scope.bookingOfZoneArray = [];
        $scope.seatNames = [];
        for (var i = 0; i < response.length; i++) {
          var responseStartTime = response[i].StartTime.split(":");
          var responseStartTimeHour = parseInt(responseStartTime[0]);
          var responseStartTimeMinute = parseInt(responseStartTime[1]);
          var responseEndTime = response[i].EndTime.split(":");
          var responseEndTimeHour = responseEndTime[0];
          var responseEndTimeMinute = responseEndTime[1];
          // var checkBooking = 0;
          var checkRoomBookingSameUser = 0;
          var checkRoomBookingDiffUser = 0;
          var checkZoneBookingSameUser = 0;
          var checkZoneBookingDiffUser = 0;
                if(response[i].BookingDate == $scope.bookingDetails.BookingDate &&  response[i].BookingOwner == $scope.bookingDetails.BookingOwner){
                  if(
                    (  (  ( userStartTimeHour == responseStartTimeHour && userStartTimeMinute >= responseStartTimeMinute) ||(userStartTimeHour > responseStartTimeHour)  ) &&  (  ( userStartTimeHour == responseEndTimeHour && userStartTimeMinute < responseEndTimeMinute) ||(userStartTimeHour < responseEndTimeHour)  ) ) ||
                    (  (  ( userEndTimeHour == responseStartTimeHour && userEndTimeMinute > responseStartTimeMinute) ||(userEndTimeHour > responseStartTimeHour)  )  &&   (  ( userEndTimeHour == responseEndTimeHour && userEndTimeMinute <= responseEndTimeMinute) ||(userEndTimeHour < responseEndTimeHour)  ) )||
                    (  (  (  userStartTimeHour == responseStartTimeHour && userStartTimeMinute < responseStartTimeMinute) || userStartTimeHour < responseStartTimeHour )  &&    (  (userEndTimeHour == responseEndTimeHour && userEndTimeMinute > responseEndTimeMinute) || userEndTimeHour > responseEndTimeHour )  ) ){
                      checkZoneBookingSameUser = 1;
                      console.log("user already booked another room for this time slot"+response[i].StartTime+"  TO  "+response[i].EndTime);
                      break;
                    }
                  }
                  else if(response[i].BookingDate == $scope.bookingDetails.BookingDate &&  response[i].BookingOwner != $scope.bookingDetails.BookingOwner){
                    if( (response[i].Location == $scope.bookingDetails.Location)&& (response[i].Floor == $scope.bookingDetails.Floor) ){
                      $scope.bookingOfZoneArray.push(response[i]);
                    }
                  }
              }
              // else{
                if(checkZoneBookingSameUser == 1){
                  swal("Booking status!", "Sorry you have already booked the seat for this time slot", "error");
                }
                else{
                  var seat = 0;
                  var userSeat = "";
                  var arr = $scope.seatNames;
                  var arrLast = arr[arr.length-1];
                  //console.log("++++++++++++++++++++++++++"+userSeat);
                  $scope.seatNames = $scope.seatNames.sort();
                  if($scope.bookingOfZoneArray.length == 0){
                    for (var a = 0; a < 11 ; a++) {
                      userSeat =  $scope.bookingDetails.Floor.charAt(0)+"A"+a;
                    }
                  }
                  // console.log("++++++++++++++++++++++++++"+userSeat);
                  // else {
                  //   //-----logic for checking for availabilty of seat for the user's time selected
                  //   var seatsArr = [];
                  //   var arrayOfSingleSeat = [];
                  //   for (var l = 0; l < 10 ; l++) {
                  //     arr[l] = $scope.bookingDetails.Floor.charAt(0)+"B"+l;
                  //   }
                  //   console.log(arr);
                  //   var checkForSeat = 0;
                  //   for (var i = 0; i < 5; i++) {
                  //     for (var j = 0; j < $scope.bookingOfZoneArray.length; j++) {
                  //       console.log($scope.bookingOfZoneArray[j].SeatNumber);
                  //       if(arr[i] ==  $scope.bookingOfZoneArray[j].SeatNumber){
                  //         console.log("arr[i] is "+arr[i]);
                  //         arrayOfSingleSeat.push($scope.bookingOfZoneArray[j]);
                  //       }
                  //     }
                  //
                  //     for (var k = 0; k < arrayOfSingleSeat.length; k++) {
                  //       // checkForSeat = 0;
                  //       console.log("user startTime "+$scope.bookingDetails.StartTime+"     user EndTime "+$scope.bookingDetails.EndTime+"        ");
                  //       console.log("response StartTime "+arrayOfSingleSeat[k].StartTime+" response end Time "+arrayOfSingleSeat[k].EndTime+"   user seat "+arrayOfSingleSeat[k].SeatNumber);
                  //       var responseStartTime = arrayOfSingleSeat[k].StartTime.split(":");
                  //       var responseStartTimeHour = parseInt(responseStartTime[0]);
                  //       var responseStartTimeMinute = parseInt(responseStartTime[1]);
                  //       var responseEndTime = arrayOfSingleSeat[k].EndTime.split(":");
                  //       var responseEndTimeHour = responseEndTime[0];
                  //       var responseEndTimeMinute = responseEndTime[1];
                  //
                  //       if(  ( userStartTimeHour == responseStartTimeHour && userStartTimeMinute == responseStartTimeMinute)  || ( userEndTimeHour == responseEndTimeHour && userEndTimeMinute == responseEndTimeMinute) ||
                  //       (  (  ( userStartTimeHour == responseStartTimeHour && userStartTimeMinute >= responseStartTimeMinute) ||(userStartTimeHour > responseStartTimeHour)  ) &&  (  ( userStartTimeHour == responseEndTimeHour && userStartTimeMinute < responseEndTimeMinute) ||(userStartTimeHour < responseEndTimeHour)  ) ) ||
                  //       (  (  ( userEndTimeHour == responseStartTimeHour && userEndTimeMinute > responseStartTimeMinute) ||(userEndTimeHour > responseStartTimeHour)  )  &&   (  ( userEndTimeHour == responseEndTimeHour && userEndTimeMinute <= responseEndTimeMinute) ||(userEndTimeHour < responseEndTimeHour)  ) )||
                  //       (  (  (  userStartTimeHour == responseStartTimeHour && userStartTimeMinute < responseStartTimeMinute) || userStartTimeHour < responseStartTimeHour )  &&    (  (userEndTimeHour == responseEndTimeHour && userEndTimeMinute > responseEndTimeMinute) || userEndTimeHour > responseEndTimeHour )  ) ){
                  //         checkForSeat = 1;
                  //         console.log("seat not available "+arrayOfSingleSeat[k]);
                  //
                  //       }
                  //     }
                  //     if(checkForSeat == 0){
                  //       console.log("available seat is   "+arr[i]);
                  //       userSeat = arr[i];
                  //       break;
                  //     }
                  //     else{
                  //       console.log("this seat is not available --- "+arr[i]);
                  //       checkForSeat = 0;
                  //       arrayOfSingleSeat = [];
                  //     }
                  //   }
                  // }
                  //-------------set the seat Number for this user---------------

                  if(userSeat != ""){
                    //-----if seat is available-----------------
                    $scope.bookingDetails.SeatNumber = userSeat;
                    mainService.addBookingDetails($scope.bookingDetails).success(function(response){
                      swal("Booking status!", "Successfully Booked Your Seat", "success");
                    })
                  }
                  else{
                    //-----------------seat is not available-------------
                    swal("Booking status!", "Sorry !..This slot is already booked.", "warning");

                  }
                }
              // }
            })

          }
        }

        $scope.currentUserBookings = [];
        $scope.showBookingDetails = function(){
          $scope.logValBD = false;
          $scope.logValLO = true;
          $state.go("bookingDetails",{param1:$scope.logValBD,param2:$scope.logValLO});
        }



        /* @@@@@@@@@@@@@@@@@@@@@Code of angular material@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
        this.userState = '';
        this.states = ('Desk Booking,Room Booking').split(',').map(function (state) { return { abbrev: state }; });
        $scope.bType = null;
        $scope.bTypes = null;
        $scope.loadbTypes = function() {
          return $timeout(function() {

            $scope.bTypes =  $scope.bTypes  || [
              { id: 1, name: 'Electronic City' },
              { id: 1, name: 'Whitefield' },
              { id: 1, name: 'Sarjapur' },
              { id: 1, name: 'Koramangala' }
            ];
          }, 350);
        };
        $scope.Floor = null;
        $scope.Floors = null;
        $scope.loadFloors = function() {
          return $timeout(function() {
            $scope.Floors =  $scope.Floors  || [
              { id: 1, name: 'Ground Floor' },
              { id: 2, name: '1st Floor' },
              { id: 3, name: '2nd Floor' },
              { id: 4, name: '3rd Floor' }
            ];
          }, 350);
        };

                $scope.Time = null;
                $scope.Times = null;
                $scope.loadTimes = function() {
                  return $timeout(function() {
                    $scope.Times =  $scope.Times  || [
                      { id: 1, name: '9:00' },
                      { id: 2, name: '9:30' },
                      { id: 3, name: '10:00' },
                      { id: 4, name: '10:30' },
                      { id: 5, name: '11:00' },
                      { id: 5, name: '11:30' },
                      { id: 5, name: '12:00' },
                      { id: 5, name: '12:30' },
                      { id: 5, name: '13:00' },
                      { id: 5, name: '13:30' },
                      { id: 5, name: '14:00' },
                      { id: 5, name: '14:30' },
                      { id: 5, name: '15:00' },
                      { id: 5, name: '15:30' },
                      { id: 5, name: '16:00' },
                      { id: 5, name: '16:30' },
                      { id: 5, name: '17:00' },
                      { id: 5, name: '17:30' },
                      { id: 5, name: '18:00' },
                      { id: 5, name: '18:30' },
                      { id: 5, name: '19:00' },
                      { id: 5, name: '19:30' },
                      { id: 5, name: '20:00' },
                      { id: 5, name: '20:30' },
                      { id: 5, name: '21:00' },
                      { id: 5, name: '21:30' },
                      { id: 5, name: '22:00' },
                      { id: 5, name: '22:30' },
                      { id: 5, name: '23:00' },
                      { id: 5, name: '23:30' },
                    ];
                  }, 350);
                };
              })

        // $scope.Area = null;
        // $scope.Areas = null;
        // $scope.loadAreas = function() {
        //   return $timeout(function() {
        //     $scope.Areas =  $scope.Areas  || [
        //       { id: 1, name: 'Fareham' },
        //       { id: 2, name: 'Swindon' },
        //       { id: 3, name: 'Cheltenham' }
        //     ];
        //   }, 350);
        // };

        // $scope.Tower = null;
        // $scope.Towers = null;
        // $scope.loadTowers = function() {
        //   return $timeout(function() {
        //     $scope.Towers =  $scope.Towers  || [
        //       { id: 1, name: 'Tower A' },
        //       { id: 2, name: 'Tower B' }
        //     ];
        //   }, 350);
        // };



        // $scope.Wing = null;
        // $scope.Wings = null;
        // $scope.loadWings = function() {
        //   return $timeout(function() {
        //     $scope.Wings =  $scope.Wings  || [
        //       { id: 1, name: 'A Wing' },
        //       { id: 2, name: 'B Wing' }
        //     ];
        //   }, 350);
        // };
        //
        // $scope.Zone = null;
        // $scope.Zones = null;
        // $scope.loadZones = function() {
        //   return $timeout(function() {
        //     $scope.Zones =  $scope.Zones  || [
        //       { id: 1, name: 'Sales' },
        //       { id: 2, name: 'HR' },
        //       { id: 3, name: 'Finance' },
        //       { id: 4, name: 'Operations' },
        //       { id: 5, name: 'Delivery' }
        //     ];
        //   }, 350);
        // };

        // $scope.RoomCapacity = null;
        // $scope.RoomCapacitys = null;
        // $scope.loadRmCapacitys = function() {
        //   return $timeout(function() {
        //     $scope.RoomCapacitys =  $scope.RoomCapacitys  || [
        //       { id: 1, name: '4 - Seater' },
        //       { id: 2, name: '8 - Seater' }
        //     ];
        //   }, 350);
        // };

        // $scope.wingSelect = function(Wing) {
        //   console.log("Wing: "+Wing.name);
        //   if(Wing.name == "A Wing"){
        //     $scope.RoomSelect = function(capacity){
        //       console.log(capacity.name);
        //       if(capacity.name == "4 - Seater"){
        //         $scope.Room = null;
        //         $scope.Rooms = null;
        //         $scope.loadRooms = function() {
        //           return $timeout(function() {
        //             $scope.Rooms =  $scope.Rooms  || [
        //               { id: 1, name: 'Crane' },
        //               { id: 2, name: 'Robin' }
        //             ];
        //           }, 350);
        //         };
        //       }
        //       else{
        //         $scope.loadRooms = function() {
        //           return $timeout(function() {
        //             $scope.Room = null;
        //             $scope.Rooms = null;
        //             $scope.Rooms =  $scope.Rooms  || [
        //               { id: 1, name: 'Peacock' }
        //             ];
        //           }, 350);
        //         };
        //       }
        //     }
        //   }
        //   else{
        //     $scope.RoomSelect = function(capacity){
        //       console.log(capacity.name);
        //       if(capacity.name == "4 - Seater"){
        //         $scope.Room = null;
        //         $scope.Rooms = null;
        //         $scope.loadRooms = function() {
        //           return $timeout(function() {
        //             $scope.Rooms =  $scope.Rooms  || [
        //               { id: 1, name: 'Sparrow' }
        //             ];
        //           }, 350);
        //         };
        //       }
        //       else{
        //         $scope.Room = null;
        //         $scope.Rooms = null;
        //         $scope.loadRooms = function() {
        //           return $timeout(function() {
        //             $scope.Rooms =  $scope.Rooms  || [
        //               { id: 1, name: 'Pigeon' }
        //             ];
        //           }, 350);
        //         };
        //       }
        //     }
        //   }
        // };
