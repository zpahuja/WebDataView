/*
 // html for popover buttons
 var popover_html = '<i class="fa fa-tag fa-fw-lg" id="web-view-assign-label"></i>' +
 '<i class="fa fa-object-group fa-fw-lg" id="web-view-select-similar"></i>' +
 '<i class="fa fa-link fa-fw-lg" id="web-view-merge"></i>' +
 '<i class="fa fa-trash-o fa-fw-lg" id="web-view-remove"></i>';
 // set popover attributes
 for (var i = 0; i < globalBlocks.length; i++) {
 var box = globalBlocks[i]['-att-box'];
 if (box.nodeType == 1) { // check node is DOM element, not text
 box.setAttribute("data-toggle", "popover");
 box.setAttribute("data-content", popover_html);
 box.setAttribute("data-html", true);
 box.setAttribute("data-placement", "top");
 box.setAttribute("data-trigger", "focus");
 box.setAttribute("data-animation", true);
 box.setAttribute("block-index", i);
 }
 }
 */

var COLORS = ["(2,63,165)","(125,135,185)","(190,193,212)","(214,188,192)","(187,119,132)","(142,6,59)","(74,111,227)","(133,149,225)","(181,187,227)","(230,175,185)","(224,123,145)","(211,63,106)","(17,198,56)","(141,213,147)","(198,222,199)","(234,211,198)","(240,185,141)","(239,151,8)","(15,207,192)","(156,222,214)","(213,234,231)","(243,225,235)","(246,196,225)","(247,156,212)"];
shuffle(COLORS);
collected_data = [];
labels_list = [];

class TestTooltip {
    constructor(referenceElement, color) {

        self.instance = new Tooltip(referenceElement, {
            title: '<div id="webview-popper-container"></div>',
            trigger: "click",
            placement: "top-start",
            html: true
        });
        self.instance.show();
        let cf = new ContentFrame({
            'id':'webview-tooltip',
            'appendTo': '#webview-popper-container',
            'css': ['lib/font-awesome/css/font-awesome.css'],
            'js': ['app/contentScript/webView/tooltipHandler.js'],
            'inlineCss': {"width": "175px", "height": "40px", "z-index": 2147483647, "border": "none", "border-radius": 6}
        });
        var tooltip_html = $.parseHTML('<div class="webdataview" style="background-color: ' + color + '; width: 100%; height: 100%"><i class="fa fa-tag fa-fw-lg" id="web-view-assign-label" style="margin-left: 15px"></i> <i class="fa fa-object-group fa-fw-lg" id="web-view-select-similar"></i><i class="fa fa-link fa-fw-lg" id="web-view-merge"></i><i class="fa fa-trash-o fa-fw-lg" id="web-view-remove"></i></div>');
        cf.body.append(tooltip_html);
        // select similar
        ContentFrame.findElementInContentFrame('#web-view-select-similar', '#webview-tooltip').click(function() {
            var similar_nodes = $('.' + referenceElement.className).get();
            for (var i = 0; i < similar_nodes.length; i++) {
                selected_nodes.push(similar_nodes[i]);
                let tooltip_color = "rgb" + COLORS[class_to_color_idx[referenceElement.className]];
                similar_nodes[i].style.outline = '2px solid ' + tooltip_color;
                let field_label = ntc.name(rgb2hex(tooltip_color))[1];
                let data_to_push = {};
                data_to_push[field_label] = similar_nodes[i];
                collected_data.push(data_to_push);
            }
        });
        // delete selected nodes
        ContentFrame.findElementInContentFrame('#web-view-remove', '#webview-tooltip').click(function() {
            for (let i = 0; i < selected_nodes.length; i++) {
                selected_nodes[i].style.outline = "none";
                for (let j=0; j < collected_data.length; j++) {
                    let keys = Object.keys(collected_data[j]);
                    keys.forEach(function(key) {
                        if (collected_data[j][key] == selected_nodes[i]) {
                            delete collected_data[j][key];
                        }
                    });
                }
            }
            selected_nodes = [];
            self.instance.hide();
        });
        // assign
        ContentFrame.findElementInContentFrame('#web-view-assign-label', '#webview-tooltip').click(function() {
            cf.body.empty();
            let assign_color_html = "<table style=\"width:100%; height:100%; background-color: rgb(255,255,255)\">";
            for (let i=0; i<4; i++) {
                assign_color_html += "<tr>"
                for (let j=0; j<6; j++) {
                    assign_color_html += "<td class=\"web-view-assign-color\" style=\"cursor:pointer;background-color: rgb(255,255,255)" + COLORS[i*6+j]+ "\"></td>"
                }
                assign_color_html += "</tr>"
            }
            assign_color_html += "</table>";
            cf.iframe.css({"height":"100px"});
            cf.body.append($.parseHTML(assign_color_html));
            self.instance.show();
            let assigned_color = undefined;
            ContentFrame.findElementInContentFrame('.web-view-assign-color', '#webview-tooltip').click(function(e) {
                let assigned_color = e.target.style.backgroundColor;
                let assigned_color_label_name = ntc.name(rgb2hex(assigned_color))[1];
                if (labels_list.indexOf(assigned_color_label_name) == -1) {
                    appendLabel2Widget(assigned_color_label_name, assigned_color_label_name);
                }
                var tooltip_html = $.parseHTML('<div class="webdataview" style="background-color: ' + assigned_color + '; width: 100%; height: 100%"><i class="fa fa-tag fa-fw-lg" id="web-view-assign-label" style="margin-left: 15px"></i> <i class="fa fa-object-group fa-fw-lg" id="web-view-select-similar"></i><i class="fa fa-link fa-fw-lg" id="web-view-merge"></i><i class="fa fa-trash-o fa-fw-lg" id="web-view-remove"></i></div>');
                cf.iframe.css({"height":"40px"});
                cf.body.empty();
                cf.body.append(tooltip_html);

                // change field_label of selected nodes or add them to collected_data
                for (let idx = 0; idx < selected_nodes.length; idx++) {
                    selected_nodes[idx].style.outline = "2px solid " + assigned_color;
                    for (let j=0; j < collected_data.length; j++) {
                        let found = false;
                        let keys = Object.keys(collected_data[j]);
                        keys.forEach(function(key) {
                            if (collected_data[j][key] == selected_nodes[idx]) {
                                collected_data[j][assigned_color_label_name] = collected_data[j][key];
                                delete collected_data[j][key];
                                found = true;
                            }
                        });
                        if (!found) {
                            let data_to_push = {};
                            data_to_push[assigned_color_label_name] = selected_nodes[idx];
                            collected_data.push(data_to_push);
                        }
                    }
                }
            });
            /*
             for (let i = 0; i < selected_nodes.length; i++) {
             selected_nodes[i].style.outline = "none";
             for (let j=0; j < collected_data.length; j++) {
             let keys = Object.keys(collected_data[j]);
             keys.forEach(function(key) {
             if (collected_data[j][key] == selected_nodes[i]) {
             delete collected_data[j][key];
             }
             });
             }
             }
             selected_nodes = [];
             self.instance.hide();
             */
        });
    }

    show() {
        self.instance.show();
    }

    hide() {
        self.instance.hide();
    }
}

// list of selected VIPS blocks
var selected_nodes = [];
var tooltip_node = undefined;
var alignSelectionWithClusterClassFlag = false;
var used_col_idx = 0;
var class_to_color_idx = {};

var TOOLTIP_IDS_ARRAY = ["web-view-assign-label", "web-view-select-similar", "web-view-merge", "web-view-remove"];

document.addEventListener("click", selectionHandler);

function selectionHandler() {
    event.preventDefault();

    if (TOOLTIP_IDS_ARRAY.indexOf(event.target.id ) != -1) {
        console.log(event.target.id);
        tooltipHandler(event.target.id);
        return;
    }
    /*
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
     */
    $('#webview-popper-container').remove();

    let tooltip_color = "rgb" + COLORS[used_col_idx];
    if (event.target.className in class_to_color_idx) {
        tooltip_color = "rgb" + COLORS[class_to_color_idx[event.target.className]];
    }
    else {
        class_to_color_idx[event.target.className] = used_col_idx;
        used_col_idx = used_col_idx + 1;
        appendLabel2Widget(ntc.name(rgb2hex(tooltip_color))[1], tooltip_color);
    }
    var tip = new TestTooltip(event.target, tooltip_color);

    if (!tooltip_node || event.target.className != tooltip_node.className) {
        for (var i = 0; i < selected_nodes.length; i++) {
            selected_nodes[i].style.outline = "none";
        }
        selected_nodes = [];
    }
    selected_nodes.push(event.target);
    tooltip_node = event.target;
    event.target.style.outline = '2px solid ' + tooltip_color;
    let field_label = ntc.name(rgb2hex(tooltip_color))[1];
    let event_target = event.target;
    let data_to_push = {};
    data_to_push[field_label] = event_target;
    collected_data.push(data_to_push);
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

// function to convert hex format to a rgb color
function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

appendLabel2Widget = function(labelName, labelColor) {
    labels_list.push(labelName);
    let labelId = labelColor.substring(4, labelColor.length - 1).replace(',','-').replace(',','-');
    ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').append('' +
        '<li class="widget-labels-li" id = '+ labelId +'> ' +
        '<svg class="widget-label-circle-svg" height="10" width="10"> ' +
        '<circle cx="5" cy="5" r="4" stroke= '+ labelColor +' stroke-width="1.5" fill="white" />' +
        ' </svg>'+ labelName +'</li>');
    ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').find('li#'+labelId).click(function(e) {
        let circle = $(e.target).find('svg').find('circle');
        let circle_fill_color = circle.css("fill") == "rgb(255, 255, 255)" ? labelColor : "rgb(255, 255, 255)";
        circle.css({"fill": circle_fill_color});
        // toggle fields
        for (let i = 0; i < collected_data.length; i++) {
            let field_label = ntc.name(rgb2hex(labelColor))[1];
            if (field_label in collected_data[i]) {
                if (circle_fill_color == "rgb(255, 255, 255)") {
                    collected_data[i][field_label].style.outline = "none";
                } else {

                    collected_data[i][field_label].style.outline = '2px solid ' + circle_fill_color;
                }
            }
        }
    });
    ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').find('li#'+labelId).click(function(e) {

        // $(e.target).hide();
        let current = e;

        function changeFunction(e){
            console.log("not working");
        }
        console.log(ContentFrame.findElementInContentFrame('#delete_label_id', '#webdataview-floating-widget').length);
        let widget_delete_label = new ContentFrame({
            'id':'delete_label_id',
            'class':'delete_label_class',
            'appendTo': '#webdataview-floating-widget',
            'css': ['lib/font-awesome/css/font-awesome.css'],
            'js': ['app/contentScript/webView/label_delete.js'],
            'inlineCss': {"width": "200px", "height": "165px", "border": "none", "border-radius": 6,
                "margin-top": "60px", "background-color": "black"}
        });

        let tooltip_html = $.parseHTML('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
            '<div>' +
            '<input type="text" name="searchTxt" id="searchTxt" maxlength="10" value="Input new labels"/>' +
            '<label for="text"> Change label name here:</label> ' +
            '<div>'+
            '<button style="display: inline-block" type="button" class="btn btn-warning" id="label_delete">Delete</button> <br>'+
            '<button style="display: inline-block" type="button" class="btn btn-info" id="label_change">Change</button>' +
            '<button style="display: inline-block" type="button" class="btn btn-danger" id="label_close">Close</i></button>' +
            '</div>'+
            '</div>');

         widget_delete_label.body.append(tooltip_html);


        // ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').append('' +
        //     '<li class="widget-labels-li" id = '+ labelId +'> ' +
        //     '<svg class="widget-label-circle-svg" height="10" width="10"> ' +
        //     '<circle cx="5" cy="5" r="4" stroke= '+ labelColor +' stroke-width="1.5" fill="white" />' +
        //     ' </svg>'+ 'not working' +'</li>');
        ContentFrame.findElementInContentFrame('#label_delete', '#delete_label_id').click(function(e) {
            // console.log("here here");
            $(current.target).hide();
            ContentFrame.findElementInContentFrame('#' + e.target.id, '#delete_label_id').hide();
            // $('#' + e.target.id).hide()
        });
        let close_action = ContentFrame.findElementInContentFrame('#label_close', '#delete_label_id');

        close_action.click(function(e) {
            console.log(close_action.get(0));
            $('#delete_label_id').remove();
        });

        let change_action = ContentFrame.findElementInContentFrame('#label_change', '#delete_label_id');
        change_action.click(function(e) {
            let input_label = ContentFrame.findElementInContentFrame('#searchTxt', '#delete_label_id');
            console.log(input_label.get(0).value);
            let old = current.target.innerHTML;
            let first = old.substring(0, old.lastIndexOf(">")+1);
            current.target.innerHTML = first + input_label.get(0).value;
        });
    });


};

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}