(function () {
  'use strict';

  angular
    .module('SwypeANameApp')
    .controller('NameController', NameController);

  function NameController($scope, authService) {
    var vm = this;
    vm.authService = authService;

    vm.data = {
      name: "Daniel",
      sex: "M"
    }

    $scope.toss = function(ev) {
      // bad
      alert('You swiped left!!');
    };

    $scope.keep = function(ev) {
      // good
      alert('You swiped right!!');
    };
  }
})();
