angular.module('appRoute')
.controller('adminController',function($window,$scope,$timeout,mainService,$q,$state,$stateParams,$mdDialog,authService){
  // $scope.User = localStorage.getItem("token");
  $scope.logValBD = $stateParams.param1;
  $scope.logValLO = $stateParams.param2;
  $scope.ShowBookSeat = $stateParams.showSeat;
  $scope.HideBookSeat = $stateParams.HideBookSeat;
  $scope.showChartDiv = true;
  // $scope.disableSABtn = false;
  $scope.dbkgShow = true;
  $scope.rbkgShow = false;
  $scope.btnOpacityDB = "1";
  $scope.btnOpacityRB = ".2";
  $scope.tBar = "always";
  $scope.includeDesktopTemplate = false;
  $scope.includeMobileTemplate = false;

  var screenWidth = $window.innerWidth;

  if (screenWidth < 768){
    $scope.includeMobileTemplate = true;
    $scope.tBar = "auto";
  }else{
    $scope.includeDesktopTemplate = true;
    $scope.tBar = "always";
  }
  console.log("Screen Mobile Size:"+$scope.includeMobileTemplate);
  console.log("Screen Desktop Size:"+$scope.includeDesktopTemplate);
  var userObj = authService.getUser();
  if(userObj != undefined){
    var userName = userObj.userName;
    $scope.currentUser = userName.substring(0,1).toUpperCase()+userName.substring(1,userName.length);
    console.log("current user is" +$scope.currentUser);
    $scope.User = userObj.eMail;
  }
  mainService.getAllTheBookings().success(function(data){
    for (var i = 0; i < data.length; i++) {
      $scope.AllbookingDetails.push(data[i]);
    }
    var len = $scope.AllbookingDetails.length;
    console.log(len);
  })

  $scope.AllbookingDetails = [];
  $scope.Tower = null;
  $scope.Towers = null;
  $scope.Areas =[
    { id: 1, name: 'Fareham' },
    { id: 2, name: 'Swindon' },
    { id: 3, name: 'Cheltenham' }
  ];
  $scope.loadFloors = function() {
    return $timeout(function() {
      $scope.Floors =  $scope.Floors  || [
        { id: 1, name: 'Ground Floor' },
        { id: 2, name: '1st Floor' },
        { id: 3, name: '2nd Floor' },
        { id: 4, name: '3rd Floor' },

      ];
    }, 350);
  };
  // $scope.Floors =[
  //   { id: 1, name: 'Ground Floor' },
  //   { id: 2, name: '1st Floor' },
  //   { id: 3, name: '2nd Floor' }
  // ];
  $scope.fetchBookings = function(location,floor){
    $scope.showChartDiv = true;
    console.log(floor);
    console.log(location);
    var date = new Date();
    var currHour = date.getHours();
    var currentMinute = date.getMinutes();
    // var currHour =13;
    // var currentMinute = 30;

    var todayDate = date.getDate();
    if(todayDate <10){   todayDate = "0"+todayDate;  }

    var mon = date.getMonth()+1;
    var year = date.getFullYear();
    if(mon<10){   mon = "0"+mon;  }

    var currDate = year+"-"+mon+"-"+todayDate;
    $scope.JsonDataDesk = [['status','Seats',{role:'style'}],
    ['booked',0,'color:#ADC20E'],
    ['available',0,'color:#1B613A'],
    ['occupied',0,'color:#C21F0E']
  ];

  mainService.getBookings(location,floor).success(function(response){
    console.log(response);
    for (var i = 0; i < response.length; i++) {
      var responseStartTime = response[i].StartTime.split(":");
      var responseStartTimeHour = parseInt(responseStartTime[0]);
      var responseStartTimeMinute = parseInt(responseStartTime[1]);
      var responseEndTime = response[i].EndTime.split(":");
      var responseEndTimeHour = responseEndTime[0];
      var responseEndTimeMinute = responseEndTime[1];

      if(
        (  (  ( currHour == responseStartTimeHour && currentMinute >= responseStartTimeMinute) ||(currHour > responseStartTimeHour)  ) &&  (  ( currHour == responseEndTimeHour && currentMinute < responseEndTimeMinute) ||(currHour < responseEndTimeHour)  ) ) ||
        (  (  (  currHour == responseStartTimeHour && currentMinute < responseStartTimeMinute) || currHour < responseStartTimeHour )  &&    (  (currHour == responseEndTimeHour && currentMinute > responseEndTimeMinute) || currHour > responseEndTimeHour )  ) ){

                $scope.JsonDataDesk[1][1] = $scope.JsonDataDesk[1][1]+1;
        }
    }
    var availableSeats = 100 - $scope.JsonDataDesk[1][1];
    $scope.JsonDataDesk[2][1] = availableSeats;

    google.charts.load('current', {packages: ['corechart', 'bar']});
      google.charts.setOnLoadCallback(drawBasic);
      function drawBasic() {
        var data = google.visualization.arrayToDataTable(  $scope.JsonDataDesk);

        var options = {
          hAxis: {
            title: 'Parking',
            titleTextStyle: {
              fontSize: 12,
              bold: true
            }
          },
          vAxis: {
            gridlines: {
              count: 5
            },
            title: 'Total Parking Slots',
            titleTextStyle: {
              fontSize: 12,
              bold: true
            },
            ticks: [0,10, 20, 30, 40, 50, 60,70,80,90,100]
          },
          legend: { position: "none" }
        };
        if(location == 'Electronic City'){
          var divId = "chart_divDesk";
        }
        else{
            var divId = "chart_divDesk"+location;
        }
        var chart = new google.visualization.ColumnChart(
          document.getElementById(divId));

          chart.draw(data,options);
        }
  })
    }
    $scope.ShowCards = function(bookingType){
      if(bookingType == "Desk Booking"){
        $scope.dbkgShow = true;
        $scope.rbkgShow = false;
        $scope.btnOpacityRB = ".2";
        $scope.btnOpacityDB = "1";

      }else{
        $scope.dbkgShow = false;
        $scope.rbkgShow = true;
        $scope.btnOpacityDB = ".2";
        $scope.btnOpacityRB = "1";
      }
    }
    $scope.hideChartDiv = function(){
      $scope.showChartDiv = false;
      console.log("setting chart div "+$scope.showChartDiv );
    }

    $scope.ShowAnalyticsDaily = function(bookingType,timeType){
      $scope.showChartDiv = true;
      console.log("booking type is "+bookingType);
      var date = new Date();
      var currHour = date.getHours();
      var currentMinute = date.getMinutes();
      var todayDate = date.getDate();
      if(todayDate <10){   todayDate = "0"+todayDate;  }

      var mon = date.getMonth()+1;
      var year = date.getFullYear();

      if(mon<10){   mon = "0"+mon;  }

      var currDate = year+"-"+mon+"-"+todayDate;
      mainService.getAllTheBookings().success(function(response){
        //-------------variables used for daily graph-------------------
        var startTimeH = 8;
        var startTimeM = "00";
        var maxSeat = [];
        var maxSeatMonth = [];
        var maxSeatWeek = [];
        var maxSeatRoom = [];
        var maxSeatMonthRoom = [];
        var maxSeatWeekRoom = [];
        var dailyBasisJsonData = [['Time','Fareham Seats','Swindon Seats','Cheltenham Seats']];
        var dailyBasisJsonDataRoom = [['Time','Fareham Rooms','Swindon Rooms','Cheltenham Rooms']];
        var  time  ="8:00";
        // var JsonDaily = [['Time','Fareham Seats','Swindon Seats','Cheltenham Seats']];

        //-----------------while loop logic for counting the booked seats on current date-------------------
        while(time != "23:30" ){
          var timeBooking = {};
          var timeObject = {};
          var arrayInTimeObj = [];
          var FarehamCount = 0;
          var SwindonCount = 0;
          var CheltenhamCount = 0;
          var FarehamCountRoom = 0;
          var SwindonCountRoom = 0;
          var CheltenhamCountRoom = 0;
          var singleLine = [];
          timeBooking['time'] = time;
          timeBooking['seats'] = 0;
          for (var i = 0; i < response.length; i++) {
            var responseStartTime = response[i].StartTime.split(":");
            var responseStartTimeHour = parseInt(responseStartTime[0]);
            var responseStartTimeMinute = parseInt(responseStartTime[1]);
            var responseEndTime = response[i].EndTime.split(":");
            var responseEndTimeHour = responseEndTime[0];
            var responseEndTimeMinute = responseEndTime[1];
            if(response[i].BookingDate == currDate && response[i].BookingType == "Desk Booking"){
              time = startTimeH+":"+startTimeM;
              if
              (  (  ( startTimeH == responseStartTimeHour && startTimeM >= responseStartTimeMinute) ||(startTimeH > responseStartTimeHour)  ) &&
              (  ( startTimeH == responseEndTimeHour && startTimeM < responseEndTimeMinute) ||(startTimeH < responseEndTimeHour)  ) )  {
                if(response[i].Area == 'Fareham'){
                  FarehamCount = FarehamCount+1;
                }
                if(response[i].Area == 'Swindon'){
                  SwindonCount += 1;
                }
                if(response[i].Area == 'Cheltenham'){
                  CheltenhamCount += 1;
                }

              }
            }
            else if(response[i].BookingDate == currDate && response[i].BookingType == "Room Booking"){
              time = startTimeH+":"+startTimeM;
              if
              (  (  ( startTimeH == responseStartTimeHour && startTimeM >= responseStartTimeMinute) ||(startTimeH > responseStartTimeHour)  ) &&
              (  ( startTimeH == responseEndTimeHour && startTimeM < responseEndTimeMinute) ||(startTimeH < responseEndTimeHour)  ) )  {
                if(response[i].Area == 'Fareham'){
                  FarehamCountRoom = FarehamCountRoom+1;
                }
                if(response[i].Area == 'Swindon'){
                  SwindonCountRoom += 1;
                }
                if(response[i].Area == 'Cheltenham'){
                  CheltenhamCountRoom += 1;
                }

              }
            }

          }
          //------------- code for getting json format in  [{v: [8, 0, 0], f: '8 am'}, 1, 0, 0] -------------
          arrayInTimeObj[0] = startTimeH; arrayInTimeObj[1] = startTimeM.charAt(0); arrayInTimeObj[2] = startTimeM.charAt(1);
          var objj= {};
          objj.v = arrayInTimeObj;
          objj.f = time;
          singleLine = [];
          singleLine.push(objj); singleLine.push(FarehamCount); singleLine.push(SwindonCount); singleLine.push(CheltenhamCount);
          maxSeat.push(FarehamCount);
          maxSeat.push(SwindonCount);
          maxSeat.push(CheltenhamCount);
          dailyBasisJsonData.push(singleLine);

          singleLine = [];
          singleLine.push(objj); singleLine.push(FarehamCountRoom); singleLine.push(SwindonCountRoom); singleLine.push(CheltenhamCountRoom);
          maxSeatRoom.push(FarehamCountRoom);
          maxSeatRoom.push(SwindonCountRoom);
          maxSeatRoom.push(CheltenhamCountRoom);
          dailyBasisJsonDataRoom.push(singleLine);
          if(startTimeM == "00"){
            startTimeM = "30";
            startTimeH = startTimeH;
          }else if(startTimeM == "30"){
            startTimeM = "00";
            startTimeH = startTimeH+1;
          }
        }

        console.log("maxmum seats occupied is given by ");
        console.log(Math.max.apply(null,maxSeat));
        console.log(Math.max.apply(null,maxSeatRoom));
        //---------------end Of while loop logic for finding daily bookings----------------------
        console.log(dailyBasisJsonData);
        console.log(dailyBasisJsonDataRoom);

        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(drawBasic);

        function drawBasic() {
            if(bookingType == "Desk Booking"){
              var data = new google.visualization.arrayToDataTable(dailyBasisJsonData);
              var ticksArray = [];
              var len = Math.max.apply(null,maxSeat);
              // for(var i=0;i<=len+1;i++){
              //   ticksArray.push(i);
              // }
              if(len <= 10){
                ticksArray = [0,1,2,3,4,5];
              }else if(len <= 20){
                ticksArray = [0,4,8,12,16,20];
              }else if(len <= 30){
                ticksArray = [0,6,12,18,24,30];
              }else if(len <= 40){
                ticksArray = [0,8,16,24,32,40];
              }else if(len <= 50){
                ticksArray = [0,10,20,30,40,50];
              }else if(len <= 60){
                ticksArray = [0,12,24,36,48,60];
              }else if(len <= 70){
                ticksArray = [0,14,28,42,56,70];
              }else if(len <= 80){
                ticksArray = [0,16,32,48,64,80];
              }else if(len <= 90){
                ticksArray = [0,18,36,54,72,90];
              }else if(len <= 100){
                ticksArray = [0,20,40,60,80,100];
              }else if(len <= 110){
                ticksArray = [0,22,44,66,88,110];
              }else if(len <= 120){
                ticksArray = [0,24,48,72,96,120];
              }
              else if(len <= 130){
                ticksArray = [0,26,52,78,104,130];
              }else{
                ticksArray = [0,40,80,120,160,200];
              }
              if($scope.includeMobileTemplate){
                var options = {
                  hAxis: {
                    title: 'Time of Day',
                    titleTextStyle: {
                      fontSize: 12,
                      bold: true
                    },
                    format: 'H ',
                    ticks: [[8, 00, 0],[9, 00, 0],[10, 00, 0],[11, 00, 0],[12, 00, 0],[13, 00, 0],[14, 00, 0],[15, 00, 0],[16, 00, 0],[17, 00, 0],[18, 00, 0],[19, 00, 0],[20, 00, 0],[21, 00, 0],[20, 00, 0],[21, 00, 0],[22, 00, 0],[23, 00, 0]],
                    ticksTextStyle:{
                      fontSize: 5
                    }
                  },
                  vAxis: {
                    title: 'Occupied Seats',
                    titleTextStyle: {
                      fontSize: 12,
                      bold: true
                    },
                    ticks: ticksArray
                  },
                  colors: ['#a52714', '#097138','#002e6d'],
                  legend: { position: "top",maxLines: 3}
                };
              }else{
                var options = {
                  width: 730,
                  height: 350,
                  hAxis: {
                    title: 'Time of Day',
                    titleTextStyle: {
                      fontSize: 12,
                      bold: true
                    },
                    format: 'H',
                    ticks: [[8, 00, 0],[9, 00, 0],[10, 00, 0],[11, 00, 0],[12, 00, 0],[13, 00, 0],[14, 00, 0],[15, 00, 0],[16, 00, 0],[17, 00, 0],[18, 00, 0],[19, 00, 0],[20, 00, 0],[21, 00, 0],[20, 00, 0],[21, 00, 0],[22, 00, 0],[23, 00, 0]],
                    ticksTextStyle:{
                      fontSize: 5
                    }
                  },
                  vAxis: {
                    title: 'Occupied Seats',
                    titleTextStyle: {
                      fontSize: 12,
                      bold: true
                    },
                    ticks: ticksArray
                  },
                  colors: ['#a52714', '#097138','#002e6d'],
                  legend: { position: "top"}
                };
              }

            }else{
              var data = new google.visualization.arrayToDataTable(dailyBasisJsonDataRoom);
              var ticksArray = [];
              var len = Math.max.apply(null,maxSeatRoom);
              // for(var i=0;i<=len+1;i++){
              //   ticksArray.push(i);
              // }
              if(len <= 10){
                ticksArray = [0,1,2,3,4,5];
              }else if(len <= 20){
                ticksArray = [0,4,8,12,16,20];
              }else if(len <= 30){
                ticksArray = [0,6,12,18,24,30];
              }else if(len <= 40){
                ticksArray = [0,8,16,24,32,40];
              }else if(len <= 50){
                ticksArray = [0,10,20,30,40,50];
              }else if(len <= 60){
                ticksArray = [0,12,24,36,48,60];
              }else if(len <= 70){
                ticksArray = [0,14,28,42,56,70];
              }else if(len <= 80){
                ticksArray = [0,16,32,48,64,80];
              }else if(len <= 90){
                ticksArray = [0,18,36,54,72,90];
              }else if(len <= 100){
                ticksArray = [0,20,40,60,80,100];
              }else if(len <= 110){
                ticksArray = [0,22,44,66,88,110];
              }else if(len <= 120){
                ticksArray = [0,24,48,72,96,120];
              }
              else if(len <= 130){
                ticksArray = [0,26,52,78,104,130];
              }else{
                ticksArray = [0,40,80,120,160,200];
              }
              console.log("RB"+ticksArray);
              if($scope.includeMobileTemplate){
                var options = {
                  hAxis: {
                    title: 'Time of Day',
                    titleTextStyle: {
                      fontSize: 12,
                      bold: true
                    },
                    format: 'H ',
                    ticks: [[8, 00, 0],[9, 00, 0],[10, 00, 0],[11, 00, 0],[12, 00, 0],[13, 00, 0],[14, 00, 0],[15, 00, 0],[16, 00, 0],[17, 00, 0],[18, 00, 0],[19, 00, 0],[20, 00, 0],[21, 00, 0],[20, 00, 0],[21, 00, 0],[22, 00, 0],[23, 00, 0]],
                    ticksTextStyle:{
                      fontSize: 5
                    }
                  },
                  vAxis: {
                    title: 'Occupied Rooms',
                    titleTextStyle: {
                      fontSize: 12,
                      bold: true
                    },
                    ticks: ticksArray
                  },
                  colors: ['#a52714', '#097138','#002e6d'],
                  legend: { position: "top",maxLines: 3}
                };
              }else{
                var options = {
                  width: 730,
                  height: 350,
                  hAxis: {
                    title: 'Time of Day',
                    titleTextStyle: {
                      fontSize: 12,
                      bold: true
                    },
                    format: 'H',
                    ticks: [[8, 00, 0],[9, 00, 0],[10, 00, 0],[11, 00, 0],[12, 00, 0],[13, 00, 0],[14, 00, 0],[15, 00, 0],[16, 00, 0],[17, 00, 0],[18, 00, 0],[19, 00, 0],[20, 00, 0],[21, 00, 0],[20, 00, 0],[21, 00, 0],[22, 00, 0],[23, 00, 0]],
                    ticksTextStyle:{
                      fontSize: 5
                    }
                  },
                  vAxis: {
                    title: 'Occupied Rooms',
                    titleTextStyle: {
                      fontSize: 12,
                      bold: true
                    },
                    ticks: ticksArray
                  },
                  colors: ['#a52714', '#097138','#002e6d'],
                  legend: { position: "top"}
                };
              }
            }

          if(bookingType == "Desk Booking"){
            console.log("chartDesk");
            var chart = new google.visualization.LineChart(
              document.getElementById('ShowAnalyticsGraphDesk'));
            }else{
              console.log("chartRoom");
              var chart = new google.visualization.LineChart(
                document.getElementById('ShowAnalyticsGraphRoom'));
              }
              chart.draw(data, options);
            }
    })
  }

  $scope.ShowAnalyticsweekly = function(bookingType,timeType){
    $scope.showChartDiv = true;
    console.log("booking type is "+bookingType);
    var date = new Date();
    var currHour = date.getHours();
    var currentMinute = date.getMinutes();
    var todayDate = date.getDate();
    if(todayDate <10){   todayDate = "0"+todayDate;  }
    var mon = date.getMonth()+1;
    var year = date.getFullYear();
    if(mon<10){   mon = "0"+mon;  }

    var currDate = year+"-"+mon+"-"+todayDate;
    mainService.getAllTheBookings().success(function(response){
      var maxSeatWeek = [];
      var maxSeatWeekRoom = [];
      var week = date.getDay();
      console.log("current week day is "+week);
      var firstDayOfWeek = parseInt(todayDate) - week+1;
      // var lastDayOfWeek =  parseInt(todayDate) - week+1;
      var firstDayDate = year+"-"+mon+"-"+firstDayOfWeek;
      var loopWhile = 0;
      var weekArray = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
      // var weekArray = [1,2,3,4,5,6,7];
      var weekBasisJsonData = [['Week','Fareham Seats','Swindon Seats','Cheltenham Seats']];
      var weekBasisJsonDataRoom = [['Week','Fareham Rooms','Swindon Rooms','Cheltenham Rooms']];
      var singleLineArry = [];
      console.log("first day of this week is "+firstDayDate);
      while(loopWhile != 7){
        var FweekCount = 0;
        var SweekCount = 0;
        var CweekCount = 0;
        var FweekCountRoom = 0;
        var SweekCountRoom = 0;
        var CweekCountRoom = 0;
        for (var i = 0; i < response.length; i++) {
          if(response[i].BookingDate == firstDayDate && response[i].BookingType == "Desk Booking"){
            if(response[i].Area == 'Fareham'){
              FweekCount += 1;
            }
            if(response[i].Area == 'Swindon'){
              SweekCount += 1;
            }
            if(response[i].Area == 'Cheltenham'){
              CweekCount += 1;
            }
          }
          else if(response[i].BookingDate == firstDayDate && response[i].BookingType == "Room Booking"){
            if(response[i].Area == 'Fareham'){
              FweekCountRoom += 1;

            }
            if(response[i].Area == 'Swindon'){
              SweekCountRoom += 1;
            }
            if(response[i].Area == 'Cheltenham'){
              CweekCountRoom += 1;
            }
          }
        }
        //------------------For Desk booking json data-------------------
        singleLineArry = [];
        singleLineArry[0] = weekArray[loopWhile]; singleLineArry[1] = FweekCount; singleLineArry[2] = SweekCount; singleLineArry[3] = CweekCount;
        weekBasisJsonData.push(singleLineArry);
        maxSeatWeek.push(FweekCount);
        maxSeatWeek.push(SweekCount);
        maxSeatWeek.push(CweekCount);
        //---desk booking json data end----------

        //---------for room booking json data ----------------
        singleLineArry = [];
        singleLineArry[0] = weekArray[loopWhile]; singleLineArry[1] = FweekCountRoom; singleLineArry[2] = SweekCountRoom; singleLineArry[3] = CweekCountRoom;
        weekBasisJsonDataRoom.push(singleLineArry);
        maxSeatWeekRoom.push(FweekCountRoom);
        maxSeatWeekRoom.push(SweekCountRoom);
        maxSeatWeekRoom.push(CweekCountRoom);
        //--------end of room booking json data--------------------
        loopWhile++;
        firstDayOfWeek++;
        firstDayDate =year+"-"+mon+"-"+firstDayOfWeek;
      }
      console.log("maxmum seats occupied is given by ");
      console.log(Math.max.apply(null,maxSeatWeek));
      console.log(Math.max.apply(null,maxSeatWeekRoom));
      console.log("weekBasisJsonData : ");
      // console.log(weekBasisJsonData);
      google.charts.load('current', {packages: ['corechart', 'line']});
     google.charts.setOnLoadCallback(drawBasic);

     function drawBasic() {
       if(bookingType == "Desk Booking"){
         var data = new google.visualization.arrayToDataTable(weekBasisJsonData);
         var ticksArray = [];
         var len = Math.max.apply(null,maxSeatWeek);
         // for(var i=0;i<=len+1;i++){
         //   ticksArray.push(i);
         // }
         if(len <= 10){
           ticksArray = [0,1,2,3,4,5];
         }else if(len <= 20){
           ticksArray = [0,4,8,12,16,20];
         }else if(len <= 30){
           ticksArray = [0,6,12,18,24,30];
         }else if(len <= 40){
           ticksArray = [0,8,16,24,32,40];
         }else if(len <= 50){
           ticksArray = [0,10,20,30,40,50];
         }else if(len <= 60){
           ticksArray = [0,12,24,36,48,60];
         }else if(len <= 70){
           ticksArray = [0,14,28,42,56,70];
         }else if(len <= 80){
           ticksArray = [0,16,32,48,64,80];
         }else if(len <= 90){
           ticksArray = [0,18,36,54,72,90];
         }else if(len <= 100){
           ticksArray = [0,20,40,60,80,100];
         }else if(len <= 110){
           ticksArray = [0,22,44,66,88,110];
         }else if(len <= 120){
           ticksArray = [0,24,48,72,96,120];
         }
         else if(len <= 130){
           ticksArray = [0,26,52,78,104,130];
         }else{
           ticksArray = [0,40,80,120,160,200];
         }
         if($scope.includeMobileTemplate){
           var options = {

             hAxis: {
               title: 'Days',
               titleTextStyle: {
                 fontSize: 12,
                 bold: true
               }
             },
             vAxis: {
               title: 'Occupied Seats',
               titleTextStyle: {
                 fontSize: 12,
                 bold: true
               },
               ticks: ticksArray
             },
             colors: ['#a52714', '#097138','#002e6d'],
             legend: { position: "top",maxLines: 3 }
           };
         }else{
           var options = {
             width: 730,
             height: 350,
             hAxis: {
               title: 'Days',
               titleTextStyle: {
                 fontSize: 12,
                 bold: true
               }
             },
             vAxis: {
               title: 'Occupied Seats',
               titleTextStyle: {
                 fontSize: 12,
                 bold: true
               },
               ticks: ticksArray
             },
             colors: ['#a52714', '#097138','#002e6d'],
             legend: { position: "top" }
           };
         }
       }else{
         var data = new google.visualization.arrayToDataTable(weekBasisJsonDataRoom);
         var ticksArray = [];
         var len = Math.max.apply(null,maxSeatWeekRoom);
         // for(var i=0;i<=len+1;i++){
         //   ticksArray.push(i);
         // }
         if(len <= 10){
           ticksArray = [0,1,2,3,4,5];
         }else if(len <= 20){
           ticksArray = [0,4,8,12,16,20];
         }else if(len <= 30){
           ticksArray = [0,6,12,18,24,30];
         }else if(len <= 40){
           ticksArray = [0,8,16,24,32,40];
         }else if(len <= 50){
           ticksArray = [0,10,20,30,40,50];
         }else if(len <= 60){
           ticksArray = [0,12,24,36,48,60];
         }else if(len <= 70){
           ticksArray = [0,14,28,42,56,70];
         }else if(len <= 80){
           ticksArray = [0,16,32,48,64,80];
         }else if(len <= 90){
           ticksArray = [0,18,36,54,72,90];
         }else if(len <= 100){
           ticksArray = [0,20,40,60,80,100];
         }else if(len <= 110){
           ticksArray = [0,22,44,66,88,110];
         }else if(len <= 120){
           ticksArray = [0,24,48,72,96,120];
         }
         else if(len <= 130){
           ticksArray = [0,26,52,78,104,130];
         }else{
           ticksArray = [0,40,80,120,160,200];
         }
         if($scope.includeMobileTemplate){
           var options = {

             hAxis: {
               title: 'Days',
               titleTextStyle: {
                 fontSize: 12,
                 bold: true
               }
             },
             vAxis: {
               title: 'Occupied Rooms',
               titleTextStyle: {
                 fontSize: 12,
                 bold: true
               },
               ticks: ticksArray
             },
             colors: ['#a52714', '#097138','#002e6d'],
             legend: { position: "top",maxLines: 3 }
           };
         }else{
           var options = {
             width: 730,
             height: 350,
             hAxis: {
               title: 'Days',
               titleTextStyle: {
                 fontSize: 12,
                 bold: true
               }
             },
             vAxis: {
               title: 'Occupied Rooms',
               titleTextStyle: {
                 fontSize: 12,
                 bold: true
               },
               ticks: ticksArray
             },
             colors: ['#a52714', '#097138','#002e6d'],
             legend: { position: "top" }
           };
         }
       }

       if(bookingType == "Desk Booking"){
         console.log("chartDesk");
         var chart = new google.visualization.LineChart(
           document.getElementById('ShowAnalyticsGraphDesk'));
         }else{
           console.log("chartRoom");
           var chart = new google.visualization.LineChart(
             document.getElementById('ShowAnalyticsGraphRoom'));
           }
           chart.draw(data, options);
         }
    })
  }

  $scope.ShowAnalyticsMonthly = function(bookingType,timeType){
    $scope.showChartDiv = true;
    console.log("booking type is "+bookingType);
    var date = new Date();
    var currHour = date.getHours();
    var currentMinute = date.getMinutes();
    var todayDate = date.getDate();
    if(todayDate <10){   todayDate = "0"+todayDate;  }
    var mon = date.getMonth()+1;
    var year = date.getFullYear();
    if(mon<10){   mon = "0"+mon;  }
    var maxSeatMonth = [];
    var maxSeatMonthRoom = [];
    var currDate = year+"-"+mon+"-"+todayDate;
    var firstDayMonth = (new Date(date.getFullYear(), date.getMonth(), 1)).getDate();
    var lastDayMonth  = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
    console.log(firstDayMonth+" - "+lastDayMonth);
    mainService.getAllTheBookings().success(function(response){
      var inr = 1;
      var MonthBasisJsonData = [['Date','Fareham Seats','Swindon Seats','Cheltenham Seats']];
      var MonthBasisJsonDataRoom = [['Date','Fareham Rooms','Swindon Rooms','Cheltenham Rooms']];
      while(inr != lastDayMonth){
        var FmonthCount = 0;
        var SmonthCount = 0;
        var CmonthCount = 0;
        var FmonthCountRoom = 0;
        var SmonthCountRoom = 0;
        var CmonthCountRoom = 0;
        for (var i = 0; i < response.length; i++) {
          var resMonth = parseInt(response[i].BookingDate.substring(5,7));
          if(resMonth ==  date.getMonth()+1 && response[i].BookingType == "Desk Booking"){
            if(parseInt(response[i].BookingDate.substring(8,10)) == inr ){
              if(response[i].Area == 'Fareham'){
                FmonthCount += 1;
              }
              if(response[i].Area == 'Swindon'){
                SmonthCount += 1;
              }
              if(response[i].Area == 'Cheltenham'){
                CmonthCount += 1;
              }
            }
          }
          if(resMonth ==  date.getMonth()+1 && response[i].BookingType == "Room Booking"){
            if(parseInt(response[i].BookingDate.substring(8,10)) == inr ){
              if(response[i].Area == 'Fareham'){
                FmonthCountRoom += 1;
              }
              if(response[i].Area == 'Swindon'){
                SmonthCountRoom += 1;
              }
              if(response[i].Area == 'Cheltenham'){
                CmonthCountRoom += 1;
              }
            }
          }
        }
        var s = [];
        s[0] = inr; s[1] = FmonthCount; s[2] = SmonthCount; s[3] = CmonthCount;
        MonthBasisJsonData.push(s);
        maxSeatMonth.push(FmonthCount); maxSeatMonth.push(SmonthCount); maxSeatMonth.push(CmonthCount);
        s= [];
        s[0] = inr; s[1] = FmonthCountRoom; s[2] = SmonthCountRoom; s[3] = CmonthCountRoom;
        MonthBasisJsonDataRoom.push(s);
        maxSeatMonthRoom.push(FmonthCountRoom); maxSeatMonthRoom.push(SmonthCountRoom); maxSeatMonthRoom.push(CmonthCountRoom);
        inr++;
      }
      console.log("maxmum seats occupied is given by ");
      console.log(Math.max.apply(null,maxSeatMonth));
      console.log(Math.max.apply(null,maxSeatMonthRoom));

      console.log("monthly basis jsonData :");
      google.charts.load('current', {packages: ['corechart', 'line']});
      google.charts.setOnLoadCallback(drawBasic);

      function drawBasic() {
        if(bookingType == "Desk Booking"){
          var data = new google.visualization.arrayToDataTable(MonthBasisJsonData);
          var ticksArray = [];
          var len = Math.max.apply(null,maxSeatMonth);
          // for(var i=0;i<=len+1;i++){
          //   ticksArray.push(i);
          // }
          if(len <= 10){
            ticksArray = [0,1,2,3,4,5];
          }else if(len <= 20){
            ticksArray = [0,4,8,12,16,20];
          }else if(len <= 30){
            ticksArray = [0,6,12,18,24,30];
          }else if(len <= 40){
            ticksArray = [0,8,16,24,32,40];
          }else if(len <= 50){
            ticksArray = [0,10,20,30,40,50];
          }else if(len <= 60){
            ticksArray = [0,12,24,36,48,60];
          }else if(len <= 70){
            ticksArray = [0,14,28,42,56,70];
          }else if(len <= 80){
            ticksArray = [0,16,32,48,64,80];
          }else if(len <= 90){
            ticksArray = [0,18,36,54,72,90];
          }else if(len <= 100){
            ticksArray = [0,20,40,60,80,100];
          }else if(len <= 110){
            ticksArray = [0,22,44,66,88,110];
          }else if(len <= 120){
            ticksArray = [0,24,48,72,96,120];
          }
          else if(len <= 130){
            ticksArray = [0,26,52,78,104,130];
          }else{
            ticksArray = [0,40,80,120,160,200];
          }
          if($scope.includeMobileTemplate){
            var options = {
              hAxis: {
                title: 'Days',
                titleTextStyle: {
                  fontSize: 12,
                  bold: true
                }
              },
              vAxis: {
                title: 'Occupied Seats',
                titleTextStyle: {
                  fontSize: 12,
                  bold: true
                },
                ticks: ticksArray
              },
              colors: ['#a52714', '#097138','#002e6d'],
              legend: { position: "top",maxLines: 3 }
            };
          }else{
            var options = {
              width: 730,
              height: 350,
              hAxis: {
                title: 'Days',
                titleTextStyle: {
                  fontSize: 12,
                  bold: true
                }
              },
              vAxis: {
                title: 'Occupied Seats',
                titleTextStyle: {
                  fontSize: 12,
                  bold: true
                },
                ticks: ticksArray
              },
              colors: ['#a52714', '#097138','#002e6d'],
              legend: { position: "top" }
            };
          }
        }else{
          var data = new google.visualization.arrayToDataTable(MonthBasisJsonDataRoom);
          var ticksArray = [];
          var len = Math.max.apply(null,maxSeatMonthRoom);
          // for(var i=0;i<=len+1;i++){
          //   ticksArray.push(i);
          // }
          if(len <= 10){
            ticksArray = [0,1,2,3,4,5];
          }else if(len <= 20){
            ticksArray = [0,4,8,12,16,20];
          }else if(len <= 30){
            ticksArray = [0,6,12,18,24,30];
          }else if(len <= 40){
            ticksArray = [0,8,16,24,32,40];
          }else if(len <= 50){
            ticksArray = [0,10,20,30,40,50];
          }else if(len <= 60){
            ticksArray = [0,12,24,36,48,60];
          }else if(len <= 70){
            ticksArray = [0,14,28,42,56,70];
          }else if(len <= 80){
            ticksArray = [0,16,32,48,64,80];
          }else if(len <= 90){
            ticksArray = [0,18,36,54,72,90];
          }else if(len <= 100){
            ticksArray = [0,20,40,60,80,100];
          }else if(len <= 110){
            ticksArray = [0,22,44,66,88,110];
          }else if(len <= 120){
            ticksArray = [0,24,48,72,96,120];
          }
          else if(len <= 130){
            ticksArray = [0,26,52,78,104,130];
          }else{
            ticksArray = [0,40,80,120,160,200];
          }
          if($scope.includeMobileTemplate){
            var options = {
              hAxis: {
                title: 'Days',
                titleTextStyle: {
                  fontSize: 12,
                  bold: true
                }
              },
              vAxis: {
                title: 'Occupied Rooms',
                titleTextStyle: {
                  fontSize: 12,
                  bold: true
                },
                ticks: ticksArray
              },
              colors: ['#a52714', '#097138','#002e6d'],
              legend: { position: "top",maxLines: 3 }
            };
          }else{
            var options = {
              width: 730,
              height: 350,
              hAxis: {
                title: 'Days',
                titleTextStyle: {
                  fontSize: 12,
                  bold: true
                }
              },
              vAxis: {
                title: 'Occupied Rooms',
                titleTextStyle: {
                  fontSize: 12,
                  bold: true
                },
                ticks: ticksArray
              },
              colors: ['#a52714', '#097138','#002e6d'],
              legend: { position: "top" }
            };
          }
        }
        if(bookingType == "Desk Booking"){
          console.log("chartDesk");
          var chart = new google.visualization.LineChart(
            document.getElementById('ShowAnalyticsGraphDesk'));
          }else{
            console.log("chartRoom");
            var chart = new google.visualization.LineChart(
              document.getElementById('ShowAnalyticsGraphRoom'));
            }
            chart.draw(data, options);
          }
    })
  }
      })
