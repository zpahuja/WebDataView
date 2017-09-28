'use strict';

console.log(chrome.runtime.id);

/**
 * Constants of tab states
 * @enum {bool}
 */
var TAB_STATE = {
    ACTIVE   : true,
    INACTIVE : false
};

/**
 * Constants of tab actions
 * @enum {string}
 */
var TAB_ACTION = {
    INIT : 'INIT',
    HIDE : 'HIDE',
    SHOW : 'SHOW'
};

/**
 * @enum {string}
 */
var VIEW = {
    WEB  : 'WEB',
    GRID : 'GRID',
    BACKGROUND   : 'BACKGROUND',
    NONE : undefined
};

var tabStates = {}; // tracks state of tabs with extension initiated. tabId unique in browser session across windows
var tabViews = {}; // TODO tracks view of tabs
var activeTabId; // id

/**
 * toggles tab state (ACTIVE or INACTIVE) and returns action (INIT, HIDE or SHOW)
 */
function toggleState(tabId) {
    // default tab state is undefined when extension is uninitiated
    if (typeof tabStates[tabId] === 'undefined') {
        tabStates[tabId] = TAB_STATE.ACTIVE;
        return TAB_ACTION.INIT;
    }
    else if (tabStates[tabId] == TAB_STATE.ACTIVE) {
        tabStates[tabId] = TAB_STATE.INACTIVE;
        return TAB_ACTION.HIDE;
    }
    else {
        tabStates[tabId] = TAB_STATE.ACTIVE;
        return TAB_ACTION.SHOW;
    }
}

/**
 * change browser action icon if tab switched
 */
chrome.tabs.onActivated.addListener(function (activeInfo) {
    activeTabId = activeInfo.tabId;
    updateIcon(activeInfo.tabId);
});

/**
 * sets icon of current tab based on its TAB_STATE
 */
function updateIcon(tabId) {
    if (tabId == activeTabId) {
        if (tabStates[tabId] == TAB_STATE.ACTIVE)
            chrome.browserAction.setIcon({path: "assets/images/logo_color_16.png"});
        else
            chrome.browserAction.setIcon({path: "assets/images/logo_grayscale_16.png"});
    }
}

/**
 * toggle footer and browserAction icon
 */
chrome.browserAction.onClicked.addListener(function(tab) {
    var tabAction = toggleState(tab.id);
    activeTabId = tab.id;
    updateIcon(tab.id);
    tabController(tab.id, tabAction);
});

/**
 * Change icon if current tab updated such as url change or reload
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tabId == activeTabId && tabStates[tabId] == TAB_STATE.ACTIVE) {
        // only if url or tab status (loading/ complete) changes
        if (typeof(changeInfo.status) !== 'undefined' || typeof(changeInfo.url) !== 'undefined') {
            tabStates[tabId] = undefined;
            updateIcon((tabId));
            tabController(tab, TAB_ACTION.HIDE);
            console.log("chrome.tabs.onUpdated: active and enabled tab " + tabId + "; status: " + changeInfo.status + "; url: " + changeInfo.url);
        }
    }
});

/**
 *
 * @param tab
 * @param tabAction
 */
function tabController(tabId, tabAction, callback) {
    // initiate controller
    if (tabAction == TAB_ACTION.INIT) {
        chrome.tabs.executeScript(null, {file: "lib/jquery/jquery-3.1.1.min.js"}, function() {
            //chrome.tabs.insertCSS(tabId, {file: "lib/bootstrap/css/bootstrap.min.css"});
            chrome.tabs.insertCSS(tabId, {file: "lib/font-awesome/css/font-awesome.css"});
            chrome.tabs.executeScript(null, {file: "lib/ntc.js"});
            chrome.tabs.executeScript(null, {file: "lib/bootstrap/js/bootstrap.min.js"});
            //chrome.tabs.executeScript(null, {file: "lib/FileSaver.min.js"});
            chrome.tabs.executeScript(null, {file: "lib/jquery/jquery-ui.min.js"});
            chrome.tabs.executeScript(null, {file: "lib/jquery/jquery.dataTables.min.js"});
            chrome.tabs.executeScript(null, {file: "lib/mousetrap.min.js"}, function() {
                chrome.tabs.executeScript(null, {file: "app/contentScript/hotkeys.js"});
            });
            chrome.tabs.insertCSS(tabId, {file: "assets/css/style.css"});
            chrome.tabs.executeScript(null, {file: "app/contentScript/dataStructures/dom.js"}, function() {
                // web view scripts
                chrome.tabs.executeScript(null, {file: "app/contentScript/webView/webView.js"}, function() {
                    chrome.tabs.executeScript(null, {file: "app/contentScript/webView/widget.js"}, function() {
                        if (chrome.runtime.lastError) {console.error(chrome.runtime.lastError.message);}
                        chrome.tabs.executeScript(null, {file: 'app/contentScript/gridView/gridview-button.js'});
                    });
                    chrome.tabs.executeScript(null, {file: "app/contentScript/webView/popOver.js"});
                });
                // TODO grid view scripts
                chrome.tabs.executeScript(null, {file: 'app/contentScript/gridView/gridview-trigger.js'}, function () {
                });

            });
        });
    }

    // resume
    if (tabAction != TAB_ACTION.HIDE) {
        // TODO show widget, re-highlight past selections, enable popover on click, enable or show grid view if tab view was Grid view
    }

    // pause
    else {
        // TODO hide widget, remove highlights, disable popovers, disable grid view but allow background ops
    }
    typeof callback === 'function' && callback();
}


/**
 * message listener and handler
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var senderTabId = sender.tab.id;
        console.log("Message from tab " + senderTabId + " content script:" + sender.tab.url);
        // handle hotkeys
        if (request.type == "hotkey") {
            // switch to vips tree
            if (request.event == "ctrl+shift+v") {
                if (senderTabId == activeTabId) {
                    chrome.tabs.reload(senderTabId, {bypassCache: false}, function() {
                        // wait for tab to finish reloading
                        chrome.tabs.onUpdated.addListener(function reExecuteScripts (tabId , info) {
                            if (tabId == activeTabId && info.status === 'complete') {
                                // remove listener
                                chrome.tabs.onUpdated.removeListener(reExecuteScripts);
                                // re-execute scripts
                                chrome.tabs.executeScript(null, {file: "lib/jquery/jquery-3.1.1.min.js"}, function() {
                                    //chrome.tabs.insertCSS(tabId, {file: "lib/bootstrap/css/bootstrap.min.css"});
                                    chrome.tabs.insertCSS(tabId, {file: "lib/font-awesome/css/font-awesome.css"});
                                    chrome.tabs.executeScript(null, {file: "lib/ntc.js"});
                                    chrome.tabs.executeScript(null, {file: "lib/bootstrap/js/bootstrap.min.js"});
                                    chrome.tabs.executeScript(null, {file: "lib/jquery/jquery-ui.min.js"});
                                    chrome.tabs.executeScript(null, {file: "lib/jquery/jquery.dataTables.min.js"});
                                    chrome.tabs.executeScript(null, {file: "lib/mousetrap.min.js"}, function() {
                                        chrome.tabs.executeScript(null, {file: "app/contentScript/hotkeys.js"});
                                    });
                                    chrome.tabs.insertCSS(senderTabId, {file: "assets/css/style.css"});

                                    // load vips api
                                    chrome.tabs.executeScript(null, {file: "lib/TreeModel.js"});
                                    chrome.tabs.executeScript(null, {file: "app/contentScript/dataStructures/vips.js"}, function() {
                                        // web view scripts
                                        chrome.tabs.executeScript(null, {file: "app/contentScript/webView/webView.js"}, function() {
                                            chrome.tabs.executeScript(null, {file: "app/contentScript/webView/widget.js"});
                                            chrome.tabs.executeScript(null, {file: "app/contentScript/webView/popOver.js"});
                                            // send message to web view to switch to vips tree
                                            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                                                chrome.tabs.sendMessage(tabs[0].id, {type: "actionRequired", event: "switch to vips"}, function(response) {
                                                    console.log("Received response from webView.js for tab " + senderTabId + " : " + response);
                                                });
                                            });
                                        });
                                        // TODO grid view scripts

                                    });
                                });
                            }
                        });
                    });
                }
                else {
                    sendResponse("Tab must be in focus to request switch to VIPS tree");
                }
            }
        }
    });

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.command == "trigger-gridview") {
            var the_url = "";
            var the_query = "";
            // var the_query = "query1";
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                the_url = tabs[0].url;
                console.log(the_url);
                // if (the_url.indexOf("edu") !== -1 && the_url.indexOf("illinois") !== -1 && the_url.indexOf("directory") !== -1) {
                //     the_query = "query4";
                // } else if (the_url.indexOf("edu") !== -1 || the_url.indexOf("org") !== -1) {
                //     the_query = "query3";
                // }
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
                                url: chrome.extension.getURL('gridView/gridview.html')
                            }, function (newWindow) {
                                console.log(newWindow);
                            });
                        });
                    });
                });
            });
        }
    });