angular.module('appRoute')
.controller('logoutCtrl', ['$scope', '$state', 'authService',
function($scope, $state, authService) {

  authService.signout()
  .then(function(res){
    authService.removeUser();
    $state.go("login");
  },
  function(res){
    $state.go("login");
    // , {error: "Invalid signin attempt, please retry with valid credentials"});
  });


}]);
