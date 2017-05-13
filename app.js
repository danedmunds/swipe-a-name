(function () {

  'use strict';

  angular
    .module('SwypeANameApp', ['ngMaterial', 'auth0.lock', 'angular-jwt', 'ui.router'])
    .config(config);

  function config($stateProvider, lockProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeController',
        templateUrl: 'components/home/home.tpl.html',
        controllerAs: 'vm'
      })
      .state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'components/login/login.tpl.html',
        controllerAs: 'vm'
      });

    lockProvider.init({
      clientID: 'J45whj0LyPxZv36xXBjDWVitpdjqclB5',
      domain: 'danedmunds.auth0.com',
      options: {
        _idTokenVerification: false
      }
    });

    $urlRouterProvider.otherwise('/home');
  }


})();
