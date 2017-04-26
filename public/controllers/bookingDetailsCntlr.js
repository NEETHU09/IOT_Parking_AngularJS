'use strict';
angular.module('appRoute')
.controller('bookingDetailsCntlr',function($scope,$timeout,mainService,authService,$q,$state,$stateParams,$mdDialog){
  // $scope.User = localStorage.getItem("token");

 var slidesInSlideshow = 4;
 var slidesTimeIntervalInMs = 3000;

 $('.carousel-control').click(function(e){
   e.preventDefault();
 });

  $scope.slideshow = 1;
  var slideTimer =
    $timeout(function interval() {
      $scope.slideshow = ($scope.slideshow % slidesInSlideshow) + 1;
      slideTimer = $timeout(interval, slidesTimeIntervalInMs);
    }, slidesTimeIntervalInMs);
  $scope.myInterval = 2000;
  $scope.dataArray = [
      {
        src: 'https://www.travelexcellence.com/images/movil/La_Paz_Waterfall.jpg'
      },
      {
        src: 'http://www.parasholidays.in/blog/wp-content/uploads/2014/05/holiday-tour-packages-for-usa.jpg'
      },
      {
        src: 'http://clickker.in/wp-content/uploads/2016/03/new-zealand-fy-8-1-Copy.jpg'
      },
      {
        src: 'http://images.kuoni.co.uk/73/indonesia-34834203-1451484722-ImageGalleryLightbox.jpg'
      }
    ];
  $scope.bookingDetails = [];
  var userObj = authService.getUser();
  if(userObj != undefined){
    var userName = userObj.userName;
    $scope.currentUser = userName.substring(0,1).toUpperCase()+userName.substring(1,userName.length);
    console.log("current user is" +$scope.currentUser);
    $scope.User = userObj.eMail;
  }
  console.log("current user is--------------------------------------"+$scope.User);
  mainService.getAllTheBookings().success(function(data){
    console.log("************************************************");
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      if(data[i].BookingOwner == $scope.User){
        $scope.bookingDetails.push(data[i]);
      }
    }
    console.log($scope.bookingDetails);
    var len = $scope.bookingDetails.length;
    if(len <=5){
      length = "zero";
      $scope.showLeftRightArrow = false;
    }
    else{
      $scope.showLeftRightArrow = true;
    }
    console.log(len);
  })


  $scope.currentPageBooking = 0;
    $scope.pageSize = 5;

    console.log("current page is "+$scope.currentPageBooking);
    $scope.prevPage= function(){
      console.log("entering previous page");
      if($scope.currentPageBooking!=0){
        $scope.currentPageBooking=$scope.currentPageBooking-1;
      }
    }
    $scope.nextPage= function(){
      if($scope.currentPageBooking+4!=$scope.bookingDetails.length){
        $scope.currentPageBooking=$scope.currentPageBooking+1;
      }
    }


  $scope.deleteReservation = function(reservationData){
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover booking details",
      imageUrl: '../images/warning.png',
      showCancelButton: true,
      animation: "slide-from-top",
      confirmButtonColor: "#0D47A1",
      cancelButtonColor: '#000000',
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      closeOnConfirm: false,
      closeOnCancel: true
    },
    function(isConfirm){
      if (isConfirm) {
        swal("Deleted!", "Successfully cancelled your booking.", "success");
        mainService.deleteSelected(reservationData).success(function(response){
          mainService.getAllTheBookings().success(function(data){
            console.log("************************************************");
            console.log(data);
            $scope.bookingDetails= [];
            for (var i = 0; i < data.length; i++) {
              if(data[i].BookingOwner == $scope.User){
                $scope.bookingDetails.push(data[i]);
              }
            }
            var len = $scope.bookingDetails.length;
            if(len <=5){
              length = "zero";
              $scope.showLeftRightArrow = false;
            }
            else{
              $scope.showLeftRightArrow = true;
            }
          })
        })
      }
    });
  }
  $scope.newsfeed = [
    {date: "April 13, 2017",content:"Zurich completes acquisition of Cover-More to become top three global travel insurance provider"},
    {date: "March 30, 2017",content:"Zurich to early redeem USD 1 billion of Trust Preferred Securities"},
    {date: "March 29, 2017",content:"Zurich shareholders approve dividend of CHF 17 and elect Catherine P. Bessant to the Board of Directors"},
    // {date: "March 28, 2017",content:"Zurich appoints leader of newly integrated communications and public affairs function"},
    // {date: "March 3, 2017",content:"Zurich’s Annual Report 2016 and information about the AGM 2017 available online now"},
    // {date: "February 9, 2017",content:"Zurich reports BOP increased 55% to USD 4.5 billion in 2016, proposes dividend of CHF 17 per share"},
  ];




        $scope.direction = 'left';
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };

        $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
        };
    })
    .animation('.slide-animation', function () {
        return {
            beforeAddClass: function (element, className, done) {
                var scope = element.scope();

                if (className == 'ng-hide') {
                    var finishPoint = element.parent().width();
                    if(scope.direction !== 'right') {
                        finishPoint = -finishPoint;
                    }
                    TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                var scope = element.scope();

                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');

                    var startPoint = element.parent().width();
                    if(scope.direction === 'right') {
                        startPoint = -startPoint;
                    }

                    TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
                }
                else {
                    done();
                }
            }
        };

})
.filter('startFrom', function() {
    return function(input, start) {
      if(input!=undefined)
        {
          if(input.length <=5){
            return input;
          }
          else{
            return input.slice(start);}
          }

          // start = +start; //parse to int

    }
})
