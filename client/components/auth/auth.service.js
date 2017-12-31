(function () {

  'use strict';

  angular
    .module('SwypeANameApp')
    .service('authService', authService);

  function authService(lock, authManager, $rootScope) {

    function login() {
      lock.show();
    }

    function logout() {
      localStorage.removeItem('id_token');
      authManager.unauthenticate();
    }

    function registerAuthenticationListener() {
      lock.on('authenticated', function (authResult) {
        localStorage.setItem('id_token', authResult.idToken);
        authManager.authenticate();
        $rootScope.$broadcast('authentication_success');
      });

      lock.on('authorization_error', function (err) {
        console.log(err);
      });
    }

    return {
      login: login,
      logout: logout,
      registerAuthenticationListener: registerAuthenticationListener
    }
  }
})();
