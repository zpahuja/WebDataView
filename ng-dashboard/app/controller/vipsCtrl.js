'use strict';

var app = angular.module('app')
app.controller('tagClassChooseCtrl', function ($scope, $rootScope, $window) {

	console.log("AAAAA");
	chrome.tabs.executeScript(null, {file: "lib/TreeModel.js"});
	chrome.tabs.executeScript(null, {file: "app/contentScript/vips.js"});
	chrome.tabs.executeScript(null, {file: "lib/kMeans.js"});
    chrome.tabs.executeScript(null, {file: "app/contentScript/webDataViewInit.js"});
	//chrome.tabs.executeScript(null, {file: "lib/jquery/jquery-3.1.1.min.js"});
	chrome.tabs.executeScript(null, {file: "lib/bootstrap/js/bootstrap.3.3.7.min.js"});
	chrome.tabs.executeScript(null, {file: "lib/fontawesome.js"});
    chrome.tabs.executeScript(null, {file: "lib/jquery/jquery.dataTables.min.js"});


	/* The action of tagClassChoose will be fired here */

    $scope.vipsCompareClusters = function(){
        chrome.tabs.executeScript(null, {file: "app/contentScript/vipsCompareClusters.js"});
    };

	$scope.vipsInitialCluster = function(){
		chrome.tabs.executeScript(null, {file: "app/contentScript/vipsInitialCluster.js"});
	};

	$scope.vipkmeans = function(){
		chrome.tabs.executeScript(null, {file: "lib/FileSaver.min.js"}, function() {
			chrome.tabs.executeScript(null, {file: "app/contentScript/wdvKMeans.js"}, function() {
				chrome.tabs.executeScript(null, {file: "app/contentScript/popOver.js"});
			});
		});
	};

	$scope.vipsSelectView = function(){
		chrome.tabs.executeScript(null, {file: "app/contentScript/selectView.js"});
	};

	$scope.vipsHighlightSorted = function(){
		chrome.tabs.executeScript(null, {file: "app/contentScript/vipsHighlightSorted.js"});
	};

	$scope.vipsHighlightYSorted = function(){
		chrome.tabs.executeScript(null, {file: "app/contentScript/vipsHighlightYSorted.js"});
	};

	$scope.vipsHighlightGrid = function(){
		chrome.tabs.executeScript(null, {file: "lib/FileSaver.min.js"}, function() {
			chrome.tabs.executeScript(null, {file: "app/contentScript/wdvKMeans.js"}, function() {
				chrome.tabs.executeScript(null, {file: "app/contentScript/vipsGridHighlight.js"});
			});
		});
	};

    /*
	$scope.vipsCluster = function(){
		chrome.tabs.executeScript(null, {file: "lib/nlp_compromise.min.js"}, function() {
			chrome.tabs.executeScript(null, {file: "app/contentScript/vipsHighlightLabels.js"}, function() {
				chrome.tabs.executeScript(null, {file: "app/contentScript/vipsCluster.js"});
			});
		});
	};
	*/
});

app.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
}]);