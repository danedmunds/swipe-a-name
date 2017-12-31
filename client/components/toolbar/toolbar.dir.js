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

  function toolbarController($scope, $window, $rootScope, authService, $state) {
    var vm = this;
    vm.logout = function () {
      authService.logout();
      $state.go('login');
    }
  }
})();
