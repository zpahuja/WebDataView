console.log("Tooltip");

var labels = new Array(globalBlocks.length);

// include bootstrap css
$('head').append('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');

// list of selected VIPS blocks
var selectedBlockIndices = [];
var tooltipBoxIdx = undefined;
var alignSelectionWithClusterClassFlag = false;

var TOOLTIP_IDS_ARRAY = ["wdv-tooltip-label", "wdv-tooltip-delete", "wdv-tooltip-group", "wdv-tooltip-unlink", "wdv-tooltip-link"];

var popoverhtml = '<i class="fa fa-tag fa-lg" style="margin-left:4px; margin-right: 8px; color:white" aria-hidden="true"  id="wdv-tooltip-label"></i>' +
    '<i class="fa fa-trash-o fa-lg" style="margin-right: 8px; color:white" aria-hidden="true" id="wdv-tooltip-delete"></i>' +
    '<i class="fa fa-object-group fa-lg" style="margin-right: 8px; color:white" aria-hidden="true" id="wdv-tooltip-group"></i>' +
    '<i class="fa fa-chain-broken fa-lg" style="margin-right: 8px; color:white" aria-hidden="true" id="wdv-tooltip-unlink"></i>' +
    '<i class="fa fa-link fa-lg" style="margin-right: 4px; color:white" aria-hidden="true" id="wdv-tooltip-link"></i>';

// set attributes and eventHandlers
for (var i = 0; i < globalBlocks.length; i++) {
    var box = globalBlocks[i]['-att-box'];
    //box.setAttribute("id", "vips" + i); // IMPORTANT attribute used for event handling in selectVipsBlock prepended with 'vips' for validation
    box.setAttribute("title", "");
    box.setAttribute("data-toggle", "popover");
    box.setAttribute("data-content", popoverhtml);
    box.setAttribute("data-html", true);
    box.setAttribute("data-placement", "top");
    box.setAttribute("data-trigger", "focus");
    box.setAttribute("data-animation", true);
    box.setAttribute("id", "vips" + i); // IMPORTANT attribute used for event handling in selectVipsBlock prepended with 'vips' for validation
    $(box).popover();
}

document.addEventListener("click", selectionHandler);

function selectionHandler() {
    event.preventDefault();

    if (TOOLTIP_IDS_ARRAY.indexOf(event.target.id ) != -1) {
        tooltipHandler(event.target.id);
        return;
    }

    var idx = getVipsIndexFromBoxId(event.target.id);
    // if click outside of view, then deselect all elements, hide tooltip, empty selectedBlockIndices and return
    if (!idx) {
        deselectVipsBlockArray(selectedBlockIndices);
        destroyTooltip();
        selectedBlockIndices = [];
        return;
    }
    var selectIndexColor = getClusterColorFromIndex(idx);

    if (alignSelectionWithClusterClassFlag) {
        alignWithSelectedBlockCluster(idx, selectIndexColor);
        return;
    }

    // toggle Selection for an index that is already selected
    if(selectedBlockIndices.indexOf(idx) != -1) {
        deselectVipsBlock(idx);
        // if no selected box, destroy tooltip
        if (isEmptyArray(selectedBlockIndices))
            destroyTooltip();
    }
    else {
        event.target.style.border = "2px solid " + selectIndexColor;
        selectedBlockIndices.push(idx);
        updateTooltip(idx, selectIndexColor);
    }
}

function updateTooltip(idx, color) {
    if(tooltipBoxIdx)
        destroyTooltip();
    tooltipBoxIdx = idx;
    var box = globalBlocks[idx]['-att-box'];
    $(box).popover("show");
    $('.popover').css('background-color', color);
    //$('.popover.top .arrow').css('border-top-color', color);
}

function destroyTooltip() {
    var box = globalBlocks[tooltipBoxIdx]['-att-box'];
    $(box).popover("hide");
    tooltipBoxIdx = undefined;
}

function isEmptyArray(arr) {
    if (arr && arr.length==0)
        return true;
    return false;
}

function deselectVipsBlock(idx) {
    var idxClusterColor = getClusterColorFromIndex(idx);
    var box = globalBlocks[idx]['-att-box'];

    // reset border
    box.style.border = "2px solid rgba(0,0,0,0)";
    box.style.borderLeft = "2.5px solid " + idxClusterColor;

    // remove from selectedBlockIndices
    selectedBlockIndices.splice(selectedBlockIndices.indexOf(idx), 1);

    // hide tooltip
    $(box).popover("hide");
}

function deselectVipsBlockArray(arrayIndices) {
    for (var i = 0; i < arrayIndices.length; i++) {
        deselectVipsBlock(arrayIndices[i]);
    }
}

/*
 * returns color corresponding to cluster of block 'idx' from CSS_COLOR_NAMES in wdvKMeans.js
 */
function getClusterColorFromIndex(idx) {
    return CSS_COLOR_NAMES[id2cluster[idx]];
}

/*
 * returns vips globalBlocks Index for box id if validation succeeds
 */
function getVipsIndexFromBoxId(strIdx) {
    // validate vips block
    var vipsBoxIdPattern =  /vips(\d+)$/i;
    var regMatch = strIdx.match(vipsBoxIdPattern);
    if(regMatch) {
        // parse index
        var idx = parseInt(regMatch[1]);
        return idx;
    }
    // false for error checking
    return false;
}
/*
// Footer
var body = document.getElementsByTagName("body")[0];
var ft = document.createElement("div");
ft.style.position = "fixed";
ft.style.width = "100%";
ft.style.height = "7%";
ft.style.bottom = "0px";
ft.style.backgroundColor = "white";
ft.style.zIndex = "10000";
ft.style.borderTop = "1px solid grey";

var ft2 = document.createElement("div");
ft2.style.position = "fixed";
ft2.style.bottom = "2px";
ft2.style.right = "3%";
ft2.style.backgroundColor = "white";

// Add buttons for new field and done
var exportFileBtn = document.createElement("button");
exportFileBtn.innerHTML = "Export as CSV";
exportFileBtn.style.color = "black";
exportFileBtn.style.position = "relative";
exportFileBtn.style.backgroundColor = "white";
exportFileBtn.style.textAlign = "center";
exportFileBtn.style.display = "inline-block";
exportFileBtn.style.fontSize = "12px";
exportFileBtn.style.padding = "7px";
exportFileBtn.style.border = "1px solid";
exportFileBtn.style.borderRadius = "25px";

// Add buttons for new field and done
var spreadsheetBtn = document.createElement("button");
spreadsheetBtn.innerHTML = "Spreadsheet View";
spreadsheetBtn.style.color = "black";
spreadsheetBtn.style.position = "relative";
spreadsheetBtn.style.backgroundColor = "white";
spreadsheetBtn.style.textAlign = "center";
spreadsheetBtn.style.display = "inline-block";
spreadsheetBtn.style.fontSize = "12px";
spreadsheetBtn.style.padding = "7px";
spreadsheetBtn.style.border = "1px solid";
spreadsheetBtn.style.borderRadius = "25px";
spreadsheetBtn.style.margin = "7px";

ft2.appendChild(spreadsheetBtn);
ft2.appendChild(exportFileBtn);
ft.appendChild(ft2);
body.appendChild(ft);

// export as csv
exportFileBtn.addEventListener ("click", function() {
    filename = window.location.host + '-WebDataView.csv';
    var blob = new Blob([csvContent], {type: "text/csv;charset=utf-8"});
    saveAs(blob, filename);
});
*/

function tooltipHandler(tooltipId) {
    switch (tooltipId) {
        case "wdv-tooltip-label":
            assignLabel();
            break;
        case "wdv-tooltip-delete":
            deleteSubtreeOfSelectedBlocks();
            break;
        case "wdv-tooltip-group":
            selectCluster();
            break;
        case "wdv-tooltip-unlink":
            removeFromClusterClass();
            break;
        case "wdv-tooltip-link":
            alignSelectionWithClusterClass();
            break;

    }
}







/*
 TODO
 * Deselect if clicked outside any of the boxes
 * Add to vipsExtended
 * Create vipsClusters wrapper for different clustering algorithms
 * Create a new project with clean source files
 */

function assignLabel() {
    for (var i = 0; i < selectedBlockIndices.length; i++) {
        var idx = selectedBlockIndices[i];
        labels[idx] = label;
        // change colors & cluster & id2cluster
    }
}

function deleteSubtreeOfSelectedBlocks() {
    destroyTooltip();
    for(var i = 0; i < selectedBlockIndices.length; i++) {
        var idx = selectedBlockIndices[i];
        var box = globalBlocks[idx]['-att-box'];
        box.style.visibility = "hidden";
    }
    selectedBlockIndices = [];
}

function removeFromClusterClass() {
    destroyTooltip();
    for(var i = 0; i < selectedBlockIndices.length; i++) {
        var idx = selectedBlockIndices[i];
        var box = globalBlocks[idx]['-att-box'];
        box.style.border = "none";
        var clusterid = id2cluster[idx];
        if (clusters[clusterid].indexOf(idx) > -1)
            clusters[clusterid].splice(idx, 1);
        id2cluster[idx] = undefined;
    }
    selectedBlockIndices = [];
}

function selectCluster() {
    var clusterid = id2cluster[tooltipBoxIdx];
    var clusterColor = getClusterColorFromIndex(tooltipBoxIdx);
    if(clusterid){
        for (var i = 0; i < clusters[clusterid].length; i++) {
            var idx = clusters[clusterid][i];
            if(selectedBlockIndices.indexOf(idx) < 0)
                selectedBlockIndices.push(idx);
            var box = globalBlocks[idx]['-att-box'];
            box.style.border = "2px solid " + clusterColor;
        }
    }
}

function alignSelectionWithClusterClass() {
    for(var i = 0; i < selectedBlockIndices.length; i++) {
        var idx = selectedBlockIndices[i];
        var box = globalBlocks[idx]['-att-box'];
        box.style.borderStyle = "dotted";
    }

    destroyTooltip();
    alignSelectionWithClusterClassFlag = true;
}

function alignWithSelectedBlockCluster(idx, clusterColor) {
    var clusterId = id2cluster[idx];

    for(var i = 0; i < selectedBlockIndices.length; i++) {
        var idx = selectedBlockIndices[i];
        var currentClusterId = id2cluster[idx];
        if (clusters[currentClusterId].indexOf(idx) > -1)
            clusters[currentClusterId].splice(idx, 1);
        clusters[clusterId].push(idx);
        id2cluster[idx] = clusterId;
    }
    deselectVipsBlockArray(selectedBlockIndices);
    alignSelectionWithClusterClassFlag = false;
}
