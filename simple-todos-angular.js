TaskDB = new Mongo.Collection('taskDB');

if (Meteor.isClient) {
 
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
  // This code only runs on the client

  //references 'simple-todos' in .html file
  //passes in angular-meteor module needed for the program to run.
  angular.module('simple-todos',['angular-meteor']);

  function onReady() {
    angular.bootstrap(document, ['simple-todos']);
  }
 
  if (Meteor.isCordova)
    angular.element(document).on('deviceready', onReady);
  else
    angular.element(document).ready(onReady);


  angular.module('simple-todos').controller('TodosListCtrl', ['$scope', '$meteor',
    function ($scope, $meteor) {

      $scope.tasks = $meteor.collection( function() {
        return TaskDB.find($scope.getReactively('query'), { sort: { createdAt: -1 } })
      });


      $scope.addTask = function(newTask) {
        $scope.tasks.push( {
            text: newTask,
            createdAt: new Date(),             // current time
            owner: Meteor.userId(),            // _id of logged in user
            username: Meteor.user().username }  // username of logged in user
        );
      };

      $scope.$watch('hideCompleted', function() {
        if ($scope.hideCompleted)
          $scope.query = {checked: {$ne: true}};
        else
          $scope.query = {};
      });

      $scope.incompleteCount = function () {
        return TaskDB.find({ checked: {$ne: true} }).count();
      };

    }]);
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
