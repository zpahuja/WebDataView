// test
//$('head').append("<script> bringSelectedIframeToTop(true); <\/script>");

// add iframe
/*
 var iframe = document.createElement('iframe');
 document.body.appendChild(iframe);
 */

/*
 var iframe = document.createElement('iframe');
 var iframe_parent = document.createElement('div');
 iframe_parent.id = 'iframe-parent';
 document.body.appendChild(iframe_parent);

 document.getElementById("iframe-parent").appendChild(iframe);
 //console.log(iframe.contentDocument.getElementsByTagName("body"));
 //addHandle(iframe.contentDocument.getElementsByTagName("body"), window);

 function getFrameHtml(htmlFilePath) {
 var xmlhttp = new XMLHttpRequest();
 xmlhttp.open("GET", chrome.extension.getURL(htmlFilePath), false);
 xmlhttp.send();
 return xmlhttp.responseText;
 }
 */



// create iFrame box
var container = document.createElement('div');
container.id= 'webdataview-draggable-widget-container';
document.body.appendChild(container);

var box = Boundary.createBox('webdataview-floating-widget', undefined, '#webdataview-draggable-widget-container');

/*
 testBox.ready(function(){
 console.log('body ready');
 });
 */

// load iFrame CSS
Boundary.loadBoxCSS('#webdataview-floating-widget', chrome.extension.getURL('assets/css/boundary-box-elements.css'));
Boundary.loadBoxCSS('#webdataview-floating-widget', chrome.extension.getURL('lib/font-awesome/css/font-awesome.css'));
Boundary.loadBoxJS('#webdataview-floating-widget', chrome.extension.getURL('lib/dragiframe.js'));
Boundary.loadBoxJS('#webdataview-test', chrome.extension.getURL('lib/dragiframe.js'));
Boundary.loadBoxJS('#webdataview-test', chrome.extension.getURL('lib/jquery/jquery-3.1.1.min.js'));
Boundary.loadBoxJS('#webdataview-test', chrome.extension.getURL('lib/boundary/boundary.js'));

// inject widget html
jQuery(document).ready(function($) {
    box.load(chrome.extension.getURL("app/contentScript/webView/widget.html"), function() {
        // make widget draggable
        //$('#webdataview-draggable-widget-container').draggable({ scroll: "false", iframeFix: true });

        Boundary.findElemInBox('#draggable-fullsize-container', '#webdataview-floating-widget').mousedown(function (e) {
            var start_coords = {};
            var container_offset = $('#webdataview-draggable-widget-container').offset();
            $(this).mousemove(function (event) {
                if(!start_coords.x) {
                    start_coords.x = event.pageX;
                    start_coords.y = event.pageY;
                }
                console.log({top: container_offset.top + event.pageY - start_coords.y, left: container_offset.left + event.pageX - start_coords.x});
                $('#webdataview-draggable-widget-container').offset({top: container_offset.top + event.pageY - start_coords.y, left: container_offset.left + event.pageX - start_coords.x});
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
        var widget_container_selector = Boundary.findElemInBox('#draggable-fullsize-container', '#webdataview-floating-widget');
        var widget_container_children_selector= widget_container_selector.children();
        widget_container_selector.css({ "cursor": "move" });
        widget_container_children_selector.css({ "cursor": "default"});

        /*
         widget_container_selector.hover(
         function() {
         $('#webdataview-iframe-overlay').css( {'z-index': 2147483646} );
         }, function() {
         $('#webdataview-iframe-overlay').css( {'z-index': 2147483644} );
         }
         );

         widget_container_children_selector.hover(
         function() {
         $('#webdataview-iframe-overlay').css( {'z-index': 2147483644} );
         }
         );
         */

        /*
         widget_container_selector.mousedown(
         function() { $('#webdataview-iframe-overlay').css( {'z-index': 2147483646} ).trigger( "mousedown" );}
         );

         $('#webdataview-iframe-overlay').mouseup(
         function() { $('#webdataview-iframe-overlay').css( {'z-index': 2147483644} ); }
         );

         widget_container_children_selector.mousedown(
         function() {
         $('#webdataview-iframe-overlay').css( {'z-index': 2147483644} );
         }
         );
         */

    });
});