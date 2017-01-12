'use strict';

/**
 * @ngdoc function
 * @name biblioApp.controller:AutoriCtrl
 * @description
 * # AutoriCtrl
 * Controller of the biblioApp
 */
angular.module('biblioApp')
  .controller('CategorieCtrl', function ($uibModal, $scope, $http, $location, basePath, $log) {
  
  $scope.categorie = [];

  $scope.getCategorie = function() {
  	$http.get(basePath+'categorie').then(function(result){
  		console.log(result);
  		$scope.categorie = result.data;
  	});

  };;

  $scope.getCategorie();

  $scope.openDeleteCategoria = function (idCategoria) {
  	console.log('cancello id categoria %s', idCategoria);

	    var modalInstance = $uibModal.open({
    animation: true,
    ariaLabelledBy: 'modal-title',
    ariaDescribedBy: 'modal-body',
    // e' definito un template come script nella pagina della view di nuovolibro che si chiama cosi'
    templateUrl: 'PopupCancellaCategoria.html',
    //e' definito un controller in un file apposito, angular lo sa trovare in automantico. In questo controller metti tutta la logica che e' interna al popup
    controller: 'RemoveCategoriaPopupCtrl',
    controllerAs: '$popup', 
    //sono le variabili che si possono passaere al controller del popup. NB vanno injectate nel controller con lo stesso nome di qua sotto
    resolve: {
      idCategoria: function () {
        return idCategoria;
      }
    }
  	});
	// PROIMISE PATTERN: se l'istanza del modale viene chiusa positivamente (cioe' con $uibModalInstance.close(param)) esegue la prima callback passando param
	modalInstance.result.then(function () {
	// se vai a buon fine 
	$scope.getCategorie();
	// esempio ho cliccato su Salva o OK, quindi devo salvare l'elemento
	},
	// altrimenti se è dismesso con $uibModalInstance.dismiss('cancel') esegue la seconda callback di "errore"
	function () {
	$log.info('Modal dismissed at: ' + new Date());
	});

  };


});


  angular.module('biblioApp').controller('RemoveCategoriaPopupCtrl',function(basePath, $uibModalInstance, idCategoria, $http) {

  	var $popup = this;

  	$popup.id_categoria = idCategoria;

  	$popup.ok = function () {
	    $http.post(basePath+'cancCategoria', {id_categoria : idCategoria}).then(function(result){
	      console.log(result);
	      $uibModalInstance.close(result.data);
	    }, function(errorResult){
	      // metto error a true cosi' mostra il danger con scritto errore e NON CHIUDO il modale
	      $popup.error = true;
        $popup.errorMsg = errorResult.data.errorMsg;
	    });

  	};

	$popup.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};



  })