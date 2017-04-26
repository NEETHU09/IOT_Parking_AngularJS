angular.module('appRoute')
.factory('participantService',function($http){
  return{
    getParticipant : function(){
      return $http.get('http://localhost:3000/participantList/part');
    },
    addParticipant: function(participantObj){
      return $http.post('http://localhost:3000/participantList/addParticipantToDb',participantObj)
    }
  }
})
