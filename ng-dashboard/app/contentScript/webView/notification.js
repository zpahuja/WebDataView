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

let note_iframe_cf = new ContentFrame({
    'id':'noti_id',
    'class': 'noti_class',
    'appendTo': '#webdataview-widget-container',
    'css': ['lib/font-awesome/css/font-awesome.css'],
    'inlineCss': {"width": "275px", "height": "240px", "z-index": 2147483647, "border-radius": 6, "background-color": "black"}
});

let note_iframe = note_iframe_cf.body;

class Notification {
    constructor(referenceElement, color) {
        // self.instance = new Tooltip(referenceElement, {
        //     title: '<div id="webview-popper-container1"></div>',
        //     trigger: "click",
        //     placement: "top-start",
        //     html: true
        // });
        // self.instance.show();
        let cf = new ContentFrame({
            'id':'webview-note',
            'class': 'webdataview-iframe',
            'appendTo': '#webview-popper-container1',
            'css': ['lib/font-awesome/css/font-awesome.css'],
            // 'inlineCss': {"width": "275px", "height": "240px", "z-index": 2147483647, "border-radius": 6, "background-color": "black"}
        });
        let note_html = $.parseHTML('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
            '<div class="webdataview" id="iframe-fullsize-container">' +
            ' <div class="widget" id="web-view-widget">' +
            '<div class="widget-buttons widget-float-left" style="height: 30px;">' +
            '<p><b>Hi Herbert,</b>  </p> <p><b>Would you like to get notification next time? </b></p>' +
            ' <button type="button" class="btn btn-success" id="note_accept">Yes, Please</button>&nbsp;&nbsp;&nbsp; ' +
            '<button type="button" class="btn btn-info" id="note_reject">Maybe Later</button>' +
            '</div> </div> </div>');
        cf.body.append(note_html);
        // accept notification
        ContentFrame.findElementInContentFrame('#note_accept', '#webview-note').click(function() {

        });
        // reject notification
        ContentFrame.findElementInContentFrame('#note_reject', '#webview-note').click(function() {

        });

    }
}


$(document).ready(function() {
    note_iframe_cf.loadJS('lib/jquery/jquery-3.1.1.min.js', function() {
        note_iframe_cf.loadCSS('lib/font-awesome/css/font-awesome.css', function() {
            note_iframe_cf.loadCSS('assets/css/content-frame-internal.css', function() {
                note_iframe.load(chrome.extension.getURL("app/contentScript/webView/notification.html"), function() {
                    note_iframe.ready(function() {
                        console.log("Wtf not working ");
                        let note_html = $.parseHTML('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
                            '<div class="webdataview" id="iframe-fullsize-container">' +
                            ' <div class="widget" id="web-view-widget">' +
                            '<div class="widget-buttons widget-float-left" style="height: 30px;">' +
                            '<p><b>Hi Herbert,</b>  </p> <p><b>Would you like to get notification next time? </b></p>' +
                            ' <button type="button" class="btn btn-success" id="note_accept">Yes, Please</button>&nbsp;&nbsp;&nbsp; ' +
                            '<button type="button" class="btn btn-info" id="note_reject">Maybe Later</button>' +
                            '</div> </div> </div>');
                        note_iframe_cf.body.append(note_html);
                    } );
                });
            });
        });
    });

});




// /*
//  // html for popover buttons
//  var popover_html = '<i class="fa fa-tag fa-fw-lg" id="web-view-assign-label"></i>' +
//  '<i class="fa fa-object-group fa-fw-lg" id="web-view-select-similar"></i>' +
//  '<i class="fa fa-link fa-fw-lg" id="web-view-merge"></i>' +
//  '<i class="fa fa-trash-o fa-fw-lg" id="web-view-remove"></i>';
//  // set popover attributes
//  for (var i = 0; i < globalBlocks.length; i++) {
//  var box = globalBlocks[i]['-att-box'];
//  if (box.nodeType == 1) { // check node is DOM element, not text
//  box.setAttribute("data-toggle", "popover");
//  box.setAttribute("data-content", popover_html);
//  box.setAttribute("data-html", true);
//  box.setAttribute("data-placement", "top");
//  box.setAttribute("data-trigger", "focus");
//  box.setAttribute("data-animation", true);
//  box.setAttribute("block-index", i);
//  }
//  }
//  */



// var COLORS = ["(2,63,165)","(125,135,185)","(190,193,212)","(214,188,192)","(187,119,132)","(142,6,59)","(74,111,227)","(133,149,225)","(181,187,227)","(230,175,185)","(224,123,145)","(211,63,106)","(17,198,56)","(141,213,147)","(198,222,199)","(234,211,198)","(240,185,141)","(239,151,8)","(15,207,192)","(156,222,214)","(213,234,231)","(243,225,235)","(246,196,225)","(247,156,212)"];
// shuffle(COLORS);
// collected_data = [];
// labels_list = [];
//
// class Notification {
//     constructor(referenceElement, color) {
//         self.instance = new Tooltip(referenceElement, {
//             title: '<div id="webview-popper-container1"></div>',
//             trigger: "click",
//             placement: "top-start",
//             html: true
//         });
//         self.instance.show();
//         let cf = new ContentFrame({
//             'id':'webview-note',
//             'appendTo': '#webview-popper-container1',
//             'css': ['lib/font-awesome/css/font-awesome.css'],
//             'inlineCss': {"width": "275px", "height": "240px", "z-index": 2147483647, "border-radius": 6, "background-color": "black"}
//         });
//         var note_html = $.parseHTML('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
//             '<div class="webdataview" id="iframe-fullsize-container">' +
//             ' <div class="widget" id="web-view-widget">' +
//             '<div class="widget-buttons widget-float-left" style="height: 30px;">' +
//             '<p><b>Hi Herbert,</b>  </p> <p><b>Would you like to get notification next time? </b></p>' +
//             ' <button type="button" class="btn btn-success" id="note_accept">Yes, Please</button>&nbsp;&nbsp;&nbsp; ' +
//             '<button type="button" class="btn btn-info" id="note_reject">Maybe Later</button>' +
//             '</div> </div> </div>');
//         cf.body.append(note_html);
//         // accept notification
//         ContentFrame.findElementInContentFrame('#note_accept', '#webview-note').click(function() {
//
//         });
//         // reject notification
//         ContentFrame.findElementInContentFrame('#note_reject', '#webview-note').click(function() {
//
//         });
//
//     }
//
//     show() {
//         self.instance.show();
//     }
//
//     hide() {
//         self.instance.hide();
//     }
// }
// let selected_nodes = [];
// let tooltip_node = undefined;
// let alignSelectionWithClusterClassFlag = false;
// let used_col_idx = 0;
// let class_to_color_idx = {};
// document.addEventListener("click", selectionHandler);
// function selectionHandler() {
//     event.preventDefault();
//
//     $('#webview-popper-container1').remove();
//
//     let tooltip_color = "rgb" + COLORS[used_col_idx];
//     if (event.target.className in class_to_color_idx) {
//         tooltip_color = "rgb" + COLORS[class_to_color_idx[event.target.className]];
//     }
//     else {
//         class_to_color_idx[event.target.className] = used_col_idx;
//         used_col_idx = used_col_idx + 1;
//         appendLabel2Widget(ntc.name(rgb2hex(tooltip_color))[1], tooltip_color);
//     }
//     var tip = new Notification(event.target, tooltip_color);
//
//     if (!tooltip_node || event.target.className != tooltip_node.className) {
//         for (var i = 0; i < selected_nodes.length; i++) {
//             selected_nodes[i].style.outline = "none";
//         }
//         selected_nodes = [];
//     }
//     selected_nodes.push(event.target);
//     tooltip_node = event.target;
//     event.target.style.outline = '2px solid ' + tooltip_color;
//     let field_label = ntc.name(rgb2hex(tooltip_color))[1];
//     let event_target = event.target;
//     let data_to_push = {};
//     data_to_push[field_label] = event_target;
//     collected_data.push(data_to_push);
// }

