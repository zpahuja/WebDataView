document.body.addEventListener("load", pageDidLoad(), false);
var listener = document.getElementById('listener');
listener.addEventListener('load', moduleDidLoad, true);
listener.addEventListener('message', handleMessage, true);

chrome.tabs.executeScript(null, {file: "hello_tutorial3.js"});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });