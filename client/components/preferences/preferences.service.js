(function () {

  'use strict';

  angular
    .module('SwypeANameApp')
    .service('preferencesService', preferencesService);

  function preferencesService() {

    var preferences = load()

    function load () {
      return JSON.parse(localStorage.getItem('preferences') || '{}');
    }

    function save () {
      localStorage.setItem('preferences', JSON.stringify(preferences));
    }

    function get (key) {
      return preferences[key]
    }

    function set (key, value) {
      preferences[key] = value
      save()
    }

    return {
      get, set
    }
  }
})();
