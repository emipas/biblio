'use strict';

/**
 * @ngdoc function
 * @name biblioApp.controller:AutoriCtrl
 * @description
 * # AutoriCtrl
 * Controller of the biblioApp
 */
angular.module('biblioApp')
  .controller('AutoriCtrl', function ($uibModal, $scope, $http, $location, basePath, $log) {
  	
  	$scope.autori = [];

 	$scope.getAutori = function () {  
    $http.get(basePath+'autori').then(function(result){
      console.log(result);
      $scope.autori = result.data;
    });

  	};
    

  	$scope.getAutori();

  	$scope.openDeleteAutore = function(idAutore) {
		console.log('cancello id autore %s', idAutore);

    	var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        // e' definito un template come script nella pagina della view di nuovolibro che si chiama cosi'
        templateUrl: 'PopupCancellaAutore.html',
        //e' definito un controller in un file apposito, angular lo sa trovare in automantico. In questo controller metti tutta la logica che e' interna al popup
        controller: 'RemoveAutorePopupCtrl',
        controllerAs: '$popup', 
        //sono le variabili che si possono passaere al controller del popup. NB vanno injectate nel controller con lo stesso nome di qua sotto
        resolve: {
          idAutore: function () {
            return idAutore;
          }
        }
      });
      // PROIMISE PATTERN: se l'istanza del modale viene chiusa positivamente (cioe' con $uibModalInstance.close(param)) esegue la prima callback passando param
      modalInstance.result.then(function () {
        // se vai a buon fine 
        $scope.getAutori();
        // esempio ho cliccato su Salva o OK, quindi devo salvare l'elemento
      },
      // altrimenti se è dismesso con $uibModalInstance.dismiss('cancel') esegue la seconda callback di "errore"
       function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

  	}

  });

  angular.module('biblioApp').controller('RemoveAutorePopupCtrl', function(basePath, $uibModalInstance, idAutore, $http) {
  	var $popup = this;

  	$popup.id_autore = idAutore;

  	$popup.ok = function () {
	    $http.post(basePath+'cancAutore', {id_autore : idAutore}).then(function(result){
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
