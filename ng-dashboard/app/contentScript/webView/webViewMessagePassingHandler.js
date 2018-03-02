// listen for message from chrome extension
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
    });