(function () {
  'use strict';

  angular
    .module('SwypeANameApp')
    .controller('NameController', NameController);

  function NameController($scope, authService) {
    var vm = this;
    vm.authService = authService;

    var names = getNamesBatch();
    var index = 0;
    
    $scope.current = names[index]

    $scope.toss = function(name) {
      sendRating(name, 'toss');
      getNext();
    };

    $scope.keep = function(name) {
      sendRating(name, 'keep');
      getNext();
    };

    function getNamesBatch() {
      return [
        {
          name: "Daniel",
          sex: "M"
        },
        {
          name: "Amanda",
          sex: "F"
        },
        {
          name: "Sebastian",
          sex: "M"
        },
        {
          name: "Renee",
          sex: "F"
        }
      ];
    }

    function getNext() {
      index++;
      if (index < names.length) {
        $scope.current = names[index]
      }
    }

    function sendRating(name, rating) {

    }
  }
})();
