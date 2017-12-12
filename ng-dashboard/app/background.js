'use strict';

/**
 * Constants of tab states
 * @enum {bool}
 */
let socket = null;
let TAB_STATE = {
    ACTIVE   : true,
    INACTIVE : false
};

/**
 * Constants of tab actions
 * @enum {string}
 */
let TAB_ACTION = {
    INIT : 'INIT',
    HIDE : 'HIDE',
    SHOW : 'SHOW'
};

/**
 * @enum {string}
 */
let VIEW = {
    WEB  : 'WEB',
    GRID : 'GRID',
    BACKGROUND   : 'BACKGROUND',
    NONE : undefined
};

let tabStates = {}; // tracks state of tabs with extension initiated. tabId unique in browser session across windows
let tabViews = {}; // TODO tracks view of tabs
let activeTabId; // id

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
            chrome.browserAction.setIcon({path: "assets/logo/logo_color_16.png"});
        else
            chrome.browserAction.setIcon({path: "assets/logo/logo_grayscale_16.png"});
    }
}

/**
 * toggle widget and browserAction icon
 */
chrome.browserAction.onClicked.addListener(function(tab) {
    let tabAction = toggleState(tab.id);
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
        chrome.tabs.executeScript(null, {file: "app/contentScript/hotkeys.js"});
        chrome.tabs.insertCSS(tabId, {file: "assets/css/style.css"});

        // web view scripts

        chrome.tabs.executeScript(null, {file: "app/contentScript/webView/webViewUtilities.js"}, function() {
            chrome.tabs.executeScript(null, {file: "app/contentScript/webView/webViewMessagePassingHandler.js"}, function () {
                chrome.tabs.executeScript(null, {file: "app/contentScript/webView/widget.js"}, function () {
                    chrome.tabs.executeScript(null, {file: "lib/popper/tooltip.js"}, function () {
                        chrome.tabs.executeScript(null, {file: "app/contentScript/webView/tooltip.js"}, function () {
                            chrome.tabs.executeScript(null, {file: "app/contentScript/webView/webViewController.js"}, function () {
                                chrome.tabs.executeScript(null, {file: "app/contentScript/webView/query.js"}, function () {
                                    chrome.tabs.executeScript(null, {file: "app/contentScript/webView/notification.js"}, function () {
                                        if (chrome.runtime.lastError) {
                                            console.error(chrome.runtime.lastError.message);
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        // TODO grid view scripts
        // chrome.tabs.executeScript(null, {file: "lib/jquery/jquery.dataTables.min.js"});
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
 * message listener and handler handle hot key
     */

chrome.runtime.onConnect.addListener(function(port) {
    socket = io.connect('http://127.0.0.1:5353/');
    // console.log("have been here!!!!");
    // socket.emit('new user', {username: "Herbert", domain_name: "www.amazon.com"});
    // socket = io.connect('http://kite.cs.illinois.edu:5355/');
    console.assert(port.name == "knockknock");
    port.onMessage.addListener(function(msg) {
        if (msg.answer == "new user"){
            console.log("new_user reached!!!");
            socket.emit('new user', {username: msg.username, domain_name: msg.domain_name});
        }
        else if (msg.answer == "send message") {
            console.log("send message reached!!!");
            socket.emit('send message', {username: msg.username, message: msg.message, domain_name: msg.domain_name});

            // port.postMessage({question: "Madame who?"});

        }
        else if (msg.answer == "send message by desc"){
            console.log("send message by desc reached!!!");
            socket.emit('send message by desc', {username: msg.username, message: msg.message, domain_name: msg.domain_name});
            // port.postMessage({question: "I don't get it."});
        }

        else if (msg.answer == "leave"){
            console.log("leave reached!!!");
            console.log("in backgroundjs: " + msg.domain_name);
            socket.emit('leave', {username: msg.username, domain_name: msg.domain_name});
            // port.postMessage({question: "I don't get it."});
        }
    });
    socket.on('get users', function(data) {
        port.postMessage({question: "get users", data: data});
    });

    socket.on('new message', function(data) {
        console.log(data);
        port.postMessage({question: "new message", data: data});
    });
});

chrome.runtime.onMessage.addListener(
    function(request,sender,senderResponse){
        if(request.msg === "socket"){
            console.log("receive from socket server: "+request.text);
        }
        if(request.msg === "xpath"){
            alert("message passed!!!");
        }

    },
    // function(request, sender, sendResponse) {
    //     let senderTabId = sender.tab.id;
    //     console.log("Message from tab " + senderTabId + " content script:" + sender.tab.url);
    //     // handle hotkeys
    //     if (request.type == "hotkey") {
    //         /**
    //          * VIPS tree not supported anymore
    //          * Comment stub below provided as an example how to handle hot keys request using message passing
    //          */
    //         /*
    //          // switch to vips tree
    //          if (request.event == "ctrl+shift+v") {
    //          if (senderTabId == activeTabId) {
    //          chrome.tabs.reload(senderTabId, {bypassCache: false}, function() {
    //          // wait for tab to finish reloading
    //          chrome.tabs.onUpdated.addListener(function reExecuteScripts (tabId , info) {
    //          if (tabId == activeTabId && info.status === 'complete') {
    //          // remove listener
    //          chrome.tabs.onUpdated.removeListener(reExecuteScripts);
    //          // re-execute scripts
    //          // CODE REMOVED
    //          }
    //          });
    //          });
    //          }
    //          else {
    //          sendResponse("Tab must be in focus to request switch to VIPS tree");
    //          }
    //          }
    //          */
    //     }
    // }
);

