'use strict';

var app = angular.module('app')
app.controller('tagClassChooseCtrl', function ($scope, $rootScope, $window) {
	
	chrome.tabs.executeScript(null, {file: "lib/TreeModel.js"});
	chrome.tabs.executeScript(null, {file: "app/contentScript/vips.js"});
//    var content = $window.localStorage.ClassData;
//    $window.localStorage.ClassData = "hello world"
//
//    console.log("tagClassChoose: \t"+window.localStorage.ClassData);
//	
//	var blob = new Blob([ content ], { type : 'text/plain' });
//	$scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
//    /* The action of tagClassChoose will be fired here */
    $scope.vipsHighlightAll = function(){
        chrome.tabs.executeScript(null, {file: "app/contentScript/vipsHighlightAll.js"});
    };
    $scope.vipsClearAllHighlights = function(){
        chrome.tabs.executeScript(null, {file: "app/contentScript/vipsClearAllHighlights.js"});
    };
    $scope.vipsSuggest = function(){
        chrome.tabs.executeScript(null, {file: "app/contentScript/vipsSuggest.js"});
    };
    $scope.doneWithInput = function(){
        chrome.tabs.executeScript(null, {file: "lib/FileSaver.min.js"}, function() {
            chrome.tabs.executeScript(null, {file: "app/contentScript/doneWithInput.js"});
        });
    };
    $scope.vipsExport = function(){
    	chrome.tabs.executeScript(null, {file: "lib/FileSaver.min.js"}, function() {
    		chrome.tabs.executeScript(null, {file: "app/contentScript/vipsExportAll.js"});
    	});
    };
    $scope.vipsHighlightSiblingBlocks = function(){
    	chrome.tabs.executeScript(null, {file: "lib/FileSaver.min.js"}, function() {
    		chrome.tabs.executeScript(null, {file: "app/contentScript/vipsHighlightSiblingBlocks.js"});
    	});
    };
    $scope.vipsExportLabeledData = function(){
        chrome.tabs.executeScript(null, {file: "lib/FileSaver.min.js"}, function() {
            chrome.tabs.executeScript(null, {file: "app/contentScript/vipsExportLabeledData.js"});
        });
    };
    $scope.vipsDoClassification = function(){
        chrome.tabs.executeScript(null, {file: "lib/FileSaver.min.js"}, function() {
            chrome.tabs.executeScript(null, {file: "app/contentScript/vipsDoClassification.js"});
        });
    };
    $scope.DoCorrection = function(){
        chrome.tabs.executeScript(null, {file: "app/contentScript/DoCorrection.js"});
    };
    $scope.NextCluster = function(){
        chrome.tabs.executeScript(null, {file: "app/contentScript/NextCluster.js"});
    };
    $.getJSON( "http://jsonip.com/", function( data ) {
        //console.log(data);
    });
});

app.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
}]);