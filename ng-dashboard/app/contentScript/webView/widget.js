var body = document.getElementsByTagName("body")[0];
var widget = document.createElement("div");
widget.id = "web-view-widget";

// append widget
body.appendChild(widget);

// inject widget html
$("#web-view-widget").load(chrome.extension.getURL("app/contentScript/webView/widget.html"));

// make widget draggable using jQuery
$( "#web-view-widget" ).draggable({ scroll: "false" });