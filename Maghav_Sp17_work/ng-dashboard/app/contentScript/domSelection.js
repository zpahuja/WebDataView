'use strict';

angular.module('app').controller('singleChooseCtrl', function ($scope) {

	$scope.init = function(){
    };
    chrome.storage.sync.get('domSelectionValue', function(result) {
    	console.log(result.domSelectionValue);
    	if (result.domSelectionValue) {
    		$("#activate_dom_selection_checkbox").prop('checked', true);
    	}
    });    
//	if (chrome.storage.sync.get('domSelectionValue', function(result) {console.log(result)})) {
//		$("#activate_dom_selection_checkbox").prop('checked', chrome.storage.sync.get('domSelectionValue')); 
//	}
    
	$scope.onChangeDOMSelectionCheckbox = function() {
		var ok = event.target.checked;
		chrome.storage.sync.set({'domSelectionValue': ok}, function(r) {
			console.log("ok: " + ok)
			if (ok) {
				chrome.tabs.executeScript(null, {file: "app/contentScript/activateDomSelection.js"});
		    } else {
		    	chrome.tabs.executeScript(null, {file: "app/contentScript/deactivateDomSelection.js"});
		    }
	    });
	}
	
    $scope.getSelection = function(){
        $scope.selections = selectionContainer.getSelection();
    };

    $scope.singleChoose = function(){
        chrome.tabs.executeScript(null, {file: "app/contentScript/csSingleChoose.js"});
    };
    
});