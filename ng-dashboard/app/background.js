'use strict';

/**
 * Constants of tab states
 * @enum {bool}
 */
var TAB_STATE = {
    ACTIVE: true,
    INACTIVE: false
};

/**
 * Constants of tab actions
 * @enum {string}
 */
var TAB_ACTION = {
    INIT: 'INIT',
    HIDE: 'HIDE',
    SHOW: 'SHOW'
};

var tabStates = {}; // tracks state of tabs with extension initiated

/**
 * toggles tab state (ACTIVE or INACTIVE) and returns action (INIT, HIDE or SHOW)
 */
function toggleState(id) {
    // default tab state is undefined when extension is uninitiated
    if (typeof tabStates[id] === 'undefined') {
        tabStates[id] = TAB_STATE.ACTIVE;
        return TAB_ACTION.INIT;
    }
    else if (tabStates[id] == TAB_STATE.ACTIVE) {
        tabStates[id] = TAB_STATE.INACTIVE;
        return TAB_ACTION.HIDE;
    }
    else {
        tabStates[id] = TAB_STATE.ACTIVE;
        return TAB_ACTION.SHOW;
    }
}

/**
 * toggle footer and browserAction icon
 */
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.storage.local.clear();
    var tabAction = toggleState(tab.id);

    // initiate controller
    if (tabAction == TAB_ACTION.INIT) {
        chrome.tabs.insertCSS(tab.id, {file: "lib/handsontable/handsontable.full.min.js"});
        chrome.tabs.executeScript(null, {file: "lib/jquery/jquery-3.1.1.min.js"}, function () {
            // chrome.tabs.executeScript(null, {file: "app/node_modules/kmeans-js/kMeans.js"});
            chrome.tabs.executeScript(null, {file: "lib/TreeModel.js"});
            // chrome.tabs.executeScript(null, {file: "app/contentScript/vips/vips.js"});
            // chrome.tabs.executeScript(null, {file: "lib/kMeans.js"});
            chrome.tabs.executeScript(null, {file: "lib/bootstrap/js/bootstrap.3.3.7.min.js"});
            // chrome.tabs.executeScript(null, {file: 'lib/handsontable/handsontable.full.min.js'});
            chrome.tabs.executeScript(null, {file: "lib/jquery/jquery.dataTables.min.js"});
            chrome.tabs.insertCSS(tab.id, {file: "lib/bootstrap/css/bootstrap.min.css"});
            chrome.tabs.insertCSS(tab.id, {file: "assets/css/style.css"});

            chrome.tabs.executeScript(null, {file: 'footer/simpleMessagePassingFromContentScript.js'}, function () {
                console.log('hello');
                // chrome.storage.local.get(function (result) {
                //     console.log(result)
                // });
            });

            var the_url = ''
            var the_query = "query1";
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                the_url = tabs[0].url;
                console.log(the_url);
                if (the_url.indexOf("edu") !== -1 || the_url.indexOf("org") !== -1) {
                    the_query = "query3";
                }
                console.log(the_query);
                console.log("Getting from Flask...");
                //$.get( "http://crow.cs.illinois.edu:5000", { url: "https://www.walmart.com/search/?query=laundry&cat_id=0", query: "query1" }, function( data ) {
                $.get( "http://crow.cs.illinois.edu:5000", { url: the_url, query: the_query }, function( data ) {
                    console.log( "Data Loaded: " + data );
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {greeting: data}, function(response) {
                            //console.log(response.farewell);
                            console.log("creating popup...");
                            chrome.windows.create({
                                type: 'popup',
                                url: chrome.extension.getURL('footer/gridview.html')
                            }, function (newWindow) {
                                console.log(newWindow);
                            });
                        });
                    });
                });
            });



            // chrome.tabs.executeScript(null, {file: "lib/FileSaver.min.js"}, function() {
            //   chrome.tabs.executeScript(null, {file: "app/contentScript/wdvKMeans.js"}, function() {
            //     chrome.tabs.executeScript(null, {file: "app/contentScript/popOver.js"}, function() {
            //       chrome.tabs.executeScript(null, {file: 'footer/footer.js'}, function() {
            //           chrome.storage.local.get(function(result){console.log(result)})
            //           chrome.windows.create({
            //               type: 'popup',
            //               url: chrome.extension.getURL('footer/gridview.html')
            //           }, function (newWindow) {
            //               console.log(newWindow);
            //           });
            //       });
            //     });
            //   });
            // });
        });
    }

    // chrome.storage.local.set({'lastname': 10}, function() {
    // });
    //

    if (tabAction != TAB_ACTION.HIDE) {
        // show footer
        // enable icon
    }
    else {
        // hide footer
        // disable icon
    }
    //chrome.tabs.executeScript(null, {file: 'app/contentScript/scripts/filename'});
});