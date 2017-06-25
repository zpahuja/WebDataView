'use strict';

angular.module('app').controller('domSelectionCtrl', function ($scope) {

	$scope.init = function(){
    };
    
	$scope.activateDomSelection = function() {
		chrome.tabs.executeScript(null, {file: "app/contentScript/activateDomSelection.js"});
	}
	
	$scope.deactivateDomSelection = function() {
		chrome.tabs.executeScript(null, {file: "app/contentScript/deactivateDomSelection.js"});
	}
    
});