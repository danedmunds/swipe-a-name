(function () {

  'use strict';

  angular
    .module('SwypeANameApp', ['ngMaterial', 'auth0.lock', 'angular-jwt', 'ui.router'])
    .config(config);

  function config($stateProvider, lockProvider, $urlRouterProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('pink');

    // Enable browser color
    $mdThemingProvider.enableBrowserColor();

    $stateProvider
      .state('name', {
        url: '/name',
        controller: 'NameController',
        templateUrl: 'components/name/name.tpl.html',
        controllerAs: 'vm'
      });

    lockProvider.init({
      clientID: 'J45whj0LyPxZv36xXBjDWVitpdjqclB5',
      domain: 'danedmunds.auth0.com',
      options: {
        _idTokenVerification: false,
        allowSignUp: false,
        allowedConnections: ['google-oauth2'],
        languageDictionary: {
          title: "Log in"
        }
      }
    });

    $urlRouterProvider.otherwise('/name');
  }


})();
