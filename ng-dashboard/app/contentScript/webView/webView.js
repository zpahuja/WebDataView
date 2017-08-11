// get DOM tree flattened
if (typeof domJSON !== 'undefined') {
    globalBlocks = domJSON.toJSONList(document.documentElement);
}

// listen for message to switch to vips
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.event == "switch to vips") {
            vips = new VipsAPI();
            globalBlocks = vips.getVisualBlockList();
            console.log("Switched from DOM to VIPS in response to extension's message");
            sendResponse("Switched from DOM tree to VIPS");
        }
    });