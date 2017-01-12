'use strict';

/**
 * @ngdoc overview
 * @name biblioApp
 * @description
 * # biblioApp
 *
 * Main module of the application.
 */
angular
  .module('biblioApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .value('basePath', 'http://localhost:8080/')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/libri', {
        templateUrl: 'views/libri.html',
        controller: 'LibriCtrl',
        controllerAs: 'libri'
      })
      .when('/nuovoLibro', {
        templateUrl: 'views/nuovoLibro.html',
        controller: 'NuovoLibroCtrl',
        controllerAs: 'nuovoLibro'
      })
      .when('/autori', {
        templateUrl: 'views/autori.html',
        controller: 'AutoriCtrl',
        controllerAs: 'autori'
      })
      .when('/categorie', {
        templateUrl: 'views/categorie.html',
        controller: 'CategorieCtrl',
        controllerAs: 'categorie'
      })
      .when('/utenti', {
        templateUrl: 'views/utenti.html',
        controller: 'UtentiCtrl',
        controllerAs: 'utenti'
      })
      .when('/nuovaLettura', {
        templateUrl: 'views/nuovaLettura.html',
        controller: 'NuovaLetturaCtrl',
        controllerAs: 'nuovaLettura'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
