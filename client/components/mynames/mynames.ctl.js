(function () {
  'use strict';

  angular
    .module('SwypeANameApp')
    .controller('MyNamesController', MyNamesController);

  function MyNamesController($scope, $http, $state, $stateParams) {
    var vm = this;

    var a = $stateParams.a
    $scope.a = a

    if (!$scope.isAuthenticated) {
      return $state.go('login')
    }

    function getRatings () {
      $http.get(`/api/v1/ratings?rating=${a === 'liked' ? 'keep' : 'toss'}`)
        .then(function success (response) {
          $scope.names = response.data.data
        }, function failure (err) {
          console.log(err)
        })
    }

    getRatings();
  }
})();
