
var appRoute=angular.module("appRoute",['ui.router','ngMaterial']);
appRoute.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');

  $stateProvider.state('login', {
  url: '/login',
  params:{
    showSeat : "true",
    HideBookSeat : "false"
  },
  views:{
    'header':{
      templateUrl: '/templates/header.html'
    },
    'content':{
      templateUrl: '/templates/login.html'
    }
  }
})
.state('logout',{
  url:'/loggedout',
  views:{
    'header':{
      templateUrl: '/templates/header.html'
    },
    'content':{
      templateUrl:'/templates/login.html',
      controller : "logoutCtrl"
    }
  }
})
.state('adminHomePage',{
  url:'/adminHomePage',
  params:{
    showSeat : "true",
    HideBookSeat : "false",
    param1: "false",
    param2 : "true",
  },
  views:{
    'header':{
      templateUrl: '/templates/header.html'
    },
    'content':{
      templateUrl:'/templates/adminHomePage.html'
    }
  }
})
//-----------admin states--------------------
.state('registerUser',{
  url:'/registerUser',
  params:{
    showSeat : "true",
    HideBookSeat : "false"
  },
  views:{
    'header':{
      templateUrl: '/templates/header.html'
    },
    'content':{
      templateUrl:'/templates/registerUser.html'
    }
  }
})
//---------------user states-----------------
.state('bookSeat',{
  url:'/bookSeat',
  params:{
    param1: "true",
    param2 : "true",
    showSeat : "false",
    HideBookSeat : "true"
},
  views:{
    'header':{
      templateUrl:'/templates/header.html'
    },
    'content':{
      templateUrl:'/templates/bookSeat.html',

    }
  }
})

.state('bookingDetails',{
  url:'/bookingDetails/:param1/:param2',
  params:{
    showSeat : "false",
    HideBookSeat : "true"
  },
  views:{
    'header':{
      templateUrl:'/templates/header.html'
    },
    'content':{
      templateUrl:'/templates/bookingDetails.html'
    }
  }
})
});
