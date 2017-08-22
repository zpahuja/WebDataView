// add iframe
var iframe = document.createElement('iframe');
var iframe_parent = document.createElement('div');
iframe.src = chrome.extension.getURL('app/contentScript/webView/widget.html');
iframe.id = 'iframe';
iframe.className = 'boundary-default-iframe';
iframe_parent.id = 'iframe-parent';
document.body.appendChild(iframe_parent);
document.getElementById("iframe-parent").appendChild(iframe);

$(document).ready(function() {
    $('#iframe').ready(function() {
        alert('iframe loaded');
        console.log(document.getElementById('iframe').contentWindow.document);
        console.log(document.getElementById('iframe').contentWindow.document.getElementsByTagName('body').item(0));
    });
    /*
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
     */
});