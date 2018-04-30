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
                chrome.tabs.executeScript(null, {file: "app/contentScript/WebDataExtractionNotation/notation.js"}, function () {
                    chrome.tabs.executeScript(null, {file: "app/contentScript/WebDataExtractionNotation/query.js"}, function () {
                        chrome.tabs.executeScript(null, {file: "app/contentScript/webView/widget.js"}, function () {
                            chrome.tabs.executeScript(null, {file: "lib/popper/tooltip.js"}, function () {
                                chrome.tabs.executeScript(null, {file: "app/contentScript/webView/tooltip.js"}, function () {
                                    chrome.tabs.executeScript(null, {file: "app/contentScript/webView/webViewController.js"}, function () {
                                        chrome.tabs.executeScript(null, {file: "app/contentScript/webView/query_group.js"}, function () {
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
    // socket = io.connect('http://127.0.0.1:5353/');
    socket = io.connect('http://kite.cs.illinois.edu:5355/');
    // socket.emit('new user', {username: "Herbert", domain_name: "www.amazon.com"});
    port.onMessage.addListener(function(msg) {
        if (msg.answer == "new user"){
            console.log("new_user reached!!!");
            socket.emit('new user', {username: msg.username, domain_name: msg.domain_name});
        }
        else if (msg.answer == "send message") {
            console.log("send message reached!!!");
            socket.emit('send message', {username: msg.username, message: msg.message, domain_name: msg.domain_name});
        }
        else if (msg.answer == "send message by desc"){
            console.log("send message by desc reached!!!");
            socket.emit('send message by desc', {username: msg.username, message: msg.message, name:msg.name, domain_name: msg.domain_name, query_dom_element: msg.query_dom_element});
        }
        else if (msg.answer == "leave"){
            console.log("leave reached!!!");
            console.log(msg.capa);
            socket.emit('leave', {domain_name: msg.domain_name, capacity: msg.capa});
        }
        else if (msg.answer == "exit"){
            console.log("exit reached!!!");
            socket.emit('exit', {domain_name: msg.domain_name});
        }
        else if (msg.answer == "pre check"){
            console.log("Pre check point!!!");   // Send domain to server and return stored result!
            if(socket.connected === false){
                port.postMessage({question: "no_connection"});
            }
            socket.emit('pre check', {domain_name: msg.domain_name});
        }
    });
    socket.on('get users', function(data) {
        port.postMessage({question: "get users", data: data});
    });

    socket.on('new message', function(data) {
        console.log(data);
        port.postMessage({question: "new message", data: data});
    });

    socket.on('feedback', function(data) {
        console.log(data);
        console.log(port.name);
        port.postMessage({question: "feedback", data: data});
        console.log(data);
    });

    socket.on('tooltip_feedback', function(data) {
        console.log(data);
        port.postMessage({question: "tooltip_feedback", data: data});
    });
});

chrome.runtime.onConnect.addListener(function(port) {

    port.onMessage.addListener(function(msg) {
        if (msg.answer == "table view"){
            /*
             Code to create a popup window for table view, it needs to be run on background.js,
             so web view may need to send a message to background.js and then background.js
             will create that pop-up window
             */
            let data = msg.tb_output;
            /*
             Code to put data to chrome storage, again on background.js.
             Please note that you should maintain the data array like we discussed
             But it needs to be turned to the following format for table view to be able to read
             */
            let fieldNames = [];
            let fieldNameFlags = [];
            for (let j = 0; j < data.length; j++) {
                for (let i in data[j]) {
                    if (fieldNameFlags.indexOf(i)===-1) {
                        fieldNames.push({'title':i,'sTitle':i});
                        fieldNameFlags.push(i);
                    }
                }
            }

            let dataSet = [];
            for (let j = 0; j < data.length; j++) {
                dataSet[j] = Array.apply(null, Array(fieldNames.length)).map(function () {return ""});
            }

            for (let i = 0; i < dataSet.length; i++) {
                for (let j = 0; j < dataSet[i].length; j++) {
                    if (fieldNames[j]['title'] in data[i]) {
                        dataSet[i][j]=data[i][fieldNames[j]['title']];
                    }
                }
            }
            // console.log("test");
            // console.log(data);
            // console.log(dataSet);
            // console.log(fieldNames);

            let query = '';

            chrome.storage.local.set({"fieldNames": fieldNames});
            // array [{'title': 'price', 'sTitle': 'price'},{'title': 'image', 'sTitle': 'image'}]
            chrome.storage.local.set({"dataSet": dataSet});
            // 2d array, e.g., [['$120','http://abc.com/1.png'], ['$150','http://abc.com/1.png']]
            chrome.storage.local.set({"query": query});
            // query name. If there is no query name, then write 'none'

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                console.log("creating popup...");
                chrome.windows.create({
                    type: 'popup',
                    url: chrome.extension.getURL('app/contentScript/gridView/gridview.html')
                }, function (newWindow) {
                    console.log(newWindow);
                });
            });
        }
        // else if (msg.answer == "leave"){
        //     console.log("leave reached!!!");
        //     console.log(msg.capa);
        //     socket.emit('leave', {domain_name: msg.domain_name, capa: msg.capa});
        // }
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

