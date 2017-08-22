var overlay = document.createElement('div');
overlay.id = 'webdataview-iframe-overlay';
document.body.appendChild(overlay);

var box = Boundary.createBox('webview-iframe', 'webdataview-iframe');
Boundary.loadBoxJS('#webview-iframe', chrome.extension.getURL('lib/boundary/boundary.js'));

$(document).ready(function(){
    box.load(chrome.extension.getURL("app/contentScript/webView/widget.html"), function() {

        /*
        var mouseX, mouseY, startX, startY, iframe_initial_offset;
        var shouldDragWidget = false;

        $(document).mousemove(function(e) {
            mouseX = e.pageX;
            mouseY = e.pageY;
            if (shouldDragWidget) {
                dragWidget();
            }
            console.log(mouseX, mouseY);
        });

        Boundary.findElemInBox('#webview-handle', '#webview-iframe').mousedown(function () {
            $('#webdataview-iframe-overlay').css({'z-index': 2147483647});
            shouldDragWidget = true;
        }).mouseup(function() {
            $('#webdataview-iframe-overlay').css({'z-index': 2147483645});
            startX = undefined;
            //startY = undefined;
            shouldDragWidget = false;
        });

        function dragWidget() {
            if (!startX || !startY) {
                startX = mouseX;
                startY = mouseY;
                iframe_initial_offset = $('#webview-iframe').offset();
            }
            else {
                $('#webview-iframe, #webdataview-iframe-overlay').offset({top: iframe_initial_offset.top + mouseY - startY, left: iframe_initial_offset.left + mouseX - startX});
            }
        }

        */

        var mouseX, mouseY, startX, startY, iframe_initial_offset;
        var shouldDragWidget = false;

        $(document).mousemove(function(e) {
            mouseX = e.pageX;
            mouseY = e.pageY;
            console.log(mouseX, mouseY);
        });

        /*
         Boundary.findElemInBox('#webview-handle', '#webview-iframe').hover(function() {
         $(document).trigger('mousemove');
         }, function() {
         $(document).unbind('mousemove');
         });
         */

        Boundary.findElemInBox('#webview-handle', '#webview-iframe').mousedown(function () {
            $('#webdataview-iframe-overlay').css({'z-index': 2147483647}).mousedown();
            $(document).trigger('click');
            //shouldDragWidget = true;
        })
            /*
            .mouseup(function() {
         $('#webdataview-iframe-overlay').css({'z-index': 2147483645});
         //startX = undefined;
         //startY = undefined;
         //shouldDragWidget = false;
         });
*/
        function dragWidget() {
            if (!startX || !startY) {
                startX = mouseX;
                startY = mouseY;
                iframe_initial_offset = $('#webview-iframe').offset();
            }
            else {
                $('#webview-iframe, #webdataview-iframe-overlay').offset({top: iframe_initial_offset.top + mouseY - startY, left: iframe_initial_offset.left + mouseX - startX});
            }
        }












        /*
        var start_coords = {}; var overlay_offset = {};

        $('#webdataview-iframe-overlay').mousedown(function() {
            console.log('mousedown on overlay');
            start_coords = {};
            overlay_offset = $('#webdataview-iframe-overlay').offset();
        });

        $('#webdataview-iframe-overlay').mousemove (function (event) {
            if(!start_coords.x || !overlay_offset) {
                start_coords.x = event.pageX;
                start_coords.y = event.pageY;
                overlay_offset = $('#webdataview-iframe-overlay').offset();
            }
            console.log('mousemove overlay');
            $('#webview-iframe, #webdataview-iframe-overlay').offset({top: overlay_offset.top + event.pageY - start_coords.y, left: overlay_offset.left + event.pageX - start_coords.x});
        });


        $('#webdataview-iframe-overlay').mouseup(function() {
            $(this).unbind('mousemove');
            $('#webdataview-iframe-overlay').css({'z-index': 2147483645});
        });
        */

        /*
        var makeDraggable = function(element, iframe) {
            element = jQuery(element);

            // Move the element by the amount of change in the mouse position
            var move = function(event) {
                if(element.data('mouseMove')) {
                    var changeX = event.clientX - element.data('mouseX');
                    var changeY = event.clientY - element.data('mouseY');

                    var newX = parseInt(iframe.css('left')) + changeX;
                    var newY = parseInt(iframe.css('top')) + changeY;

                    iframe.css('left', newX);
                    iframe.css('top', newY);
                    console.log(newX, newY);

                    element.data('mouseX', event.clientX);
                    element.data('mouseY', event.clientY);
                }
            }

            element.mousedown(function(event) {
                element.data('mouseMove', true);
                element.data('mouseX', event.clientX);
                element.data('mouseY', event.clientY);
            });

            element.parents(':last').mouseup(function() {
                element.data('mouseMove', false);
            });

            element.mouseout(move);
            element.mousemove(move);
        }

        makeDraggable(Boundary.findElemInBox('#webview-handle', '#webview-iframe'), $('#webview-iframe'));
        */

        /*
        Boundary.findElemInBox('#webview-handle', '#webview-iframe').mousedown(function (e) {
            var start_coords = {};
            var container_offset = {top: parseFloat($('#webview-iframe').css('top')), left: parseFloat($('#webview-iframe').css('left'))};
            console.log(container_offset);
            $(this).mousemove(function (event) {
                if(!start_coords.x) {
                    start_coords.x = event.pageX;
                    start_coords.y = event.pageY;
                }
                console.log({'top': container_offset.top + event.pageY - start_coords.y, 'left': container_offset.left + event.pageX - start_coords.x});
                $('#webview-iframe').css({'top': container_offset.top + event.pageY - start_coords.y, 'left': container_offset.left + event.pageX - start_coords.x});
            });
        }).mouseup(function () {
            $(this).unbind('mousemove');
        }).mouseout(function () {
            $(this).unbind('mousemove');
        });
        */
    });
});