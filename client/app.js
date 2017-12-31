(function () {

  'use strict';

  angular
    .module('SwypeANameApp', ['ngMaterial', 'auth0.lock', 'angular-jwt', 'ui.router', 'nzToggle'])
    .config(config);

  function config($stateProvider, lockProvider, $urlRouterProvider, $mdThemingProvider, jwtOptionsProvider, $httpProvider) {
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
      })
      .state('mynames', {
        url: '/mynames',
        controller: 'MyNamesController',
        templateUrl: 'components/mynames/mynames.tpl.html',
        controllerAs: 'vm',
        params: {
          a: 'liked'
        }
      })
      .state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'components/login/login.tpl.html',
        controllerAs: 'vm'
      });
    $urlRouterProvider.otherwise('/name');

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

    // Configuration for angular-jwt
    jwtOptionsProvider.config({
      whiteListedDomains: [
        'localhost', 'swipe.danedmunds.ca'
      ],
      unauthenticatedRedirector: ['$state', function($state) {
        $state.go('login');
      }],
      tokenGetter: function () {
        return localStorage.getItem('id_token');
      }
    });
    $httpProvider.interceptors.push('jwtInterceptor');
  }
})();
