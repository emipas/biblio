'use strict';

/**
 * @ngdoc function
 * @name biblioApp.controller:AutoriCtrl
 * @description
 * # AutoriCtrl
 * Controller of the biblioApp
 */
angular.module('biblioApp')
  .controller('UtentiCtrl', function ($uibModal, $scope, $http, $location, basePath) {

	$scope.utenti = [];

	$scope.getUtenti = function() {
		$http.get(basePath+'utenti').then(function(result){
			console.log(result);
			$scope.utenti = result.data;
		});
	};

	$scope.getUtenti();

	$scope.openDeleteUtente = function(idUtente) {
		console.log('cancello id utente %s', idUtente);

    	var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        // e' definito un template come script nella pagina della view di nuovolibro che si chiama cosi'
        templateUrl: 'PopupCancellaUtente.html',
        //e' definito un controller in un file apposito, angular lo sa trovare in automantico. In questo controller metti tutta la logica che e' interna al popup
        controller: 'RemoveUtentePopupCtrl',
        controllerAs: '$popup', 
        //sono le variabili che si possono passaere al controller del popup. NB vanno injectate nel controller con lo stesso nome di qua sotto
        resolve: {
          idUtente: function () {
            return idUtente;
          }
        }
      });
      // PROIMISE PATTERN: se l'istanza del modale viene chiusa positivamente (cioe' con $uibModalInstance.close(param)) esegue la prima callback passando param
      modalInstance.result.then(function () {
        // se vai a buon fine 
        $scope.getUtenti();
        // esempio ho cliccato su Salva o OK, quindi devo salvare l'elemento
      },
      // altrimenti se è dismesso con $uibModalInstance.dismiss('cancel') esegue la seconda callback di "errore"
       function () {
        $log.info('Modal dismissed at: ' + new Date());
      });


	}


});

  angular.module('biblioApp').controller('RemoveUtentePopupCtrl', function(basePath, $uibModalInstance, idUtente, $http) {
  	var $popup = this;

  	$popup.id_utente = idUtente;

  	$popup.ok = function() {
  		$http.post(basePath+'cancUtente', {id_utente : idUtente}).then(function(result){
  			console.log(result);
  			$uibModalInstance.close(result.data);
  		}, function(errorResult){
  			$popup.error = true;
        $popup.errorMsg = errorResult.data.errorMsg;
  		});
  	};

  	$popup.cancel = function() {
  		$uibModalInstance.dismiss('cancel');
  	};


  })