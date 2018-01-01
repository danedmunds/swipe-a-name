(function () {
  'use strict';

  angular
    .module('SwypeANameApp')
    .controller('MyNamesController', MyNamesController);

  function MyNamesController($scope, $http, $state, $stateParams) {
    var vm = this;

    var a = $stateParams.a
    $scope.a = a

    if (!$scope.isAuthenticated) {
      return $state.go('login')
    }

    this.removeRating = function (rating) {
      $http.delete(`/api/v1/ratings/${rating.id}`)
        .then(function success (response) {
          console.log(response.data)
        }, function failure (err) {
          console.log(err)
        })
    }

    this.switchRating = function (rating) {
      $http.post(`/api/v1/ratings`, {
        nameId: rating.nameId,
        userId: rating.userId,
        rating: rating.rating === 'keep' ? 'toss' : 'keep'
      }).then(function success (response) {
        console.log(response.data)
      }, function failure (err) {
        console.log(err)
      })
    }

    var DynamicItems = function() {
      this.loadedPages = {};
      this.numItems = 0;
      this.PAGE_SIZE = 50;

      this.fetchPage_(0);
    };

    // Required.
    DynamicItems.prototype.getItemAtIndex = function(index) {
      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];

      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    // Required.
    DynamicItems.prototype.getLength = function() {
      return this.numItems;
    };

    DynamicItems.prototype.fetchPage_ = function(pageNumber) {
      // Set the page to null so we know it is already being fetched.
      this.loadedPages[pageNumber] = null;
      $http.get(`/api/v1/ratings?rating=${a === 'liked' ? 'keep' : 'toss'}&offset=${this.PAGE_SIZE * pageNumber}&limit=${this.PAGE_SIZE}`)
      .then(angular.bind(this, function success (response) {
        this.numItems = response.data.meta.length
        this.loadedPages[pageNumber] = response.data.data
      }), function failure (err) {
        console.log(err)
      })
    };

    this.dynamicItems = new DynamicItems();
  }
})();
