// create div containing iFrame
var body = document.getElementsByTagName("body")[0];
var container_div = document.createElement("div");
container_div.id = "webdataview-draggable-widget-container";
body.appendChild(container_div);

// create iFrame box
var box = Boundary.createBox('webdataview-floating-widget', undefined, '#webdataview-draggable-widget-container');

// load iFrame CSS
Boundary.loadBoxCSS('#webdataview-floating-widget', chrome.extension.getURL('assets/css/boundary-box-elements.css'));
Boundary.loadBoxCSS('#webdataview-floating-widget', chrome.extension.getURL('lib/font-awesome/css/font-awesome.css'));

// inject widget html
jQuery(document).ready(function($){
    box.load(chrome.extension.getURL("app/contentScript/webView/widget.html"), function() {
        // make widget draggable
        Boundary.findElemInBox('#draggable-fullsize-container', '#webdataview-floating-widget').mousedown(function (e) {
            var startX = e.pageX;
            var startY = e.pageY;
            $(this).mousemove(function (event) {
                var offset = $('#webdataview-draggable-widget-container').offset();
                $('#webdataview-draggable-widget-container').offset({top: offset.top + event.pageY - startY, left: offset.left + event.pageX - startX});
                $('#webdataview-floating-widget').offset($('#webdataview-draggable-widget-container').offset());
                startX = event.pageX;
                startY = event.pageY;
            });
        }).mouseup(function () {
            $(this).unbind('mousemove');
        }).mouseout(function () {
            $(this).unbind('mousemove');
        });

        // set img source for left and right chevron arrow buttons in widget
        Boundary.findElemInBox('#widget-left-arrow', '#webdataview-floating-widget').attr('src', chrome.extension.getURL("assets/icons/chevron-left.svg"));
        Boundary.findElemInBox('#widget-right-arrow', '#webdataview-floating-widget').attr('src', chrome.extension.getURL("assets/icons/chevron-right.svg"));

        // show/ hide scrollbar
        Boundary.findElemInBox('.widget-labels', '#webdataview-floating-widget').on("scrollstart", function() {
            Boundary.findElemInBox('html', '#webdataview-floating-widget').addClass('show-scrollbar');
        });
        Boundary.findElemInBox('.widget-labels', '#webdataview-floating-widget').on("scrollstop", function() {
            Boundary.findElemInBox('html', '#webdataview-floating-widget').removeClass('show-scrollbar');
        });

        // 'move' cursor icon for widget for dragging
        Boundary.findElemInBox('#draggable-fullsize-container', '#webdataview-floating-widget').css({ "cursor": "move" });
        Boundary.findElemInBox('#draggable-fullsize-container', '#webdataview-floating-widget').children().css({ "cursor": "default" });
    });
});