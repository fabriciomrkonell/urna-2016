'use strict';

angular.module('schApp', ['ui.bootstrap']);

angular.module('schApp').controller('schCtrl', ['$scope', '$http', function($scope, $http) {

  window.location = '#start';

  $scope.podeVotar = false;

  function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (400*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length,c.length);
      }
    }
    return "";
  }

  var url = '107.170.43.204:5000';

  $scope.votoVereador = getCookie('votoVereador') !== '1';
  $scope.votoPrefeito = getCookie('votoPrefeito') !== '1';

  $scope.selected ={
    name: '',
    type: '',
    selected: []
  };

  $scope.dados = [];

  $scope.votePrefeitoSim = function(){
    return $scope.votoPrefeito || $scope.podeVotar;
  };

  $scope.voteVereadorSim = function(){
    return $scope.votoVereador || $scope.podeVotar;
  };

  $scope.transform = function(dados){
    $scope.vereadores.forEach(function(item){
      dados.forEach(function(data){
        if(item.numero === data.numero){
          item.quantidade = data.quantidade;
        }
      });
    });
    $scope.prefeitos.forEach(function(item){
      dados.forEach(function(data){
        if(item.numero === data.numero){
          item.quantidade = parseInt(data.quantidade);
        }
      });
    });
  };

  $scope.getCandidatos = function(name, list, type){
    document.getElementById('modal-body').scrollTop = 0;
    $scope.selected ={
      name: name,
      selected: list,
      type: type
    };
  };

  $scope.getCountVotos = function(type){
    var total = 0;
    $scope.dados.forEach(function(item){
      if(type === item.tipo){
        total = total + parseInt(item.quantidade);
      }
    })
    return total;
  };

  $scope.getCountSelectedVotos = function(number, type){
    var total = 0;
    $scope.dados.forEach(function(item){
      if((number === item.numero) && (type === item.tipo)) total = item.quantidade;
    });
    return total;
  };

  $scope.validVote = function(type, entity){
    if(entity !== ''){
      $scope.vote(entity.numero, type);
    }else{
      if(type === '0'){
        $scope.validPrefeito = true;
      }else{
        $scope.validVereador = true;
      }
    }
  };

  $scope.vote = function(number, type){
    document.getElementById('audio').play();
    $http.post(url + '/app', {
      numero: number,
      tipo: type
    }).then(function(data){
      $scope.dados = data.data.data;
      $scope.transform(data.data.data);
      document.getElementById('modal-body').scrollTop = 0;
      if(type === '0'){
        $scope.getCandidatos('Prefeitos', $scope.prefeitos, '0');
        $scope.prefeito = '';
        $scope.validPrefeito = false;
        $scope.votoPrefeito = false;
        setCookie('votoPrefeito', '1');
      }else{
        $scope.getCandidatos('Vereadores', $scope.vereadores, '1');
        $scope.vereador = '';
        $scope.validVereador = false;
        $scope.votoVereador = false;
        setCookie('votoVereador', '1');
      }
      window.location = "#modal";
    });
  };

  $scope.hasVereador = function(){
    return ($scope.vereador === '') && ($scope.validVereador);
  };

  $scope.hasPrefeito = function(){
    return ($scope.prefeito === '') && ($scope.validPrefeito);
  };

  $scope.vereador = '';
  $scope.validVereador = false;
  $scope.prefeito = '';
  $scope.validPrefeito = false;

  $scope.vereadores = [];
  $scope.prefeitos = [];

  $http.get(url + '/app/dados').then(function(data){
    data = data.data;
    $scope.podeVotar = data.podeVotar;
    $scope.vereadores = data.data.vereadores;
    $scope.prefeitos = data.data.prefeitos;
    $http.get(url + '/app').then(function(_data){
      $scope.dados = _data.data.data;
      $scope.transform(_data.data.data);
    });
  });

}]);