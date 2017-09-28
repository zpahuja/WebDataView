var labels = new Array(globalBlocks.length);

// list of selected VIPS blocks
var selectedBlockIndices = [];
var tooltipBoxIdx = undefined;
var alignSelectionWithClusterClassFlag = false;

var TOOLTIP_IDS_ARRAY = ["wdv-tooltip-label", "wdv-tooltip-delete", "wdv-tooltip-group", "wdv-tooltip-unlink", "wdv-tooltip-link"];

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
