angular.module('biblioApp').controller('AddAutorePopupCtrl', function (basePath, $uibModalInstance, items, $http) {
  // this sarebbe lo $scope del comntroller. si puo' anche scrivere $scope ricordandosi di fare inject sopra
  var $ctrl = this;
  // items sono le cose passate dal controller 'padre' tramite la resolve. fare attenzione che il nome deve matchare e deve essere injected
  
  //solo come esempio di passaggio tra controller padre e modale
/*  $ctrl.items = items;
  $ctrl.selected = {
    item: $ctrl.items[0]
  };*/

  $ctrl.ok = function () {
    //se premo su ok devo salvare l'autore. se (then) ha successo allora posso chiudere POSITIVAMENTE il modale
    $http.post(basePath+'autore', $ctrl.newAutore).then(function(result){
      console.log(result);
      $uibModalInstance.close(result.data);
    }, function(errorResult){
      // metto error a true cosi' mostra il danger con scritto errore e NON CHIUDO il modale
      $ctrl.error = true;
    });

  };

  // se premo cancel chiudo il popup NEGATIVAMENTE cosi esegue la seconda callback della promise
  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

angular.module('biblioApp').controller('AddCategoriaPopupCtrl', function (basePath, $uibModalInstance, items, $http) {
  // this sarebbe lo $scope del comntroller. si puo' anche scrivere $scope ricordandosi di fare inject sopra
  var $ctrl = this;
  // items sono le cose passate dal controller 'padre' tramite la resolve. fare attenzione che il nome deve matchare e deve essere injected
  
  //solo come esempio di passaggio tra controller padre e modale
/*  $ctrl.items = items;
  $ctrl.selected = {
    item: $ctrl.items[0]
  };*/

  $ctrl.ok = function () {
    //se premo su ok devo salvare l'categoria. se (then) ha successo allora posso chiudere POSITIVAMENTE il modale
    $http.post(basePath+'categoria', $ctrl.newCategoria).then(function(result){
      console.log(result);
      $uibModalInstance.close(result.data);
    }, function(errorResult){
      // metto error a true cosi' mostra il danger con scritto errore e NON CHIUDO il modale
      $ctrl.error = true;
    });

  };

  // se premo cancel chiudo il popup NEGATIVAMENTE cosi esegue la seconda callback della promise
  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

angular.module('biblioApp').controller('AddUtentePopupCtrl', function (basePath, $uibModalInstance, items, $http) {
  // this sarebbe lo $scope del comntroller. si puo' anche scrivere $scope ricordandosi di fare inject sopra
  var $ctrl = this;
  // items sono le cose passate dal controller 'padre' tramite la resolve. fare attenzione che il nome deve matchare e deve essere injected
  
  //solo come esempio di passaggio tra controller padre e modale
/*  $ctrl.items = items;
  $ctrl.selected = {
    item: $ctrl.items[0]
  };*/

  $ctrl.ok = function () {
    //se premo su ok devo salvare l'utente. se (then) ha successo allora posso chiudere POSITIVAMENTE il modale
    $http.post(basePath+'utente', $ctrl.newUtente).then(function(result){
      console.log(result);
      $uibModalInstance.close(result.data);
    }, function(errorResult){
      // metto error a true cosi' mostra il danger con scritto errore e NON CHIUDO il modale
      $ctrl.error = true;
    });

  };

  // se premo cancel chiudo il popup NEGATIVAMENTE cosi esegue la seconda callback della promise
  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});