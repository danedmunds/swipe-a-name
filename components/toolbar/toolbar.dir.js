(function () {

  'use strict';

  angular
    .module('SwypeANameApp')
    .directive('toolbar', toolbar);

  function toolbar() {
    return {
      templateUrl: 'components/toolbar/toolbar.tpl.html',
      controller: toolbarController,
      controllerAs: 'toolbar'
    }
  }

  function toolbarController($scope, $window, $rootScope, authService) {
    var vm = this;
    vm.authService = authService;
  }
})();
