(function () {
  'use strict';

  angular
    .module('SwypeANameApp')
    .controller('LoginController', LoginController);

  function LoginController($scope, authService, $state) {
    var vm = this;
    vm.authService = authService;

    if ($scope.isAuthenticated) {
      return $state.go('name')
    }
  }
})();
