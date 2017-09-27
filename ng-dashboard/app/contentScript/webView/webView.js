// get DOM tree flattened
if (typeof domJSON !== 'undefined') {

    // console.time('encryption');
    // console.log("domjsonlist");
    // globalBlocks = domJSON.toJSONList(document.documentElement);
    // console.timeEnd('encryption');
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