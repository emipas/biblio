'use strict';

/**
 * @ngdoc function
 * @name biblioApp.controller:NuovoLibroCtrl
 * @description
 * # NuovoLibroCtrl
 * Controller of the biblioApp
 */
 angular.module('biblioApp')
 .controller('NuovaLetturaCtrl', function ($uibModal, $log, $scope, $http, basePath, $location) {
   
    
    $scope.getLibri = function(){
      $http.get(basePath+'books').then(function(result){
      	console.log(result);
      	$scope.books = result.data;
      });
    };

	$scope.getLibri();

	$scope.getUtenti = function(){
		$http.get(basePath+'utenti').then(function(result){
			console.log(result);
			$scope.utenti = result.data;
		});
	};

	$scope.getUtenti();

	$scope.salvaLibro = function (book) {
	  return $http.post(basePath+"reading", book)
	  .then(function (response) {
   		 $location.path('libri');
	  });
	  	$scope.getLibri();
	};

});