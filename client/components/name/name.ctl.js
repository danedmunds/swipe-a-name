(function () {
  'use strict';

  angular
    .module('SwypeANameApp')
    .controller('NameController', NameController);

  function NameController($scope, $http, $timeout, $mdSidenav, $state) {
    var vm = this;

    if (!$scope.isAuthenticated) {
      return $state.go('login')
    }

    $scope.toggleLeft = buildToggler('left');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    var names = [];

    getNamesBatch().then(function success (res) {
      $timeout(function () {
        names = res.data.data
        $scope.current = getNext()
      }, 0)
    }).catch(function error (err) {
      console.log(err)
    });

    $scope.toss = function() {
      sendRating($scope.current, 'toss');
      $scope.current = getNext()
    };

    $scope.keep = function() {
      sendRating($scope.current, 'keep');
      $scope.current = getNext()
    };

    function getNamesBatch() {
      return $http.get('/api/v1/names?rated=false&sample=true&limit=50');
    }

    function getNext() {
      if (names.length < 15) {
        getNamesBatch().then(function success (res) {
          names = res.data.data.concat(names)
        }).catch(function (err) {
          console.log(err)
        })
      }

      return names.pop()
    }

    function sendRating(name, rating) {
      return $http.post('/api/v1/ratings', {
        nameId: name.id,
        rating: rating
      }).then(function success () {

      }).catch(function error () {

      })
    }
  }
})();
