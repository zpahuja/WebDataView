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
let web_data_view_noti = document.createElement('div');
web_data_view_noti.id = 'webdataview-floating-noti';
document.body.appendChild(web_data_view_noti);

let cfn = new ContentFrame({
    'id':'webview-note',
    // 'appendTo': '#webdataview-floating-widget',
    'css': ['lib/font-awesome/css/font-awesome.css'],
    // 'inlineCss': {"width": "275px", "height": "175px", "position": "fixed", "left": "10px", "top":0, "z-index": 2147483647, "border-radius": 6, "background-color": "red"}
    'inlineCss': {"display": "none", "width": "275px", "height": "175px", "position": "fixed", "left": "10px", "top":0, "z-index": 2147483647, "border-radius": 6, "background-color": "red"}
}, function(){
    console.log("cf created successfully!");
});

let cfn_iframe = cfn.body;
let notification_flag = true;
// let note_html = $.parseHTML('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
//     '<div class="webdataview" id="iframe-fullsize-container">' +
//     ' <div class="widget" id="web-view-widget">' +
//     '<div class="widget-buttons widget-float-left" style="height: 30px;">' +
//     '<p><b>Hi Het,</b>  </p> <p><b>Would you like to get notification next time? </b></p>' +
//     ' <button type="button" class="btn btn-success" id="note_accept">Yes, Please</button>&nbsp;&nbsp;&nbsp; ' +
//     '<button type="button" class="btn btn-info" id="note_reject">Maybe Later</button>' +
//     '</div></div> </div>');
// cfn.body.append(note_html);

$(document).ready(function() {
    $('#webdataview-floating-noti').draggable({
        containment: 'window',
        scroll: false,
        stop: function() {
            $(this).css("left", parseFloat($(this).css("left")) / ($(window).width() / 100)+"%");
            $(this).css("top", parseFloat($(this).css("top")) / ($(window).height() / 100)+"%");
        }
    }).resizable({
        handles: 'e,w',
        minWidth: 250,
        stop: function() {
            $(this).css("left", parseFloat($(this).css("left")) / ($(window).width() / 100)+"%");
            $(this).css("width", parseFloat($(this).css("width")) / ($(window).width() / 100)+"%");
        }
    });

    cfn.loadJS('lib/jquery/jquery-3.1.1.min.js', function() {
        cfn.loadCSS('lib/font-awesome/css/font-awesome.css', function() {
            cfn.loadCSS('assets/css/content-frame-internal.css', function() {
                cfn.body.load(chrome.extension.getURL("app/contentScript/webView/notification.html"), function () {
                    cfn_iframe.ready(function() {
                        let answer_html;

                        ContentFrame.findElementInContentFrame('#note_close', '#webview-note').click(function(e) {
                            e.preventDefault();
                            $('#webview-note').css('visibility','hidden');
                        });
                        ContentFrame.findElementInContentFrame('#note_accept', '#webview-note').click(function(e) {
                            answer_html = $.parseHTML('<p id="question" style="color: #0bbd27"><b>Got it! We will notify you next time.</b></p>');
                            ContentFrame.findElementInContentFrame('#question', '#webview-note').replaceWith(answer_html);
                            setTimeout(function(){$('#webview-note').css('visibility','hidden');}, 2200);
                        });
// reject notification
                        ContentFrame.findElementInContentFrame('#note_reject', '#webview-note').click(function(e) {
                            e.preventDefault();
                                notification_flag = false;
                                answer_html = $.parseHTML('<p id="question" style="color: #f92672"><b>Got it! No further notification!</b></p>');
                                ContentFrame.findElementInContentFrame('#question', '#webview-note').replaceWith(answer_html);
                                    setTimeout(function(){$('#webview-note').css('visibility','hidden');}, 2200);
                            // let target = ContentFrame.findElementInContentFrame('#webview-note', '#webdataview-floating-noti');
                            // $('#webview-note').css('visibility','hidden');
                        });
                    });
                });
            });
        });
    });
});

