(function () {

  'use strict';

  angular
    .module('SwypeANameApp')
    .run(run);

  run.$inject = ['$rootScope', 'authService', 'lock', 'authManager'];

  function run($rootScope, authService, lock, authManager) {
    $rootScope.authService = authService;
    authManager.checkAuthOnRefresh();
    authService.registerAuthenticationListener();

    lock.interceptHash();
  }

})();
