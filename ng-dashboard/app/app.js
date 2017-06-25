'use strict';

var app = angular.module("app", []).run(function($rootScope,selectionContainer){
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if(request.bgData){
            sendResponse({appClass: "In app.js, goodbye"});
            console.log("In app.js !!! " + request.bgData);
        }
    });
    
    $rootScope.$on('selectionHit',function(event,selection){
        //console.log('selectionHit data',selection.toString());
        selectionContainer.setSelection(selection.toString());
    });

    $rootScope.$on('clickData',function(event,selection){
        //console.log('selectionHit data',selection.toString());
        selectionContainer.setSelection(selection.toString());
    });

    $rootScope.$on('classData',function(event,data){
        console.log('We are in Classdata', data);
        
    });

});


angular.module("app").factory('selectionContainer',function(){
    var selezione ={
        setSelection : function(selection){
            if(!window.localStorage.selection){
                window.localStorage.selection = "[]";
            }
            var s = JSON.parse(window.localStorage.selection);
            console.log(s);
            s.push(selection);
            window.localStorage.selection = JSON.stringify(s);

        },
        getSelection: function(){
            return JSON.parse(window.localStorage.selection);
        }
    };
    return selezione;
});