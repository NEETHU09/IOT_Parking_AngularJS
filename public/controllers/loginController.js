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
      console.log("----------------"+bookingData.Floor.name);
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
        var noSeatLeft = 0;
        for (var i = 0; i < response.length; i++) {
          var responseStartTime = response[i].StartTime.split(":");
          var responseStartTimeHour = parseInt(responseStartTime[0]);
          var responseStartTimeMinute = parseInt(responseStartTime[1]);
          var responseEndTime = response[i].EndTime.split(":");
          var responseEndTimeHour = responseEndTime[0];
          var responseEndTimeMinute = responseEndTime[1];
          var checkZoneBookingSameUser = 0;

                if(response[i].BookingDate == $scope.bookingDetails.BookingDate &&  response[i].BookingOwner == $scope.bookingDetails.BookingOwner){
                  if(
                    (  (  ( userStartTimeHour == responseStartTimeHour && userStartTimeMinute >= responseStartTimeMinute) ||(userStartTimeHour > responseStartTimeHour)  ) &&  (  ( userStartTimeHour == responseEndTimeHour && userStartTimeMinute < responseEndTimeMinute) ||(userStartTimeHour < responseEndTimeHour)  ) ) ||
                    (  (  ( userEndTimeHour == responseStartTimeHour && userEndTimeMinute > responseStartTimeMinute) ||(userEndTimeHour > responseStartTimeHour)  )  &&   (  ( userEndTimeHour == responseEndTimeHour && userEndTimeMinute <= responseEndTimeMinute) ||(userEndTimeHour < responseEndTimeHour)  ) )||
                    (  (  (  userStartTimeHour == responseStartTimeHour && userStartTimeMinute < responseStartTimeMinute) || userStartTimeHour < responseStartTimeHour )  &&    (  (userEndTimeHour == responseEndTimeHour && userEndTimeMinute > responseEndTimeMinute) || userEndTimeHour > responseEndTimeHour )  ) )
                    {
                      checkZoneBookingSameUser = 1;
                      console.log("user already booked another room for this time slot"+response[i].StartTime+"  TO  "+response[i].EndTime);
                      break;
                    }
                  }
                  else if(response[i].BookingDate == $scope.bookingDetails.BookingDate &&  response[i].BookingOwner != $scope.bookingDetails.BookingOwner){

                    if( (response[i].Location == $scope.bookingDetails.Location)&& (response[i].Floor == bookingData.Floor.name) ){
                      $scope.bookingOfZoneArray.push(response[i]);
                      console.log("Seat number "+response[i].SeatNumber);
                      $scope.seatNames.push(response[i].SeatNumber);
                    }
                  }
              }
              // else{
                if(checkZoneBookingSameUser == 1){
                  swal("Booking status!", "Sorry you have already booked the seat for this time slot *****", "error");
                }
                else{
                  var seat = 0;
                  var userSeat = "";
                  var arr = $scope.seatNames;
                  var arrLast = arr[arr.length-1];
                  var checkForSeat = 0;
                  //console.log("++++++++++++++++++++++++++"+userSeat);
                  $scope.seatNames = $scope.seatNames.sort();
                  if($scope.seatNames.length == 0){
                    userSeat = bookingData.Floor.name.charAt(0)+"A"+"01";
                    console.log("booking for the first time");
                  }
                  else{
                    console.log("Already booked and checking for next one");
                      console.log("**************************"+ $scope.bookingOfZoneArray.length);
                    for (var i = 0; i < $scope.bookingOfZoneArray.length; i++) {
                        console.log("inside for loop------------------------------");
                      var responseStartTime = $scope.bookingOfZoneArray[i].StartTime.split(":");
                      var responseStartTimeHour = parseInt(responseStartTime[0]);
                      var responseStartTimeMinute = parseInt(responseStartTime[1]);
                      var responseEndTime = $scope.bookingOfZoneArray[i].EndTime.split(":");
                      var responseEndTimeHour = responseEndTime[0];
                      var responseEndTimeMinute = responseEndTime[1];
                      if(
                        (  (  ( userStartTimeHour == responseStartTimeHour && userStartTimeMinute >= responseStartTimeMinute) ||(userStartTimeHour > responseStartTimeHour)  ) &&  (  ( userStartTimeHour == responseEndTimeHour && userStartTimeMinute < responseEndTimeMinute) ||(userStartTimeHour < responseEndTimeHour)  ) ) ||
                        (  (  ( userEndTimeHour == responseStartTimeHour && userEndTimeMinute > responseStartTimeMinute) ||(userEndTimeHour > responseStartTimeHour)  )  &&   (  ( userEndTimeHour == responseEndTimeHour && userEndTimeMinute <= responseEndTimeMinute) ||(userEndTimeHour < responseEndTimeHour)  ) )||
                        (  (  (  userStartTimeHour == responseStartTimeHour && userStartTimeMinute < responseStartTimeMinute) || userStartTimeHour < responseStartTimeHour )  &&    (  (userEndTimeHour == responseEndTimeHour && userEndTimeMinute > responseEndTimeMinute) || userEndTimeHour > responseEndTimeHour )  ) ){
                            checkForSeat = 1;
                            console.log("CHECKING FOR SEAT NNUMBER : -------------"+$scope.bookingOfZoneArray[i].SeatNumber);
                            console.log("userstarttime = "+(userStartTimeHour)+":"+userStartTimeMinute+"     responseStart  = "+responseStartTimeHour+":"+responseStartTimeMinute+" responseEnd"+responseEndTimeHour+":"+responseEndTimeMinute);
                            console.log("userstarttime = "+(userStartTimeHour)+":"+userStartTimeMinute+"    responseStart  = "+responseStartTimeHour+":"+responseStartTimeMinute+" responseEnd"+responseEndTimeHour+":"+responseEndTimeMinute);


                        }
                        if(checkForSeat == 0){
                            console.log("seat is available****************************** ");
                            userSeat = $scope.bookingOfZoneArray[i].SeatNumber;
                            break;
                        }
                        checkForSeat = 0;
                    }

                    if(userSeat == ""){
                      var lastSeat = $scope.seatNames[$scope.seatNames.length-1] ;
                      var s = parseInt(lastSeat.substring(2,4));
                      if(lastSeat.charAt(1)== "J" && s == 10){
                          noSeatLeft = 1;
                      }
                      else if( s == 10){

                        var incRow = lastSeat.charAt(1)+"";
                        console.log("PRINTING THE CHARACTER OF ROW : "+incRow );
                        incRow = String.fromCharCode(incRow.charCodeAt(0) + 1);
                        console.log("PRINTING THE CHARACTER OF ROW CONVERTED : "+incRow);
                        userSeat = bookingData.Floor.name.charAt(0)+""+incRow+"01";
                      }
                      else{
                        console.log("last Seat got is "+arrLast);
                        console.log("last char is "+arrLast.substring(3,4));
                        var lstNum  = parseInt(arrLast.substring(2,4));
                        console.log("before incrementing lstNum : "+lstNum);
                        lstNum = lstNum+1;
                        console.log("after incrementing lstNum : "+lstNum);
                        if(lstNum < 10){
                              lstNum = "0"+lstNum;
                              console.log("adding 0 digit to lstNum : "+lstNum);
                        }
                        userSeat = bookingData.Floor.name.charAt(0)+""+arrLast.charAt(1)+""+lstNum;
                        console.log("generated SeatNumber : "+userSeat);
                      }
                    }
                    checkForSeat = 0;
                  }
                  if(noSeatLeft == 1){
                    swal("Booking status!", "Sorry !..All the parking slots are booked for this time slot.", "cancel");
                  }
                  else if(userSeat != ""){
                    //-----if seat is available-----------------
                    $scope.bookingDetails.SeatNumber = userSeat;
                    mainService.addBookingDetails($scope.bookingDetails).success(function(response){
                      swal("Booking status!", "Successfully Booked Your Seat and your slot number is"+userSeat, "success");
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
