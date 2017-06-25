/**
 * Created by longpham on 7/13/16.
 */
CppModule = null;  // Global application object.
statusText = 'NO-STATUS';


//var imported = document.createElement('script');
//imported.src = '../contentScript' ;
//document.head.appendChild(imported);
//vips = new VipsAPI(); //our API
//globalBlocks = vips.getVisualBlockList(); 


// Indicate load success.
function moduleDidLoad() {
    CppModule = document.getElementById('cpp_lib');
    //console.log(globalBlocks);
    updateStatus('SUCCESS');
    // Send a message to the Native Client module
    CppModule.postMessage('hello');
}

// The 'message' event handler.  This handler is fired when the NaCl module
// posts a message to the browser by calling PPB_Messaging.PostMessage()
// (in C) or pp::Instance.PostMessage() (in C++).  This implementation
// simply displays the content of the message in an alert panel.
function handleMessage(message_event) {
    // alert(message_event.data);
    // simply forward any data received from Native Client to the content script
    //console.log('Chrome extension received a message from Native Client and forwarded it to the Web Page immediately!');
    //console.log(message_event);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message_event.data, function(response) {
             console.log(message_event.data);
             //console.log(response);
        });
    });
    // chrome.runtime.sendMessage(message_event.data, function(response) {
    //     //console.log(response);
    // });
}

// If the page loads before the Native Client module loads, then set the
// status message indicating that the module is still loading.  Otherwise,
// do not change the status message.
function pageDidLoad() {
    if (CppModule == null) {
        updateStatus('Loading CPP Module...');
    } else {
        // It's possible that the Native Client module onload event fired
        // before the page's onload event.  In this case, the status message
        // will reflect 'SUCCESS', but won't be displayed.  This call will
        // display the current message.
        updateStatus();
    }
}

// Set the global status message.  If the element with id 'statusField'
// exists, then set its HTML to the status message as well.
// opt_message The message test.  If this is null or undefined, then
// attempt to set the element with id 'statusField' to the value of
// |statusText|.
function updateStatus(opt_message) {
    if (opt_message)
        statusText = opt_message;
    var statusField = document.getElementById('statusField');
    if (statusField) {
        statusField.innerHTML = statusText;
    }
}


document.body.addEventListener("load", pageDidLoad(), false);
var listener = document.getElementById('cpp_lib_listener');
listener.addEventListener('load', moduleDidLoad, true);
listener.addEventListener('message', handleMessage, true);



var globalBlocks = []
pos = []
neg = []

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    globalBlocks = request;
    //console.log('globalBlocks received');
    /*
    for(var i=0;i<globalBlocks.length;i++)
    {
        globalBlocks[i]['-input'] = 0;
        if(globalBlocks[i]['-vips-id']=='1-6-1-1')
        {
            globalBlocks[i]['-input'] = 1;
        }
        if(globalBlocks[i]['-vips-id']=='1-7-1-1')
        {
            globalBlocks[i]['-input'] = 1;
        }
    }*/
    //console.log(globalBlocks);
    CppModule.postMessage(globalBlocks);
    //console.log('globalBlocks sent to CppModule');
  });

// Create an array like pos,neg
// For pos - 2 vips-id
//  



// chrome.tabs.executeScript(null, {file: "hello_tutorial3.js"});

/*chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
        "Chrome extension received data from the web page " + sender.tab.url + "and forwarded it immediately to Native Client":
            "Chrome extension received data from the web page from somewhere");
        // sendResponse({farewell: "goodbye"});
        console.log(request);
        CppModule.postMessage(JSON.stringify(request));
    });*/
