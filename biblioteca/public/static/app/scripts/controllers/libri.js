'use strict';

/**
 * @ngdoc function
 * @name biblioApp.controller:LibriCtrl
 * @description
 * # LibriCtrl
 * Controller of the biblioApp
 */
angular.module('biblioApp')
  .controller('LibriCtrl', function ($uibModal, $log, $scope, $http, $location, basePath) {
    
    $scope.libri = [];
    
    $scope.getLibri = function(){
      $http.get(basePath+'libri').then(function(result){
      	console.log(result);
      	$scope.libri = result.data;
      });

    };

    $scope.getLibri();
    $scope.openDeleteLibro = function(idlibro){
      console.log('cancello id libro %s', idlibro);
      
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        // e' definito un template come script nella pagina della view di nuovolibro che si chiama cosi'
        templateUrl: 'PopupCancellaLibro.html',
        //e' definito un controller in un file apposito, angular lo sa trovare in automantico. In questo controller metti tutta la logica che e' interna al popup
        controller: 'RemoveLibroPopupCtrl',
        controllerAs: '$popup', 
        //sono le variabili che si possono passaere al controller del popup. NB vanno injectate nel controller con lo stesso nome di qua sotto
        resolve: {
          idlibro: function () {
            return idlibro;
          }
        }
      });
      // PROIMISE PATTERN: se l'istanza del modale viene chiusa positivamente (cioe' con $uibModalInstance.close(param)) esegue la prima callback passando param
      modalInstance.result.then(function () {
        // se vai a buon fine 
        $scope.getLibri();
        // esempio ho cliccato su Salva o OK, quindi devo salvare l'elemento
      },
      // altrimenti se è dismesso con $uibModalInstance.dismiss('cancel') esegue la seconda callback di "errore"
       function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };

    $scope.openUpdateLibro = function(book){
      console.log("modifico id libro %s", book);
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        // e' definito un template come script nella pagina della view di nuovolibro che si chiama cosi'
        templateUrl: 'PopupModificaLibro.html',
        //e' definito un controller in un file apposito, angular lo sa trovare in automantico. In questo controller metti tutta la logica che e' interna al popup
        controller: 'UpdateLibroPopupCtrl',
        controllerAs: '$popup', 
        //sono le variabili che si possono passaere al controller del popup. NB vanno injectate nel controller con lo stesso nome di qua sotto
        resolve: {
          book: function () {
            return book;
          }
        }
      });
      // PROIMISE PATTERN: se l'istanza del modale viene chiusa positivamente (cioe' con $uibModalInstance.close(param)) esegue la prima callback passando param
      modalInstance.result.then(function () {
        // se vai a buon fine 
        $scope.getLibri();
        // esempio ho cliccato su Salva o OK, quindi devo salvare l'elemento
      },
      // altrimenti se è dismesso con $uibModalInstance.dismiss('cancel') esegue la seconda callback di "errore"
       function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };

    /*
    Apri pagina gestione autori
    */
    $scope.goToAutori = function () {
      $location.path('autori');
    };
    
    $http.get(basePath+'autori').then(function(result){
      console.log(result);
      $scope.autori = result.data;
    });


    //Apri pagina gestione categorie
    $scope.goToCategorie = function() {
      //location = servizio angular
      $location.path('categorie');
    };
    
    
    $http.get(basePath+'categorie').then(function(result){
      console.log(result);
      $scope.categorie = result.data;
    });

    //apri pagina gestione utenti
    $scope.goToUtenti = function() {
      $location.path('utenti');
    };

    $http.get(basePath+'utenti').then(function(result){
      console.log(result);
      $scope.utenti = result.data;
    });

  });


angular.module('biblioApp').controller('RemoveLibroPopupCtrl', function (basePath, $uibModalInstance, idlibro, $http) {
  // this sarebbe lo $scope del comntroller. si puo' anche scrivere $scope ricordandosi di fare inject sopra
  var $popup = this;
  // items sono le cose passate dal controller 'padre' tramite la resolve. fare attenzione che il nome deve matchare e deve essere injected
  console.log(idlibro);
  $popup.idLibro = idlibro;
  //solo come esempio di passaggio tra controller padre e modale
/*  $ctrl.items = items;
  $ctrl.selected = {
    item: $ctrl.items[0]
  };*/

  $popup.ok = function () {
    //se premo su ok devo salvare l'utente. se (then) ha successo allora posso chiudere POSITIVAMENTE il modale
    $http.post(basePath+'cancLibro', {idLibro : idlibro}).then(function(result){
      console.log(result);
      $uibModalInstance.close(result.data);
    }, function(errorResult){
      // metto error a true cosi' mostra il danger con scritto errore e NON CHIUDO il modale
      $popup.error = true;
    });

  };

  // se premo cancel chiudo il popup NEGATIVAMENTE cosi esegue la seconda callback della promise
  $popup.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});


angular.module('biblioApp').controller('UpdateLibroPopupCtrl', function (basePath, $uibModalInstance, book, $http) {
  // this sarebbe lo $scope del comntroller. si puo' anche scrivere $scope ricordandosi di fare inject sopra
  var $popup = this;
  // items sono le cose passate dal controller 'padre' tramite la resolve. fare attenzione che il nome deve matchare e deve essere injected
  $popup.libro = angular.copy(book);
  $popup.libro.data_inizio_lettura = new Date($popup.libro.data_inizio_lettura);
  $popup.libro.data_fine_lettura = new Date($popup.libro.data_fine_lettura);
  $popup.libro.data_ultimo_accesso = new Date($popup.libro.data_ultimo_accesso);
  $popup.libro.data_registrazione = new Date($popup.libro.data_registrazione);
  //solo come esempio di passaggio tra controller padre e modale
/*  $ctrl.items = items;
  $ctrl.selected = {
    item: $ctrl.items[0]
  };*/

  $popup.ok = function () {
    //se premo su ok devo salvare l'utente. se (then) ha successo allora posso chiudere POSITIVAMENTE il modale
    $http.post(basePath+'modLibro', {libro : $popup.libro}).then(function(result){
      console.log(result);
      $uibModalInstance.close($popup.libro);
    }, function(errorResult){
      // metto error a true cosi' mostra il danger con scritto errore e NON CHIUDO il modale
      $popup.error = true;
    });

  };

  // se premo cancel chiudo il popup NEGATIVAMENTE cosi esegue la seconda callback della promise
  $popup.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };


  
});