console.log("VIPS Do Classification");
var vips = new VipsAPI();
var visualData = vips.getVisualData();
globalBlocks = vips.getVisualBlockList();
pos = [];
neg = [];

for (var i = 0; i < globalBlocks.length; i++) {
    var box = globalBlocks[i]['-att-box'];
    box.style.border = "2px solid green";
    box.title = globalBlocks[i]['-vips-id'];
    box.addEventListener('click', function (e) {
        e.preventDefault();
        var vips_id = this.title;
        if (pos.length > 0) console.log( vips_id.substr(0,pos[pos.length-1].lastIndexOf('-')));
        if (pos.length === 0 || !pos[pos.length-1].startsWith(vips_id)) {
            pos.push(vips_id);
            this.style.border = "4px solid blue";
            // dangerous if the access to the array is asynchronous, working in my tests
        }
        console.log(pos);
    });
    box.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        var vips_id = this.title;
        if (neg.length === 0 || !neg[neg.length-1].startsWith(vips_id)) {
            neg.push(vips_id);
            this.style.border = "4px solid red";
            // dangerous if the access to the array is asynchronous, working in my tests
        }
    });
}

console.log("The web page is sending VIPS blocks info to Native Client");
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
    });
chrome.runtime.sendMessage(visualData, function(response) {
    console.log(response);
});

$(document.body).append('<input type="button" id="export-labeled-data" value="Export Labeled Data" />');

$('#export-labeled-data').on('click', function () {
    console.log("Exporting labeled data...");
    var out = {};
    out['positive_labeled'] = pos;
    out['negative_labeled'] = neg;
    out['blocks'] = [];
    var atts = ['-vips-id', '-vips-degree-of-coherence', '-vips-startX', '-vips-endX', '-vips-startY', '-vips-endY', '-att-draggable', '-att-nodeName', '-att-baseURI', '-att-align', '-att-title', '-att-lang', '-att-translate', '-att-dir', '-att-hidden', '-style-animation-delay', '-style-animation-direction', '-style-animation-duration', '-style-animation-fill-mode', '-style-animation-iteration-count', '-style-animation-name', '-style-animation-play-state', '-style-animation-timing-function', '-style-background-attachment', '-style-background-blend-mode', '-style-background-clip', '-style-background-color', '-style-background-image', '-style-background-origin', '-style-background-position', '-style-background-repeat', '-style-background-size', '-style-border-bottom-color', '-style-border-bottom-left-radius', '-style-border-bottom-right-radius', '-style-border-bottom-style', '-style-border-bottom-width', '-style-border-collapse', '-style-border-image-outset', '-style-border-image-repeat', '-style-border-image-slice', '-style-border-image-source', '-style-border-image-width', '-style-border-left-color', '-style-border-left-style', '-style-border-left-width', '-style-border-right-color', '-style-border-right-style', '-style-border-right-width', '-style-border-top-color', '-style-border-top-left-radius', '-style-border-top-right-radius', '-style-border-top-style', '-style-border-top-width', '-style-bottom', '-style-box-shadow', '-style-box-sizing', '-style-break-after', '-style-break-before', '-style-break-inside', '-style-caption-side', '-style-clear', '-style-clip', '-style-color', '-style-content', '-style-cursor', '-style-direction', '-style-display', '-style-empty-cells', '-style-float', '-style-font-family', '-style-font-kerning', '-style-font-size', '-style-font-stretch', '-style-font-style', '-style-font-variant', '-style-font-variant-ligatures', '-style-font-weight', '-style-height', '-style-image-rendering', '-style-isolation', '-style-left', '-style-letter-spacing', '-style-line-height', '-style-list-style-image', '-style-list-style-position', '-style-list-style-type', '-style-margin-bottom', '-style-margin-left', '-style-margin-right', '-style-margin-top', '-style-max-height', '-style-max-width', '-style-min-height', '-style-min-width', '-style-mix-blend-mode', '-style-motion-offset', '-style-motion-path', '-style-motion-rotation', '-style-object-fit', '-style-object-position', '-style-opacity', '-style-orphans', '-style-outline-color', '-style-outline-offset', '-style-outline-style', '-style-outline-width', '-style-overflow-wrap', '-style-overflow-x', '-style-overflow-y', '-style-padding-bottom', '-style-padding-left', '-style-padding-right', '-style-padding-top', '-style-pointer-events', '-style-position', '-style-resize', '-style-right', '-style-speak', '-style-table-layout', '-style-tab-size', '-style-text-align', '-style-text-align-last', '-style-text-decoration', '-style-text-indent', '-style-text-rendering', '-style-text-shadow', '-style-text-overflow', '-style-text-transform', '-style-top', '-style-touch-action', '-style-transition-delay', '-style-transition-duration', '-style-transition-property', '-style-transition-timing-function', '-style-unicode-bidi', '-style-vertical-align', '-style-visibility', '-style-white-space', '-style-widows', '-style-width', '-style-will-change', '-style-word-break', '-style-word-spacing', '-style-word-wrap', '-style-z-index', '-style-zoom', '-style--webkit-appearance', '-style-backface-visibility', '-style--webkit-background-clip', '-style--webkit-background-origin', '-style--webkit-border-horizontal-spacing', '-style--webkit-border-image', '-style--webkit-border-vertical-spacing', '-style--webkit-box-align', '-style--webkit-box-decoration-break', '-style--webkit-box-direction', '-style--webkit-box-flex', '-style--webkit-box-flex-group', '-style--webkit-box-lines', '-style--webkit-box-ordinal-group', '-style--webkit-box-orient', '-style--webkit-box-pack', '-style--webkit-box-reflect', '-style--webkit-clip-path', '-style-column-count', '-style-column-gap', '-style-column-rule-color', '-style-column-rule-style', '-style-column-rule-width', '-style-column-span', '-style-column-width', '-style--webkit-filter', '-style-align-content', '-style-align-items', '-style-align-self', '-style-flex-basis', '-style-flex-grow', '-style-flex-shrink', '-style-flex-direction', '-style-flex-wrap', '-style-justify-content', '-style-order', '-style-perspective', '-style-perspective-origin', '-style-shape-outside', '-style-shape-image-threshold', '-style-shape-margin', '-style-transform', '-style-transform-origin', '-style-transform-style', '-style-buffered-rendering', '-style-clip-path', '-style-clip-rule', '-style-mask', '-style-filter', '-style-flood-color', '-style-flood-opacity', '-style-lighting-color', '-style-stop-color', '-style-stop-opacity', '-style-color-interpolation', '-style-color-interpolation-filters', '-style-color-rendering', '-style-fill', '-style-fill-opacity', '-style-fill-rule', '-style-marker-end', '-style-marker-mid', '-style-marker-start', '-style-mask-type', '-style-shape-rendering', '-style-stroke', '-style-stroke-dasharray', '-style-stroke-dashoffset', '-style-stroke-linecap', '-style-stroke-linejoin', '-style-stroke-miterlimit', '-style-stroke-opacity', '-style-stroke-width', '-style-alignment-baseline', '-style-baseline-shift', '-style-dominant-baseline', '-style-text-anchor', '-style-writing-mode', '-style-vector-effect', '-style-paint-order'];
    for (var i = 0; i < visualData['blocks'].length; i++) {
        var b = visualData['blocks'][i];
        var tmp = {};
        out['blocks'].push(tmp);
        for (var j = 0; j < atts.length; j++) {
            tmp[atts[j]] = b[atts[j]];
        }
    }
    // export to JSON and download
    var strout = JSON.stringify(out);

    filename = 'vips_' + window.location.host + '.json';
    var blob = new Blob([strout], {type: "text/json;charset=utf-8"});
    saveAs(blob, filename);
});