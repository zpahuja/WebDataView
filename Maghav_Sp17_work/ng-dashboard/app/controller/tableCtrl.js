'use strict';

angular.module('app').controller('tableCtrl', function ($scope) {

$scope.init = function(){
        $scope.row = 3;
        $scope.column = 12;
        $scope.rowArray = [0,1,2,3,4,5,6,7,8,9,10];
        $scope.colArray = [0,1,2,3,4,5,6,7,8,9,10,11,12];
    };

    var i = 13; var j = 11;
    $scope.addCols = function(){
		$scope.colArray.push(i);
		i++;
	};
  
    $scope.addRows = function(){
        $scope.rowArray.push(j);
        j++;
    };

});