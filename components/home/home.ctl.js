(function () {
  'use strict';

  angular
    .module('SwypeANameApp')
    .controller('HomeController', HomeController);

  function HomeController(authService) {
    var vm = this;
    vm.authService = authService;
  }
})();
