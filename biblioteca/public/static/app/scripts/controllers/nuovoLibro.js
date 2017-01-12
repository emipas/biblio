'use strict';

/**
 * @ngdoc function
 * @name biblioApp.controller:NuovoLibroCtrl
 * @description
 * # NuovoLibroCtrl
 * Controller of the biblioApp
 */
 angular.module('biblioApp')
 .controller('NuovoLibroCtrl', function ($uibModal, $log, $scope, $http, basePath, $location) {

$scope.book = {};
$scope.book.autori = [];
$scope.book.categorie = [];

$scope.salvaLibro = function (book) {
  //pulire array

  var bookToSend = angular.copy(book);
  var categorieDescriptions = [];
  for (var i = book.categorie.length - 1; i >= 0; i--) {
    categorieDescriptions.push(book.categorie[i].descrizione);
  }
  bookToSend.categorie = categorieDescriptions;

  var autoriDescriptions = [];
  for (var i = book.autori.length - 1; i >= 0; i--) {
    autoriDescriptions.push(book.autori[i].nome_autore);
  }
  bookToSend.autori = autoriDescriptions;  


  return $http.post(basePath+"libro", bookToSend)
  .then(function (response) {
    $location.path('libri');
  });
};

$http.get(basePath+'autori').then(function(result){
  console.log(result);
  $scope.autori = result.data;
});

$scope.isAddedAutore = function (autore) {
  if(autore == undefined){
  return;
 }
  if (book.autori.indexOf(autore) >= 0){
    return false;
  } else {
    return true;
  }
};

$scope.addAutore = function(autore) {
  autore.isAddedAutore = true;
  $scope.book.autori.push(autore);
}
$scope.removeAutore = function(autore) {
  autore.isAddedAutore = false;
  $scope.book.autori.splice($scope.book.autori.indexOf(autore), 1);
};

$http.get(basePath+'categorie').then(function(result){
  console.log(result);
  $scope.categorie = result.data;
});

$scope.isAddedCategoria = function (categoria) {
  if(categoria == undefined){
  return;
 }
  if (book.categorie.indexOf(categoria) >= 0){
    return false;
  } else {
    return true;
  }
};

$scope.addCategoria = function(categoria) {
  categoria.isAddedCategoria = true;
  $scope.book.categorie.push(categoria);
}
$scope.removeCategoria = function(categoria) {
  categoria.isAddedCategoria = false;
  $scope.book.categorie.splice($scope.book.categorie.indexOf(categoria), 1);
};


$http.get(basePath+'utenti').then(function(result){
  console.log(result);
  $scope.utenti = result.data;
});

$scope.isAddedUtente = function (utente) {
  if(utente == undefined){
  return;
 }
  if (book.utenti.indexOf(utente) >= 0){
    return false;
  } else {
    return true;
  }
};

$scope.addUtente = function(utente) {
  utente.isAddedUtente = true;
  $scope.book.utenti.push(utente);
}
$scope.removeUtente = function(utente) {
  utente.isAddedUtente = false;
  $scope.book.utenti.splice($scope.book.utenti.indexOf(utente), 1);
};


// come esempio di passaggio tra il controller padre e modale
//$scope.items = ['emiliop', 'raffa'];
$scope.animationsEnabled = true;
$scope.openAutorePopup = function (size, parentSelector) {
  var parentElem = parentSelector ? 
    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
  var modalInstance = $uibModal.open({
    animation: $scope.animationsEnabled,
    ariaLabelledBy: 'modal-title',
    ariaDescribedBy: 'modal-body',
    // e' definito un template come script nella pagina della view di nuovolibro che si chiama cosi'
    templateUrl: 'ModalContentAutore.html',
    //e' definito un controller in un file apposito, angular lo sa trovare in automantico. In questo controller metti tutta la logica che e' interna al popup
    controller: 'AddAutorePopupCtrl',
    controllerAs: '$ctrl',
    size: size,
    appendTo: parentElem,
    //sono le variabili che si possono passaere al controller del popup. NB vanno injectate nel controller con lo stesso nome di qua sotto
    resolve: {
      items: function () {
        return $scope.items;
      }
    }
  });
  // PROIMISE PATTERN: se l'istanza del modale viene chiusa positivamente (cioe' con $uibModalInstance.close(param)) esegue la prima callback passando param
  modalInstance.result.then(function (selectedItem) {
    $scope.autori.push(selectedItem);
    // esempio ho cliccato su Salva o OK, quindi devo salvare l'elemento
  },
  // altrimenti se è dismesso con $uibModalInstance.dismiss('cancel') esegue la seconda callback di "errore"
   function () {
    $log.info('Modal dismissed at: ' + new Date());
  });
};

$scope.openCategoriaPopup = function (size, parentSelector) {
  var parentElem = parentSelector ? 
    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
  var modalInstance = $uibModal.open({
    animation: $scope.animationsEnabled,
    ariaLabelledBy: 'modal-title',
    ariaDescribedBy: 'modal-body',
    // e' definito un template come script nella pagina della view di nuovolibro che si chiama cosi'
    templateUrl: 'ModalContentCategoria.html',
    //e' definito un controller in un file apposito, angular lo sa trovare in automantico. In questo controller metti tutta la logica che e' interna al popup
    controller: 'AddCategoriaPopupCtrl',
    controllerAs: '$ctrl',
    size: size,
    appendTo: parentElem,
    //sono le variabili che si possono passaere al controller del popup. NB vanno injectate nel controller con lo stesso nome di qua sotto
    resolve: {
      items: function () {
        return $scope.items;
      }
    }
  });
  // PROIMISE PATTERN: se l'istanza del modale viene chiusa positivamente (cioe' con $uibModalInstance.close(param)) esegue la prima callback passando param
  modalInstance.result.then(function (selectedItem) {
    $scope.categorie.push(selectedItem);
    // esempio ho cliccato su Salva o OK, quindi devo salvare l'elemento
  },
  // altrimenti se è dismesso con $uibModalInstance.dismiss('cancel') esegue la seconda callback di "errore"
   function () {
    $log.info('Modal dismissed at: ' + new Date());
  });
};

$scope.openUtentePopup = function (size, parentSelector) {
  var parentElem = parentSelector ? 
    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
  var modalInstance = $uibModal.open({
    animation: $scope.animationsEnabled,
    ariaLabelledBy: 'modal-title',
    ariaDescribedBy: 'modal-body',
    // e' definito un template come script nella pagina della view di nuovolibro che si chiama cosi'
    templateUrl: 'ModalContentUtente.html',
    //e' definito un controller in un file apposito, angular lo sa trovare in automantico. In questo controller metti tutta la logica che e' interna al popup
    controller: 'AddUtentePopupCtrl',
    controllerAs: '$ctrl',
    size: size,
    appendTo: parentElem,
    //sono le variabili che si possono passaere al controller del popup. NB vanno injectate nel controller con lo stesso nome di qua sotto
    resolve: {
      items: function () {
        return $scope.items;
      }
    }
  });
  // PROIMISE PATTERN: se l'istanza del modale viene chiusa positivamente (cioe' con $uibModalInstance.close(param)) esegue la prima callback passando param
  modalInstance.result.then(function (selectedItem) {
    $scope.utenti.push(selectedItem);
    // esempio ho cliccato su Salva o OK, quindi devo salvare l'elemento
  },
  // altrimenti se è dismesso con $uibModalInstance.dismiss('cancel') esegue la seconda callback di "errore"
   function () {
    $log.info('Modal dismissed at: ' + new Date());
  });
};

});
