(function () {
  'use strict';

  angular
    .module('SwypeANameApp')
    .controller('LoginController', LoginController);

  function LoginController(authService) {

    var vm = this;

    vm.authService = authService;

  }
})();
