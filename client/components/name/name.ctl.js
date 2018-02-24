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

    var names = [];

    $mdSidenav('left', true).then(function(leftPanel) {
      var preferences
      $scope.toggleLeft = function () {
        leftPanel.toggle()
        if (leftPanel.isOpen()) {
          preferences = _.cloneDeep($scope.preferences)
        }
      }
      leftPanel.onClose(function () {
        if (!_.isEqual(preferences, $scope.preferences)) {
          getNewNamesBatch()
        }
      });
    });

    loadPreferences();
    getNewNamesBatch();

    $scope.toss = function() {
      sendRating($scope.current, 'toss');
      $scope.current = getNext()
    };

    $scope.keep = function() {
      sendRating($scope.current, 'keep');
      $scope.current = getNext()
    };

    $scope.savePreferences = savePreferences;

    function getNewNamesBatch () {
      $scope.current = undefined;
      names = [];
      getNamesBatch().then(function success (res) {
        $timeout(function () {
          names = res.data.data
          $scope.current = getNext()
        }, 0)
      }).catch(function error (err) {
        console.log(err)
      });
    }

    function getNamesBatch() {
      var sex = $scope.preferences.sex ? `&sex=${$scope.preferences.sex}` : ''
      return $http.get(`/api/v1/names?rated=false&sample=true&limit=50${sex}`);
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

    function loadPreferences () {
      $scope.preferences = JSON.parse(localStorage.getItem('preferences') || '{}');
    }

    function savePreferences () {
      localStorage.setItem('preferences', JSON.stringify($scope.preferences));
    }
  }
})();
