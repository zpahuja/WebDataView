/*
var body = document.getElementsByTagName("body")[0];

var ft = document.createElement("div");
ft.style.position = "fixed";
ft.style.width = "50%";
ft.style.height = "7%";
ft.style.top = "80px";
ft.style.left = "25%";
ft.style.backgroundColor = "white";
ft.style.zIndex = "10000";
ft.style.boxShadow = "0px 0px 8px #bcbcbc";
ft.id = "web-data-view-footer";
// append footer
body.appendChild(ft);

// grid view
var gridView = document.createElement("div");
gridView.style.width = "100%";
gridView.style.height = "100%";
gridView.style.display = "none";
gridView.style.zIndex = "9990";
gridView.style.background = "white";
gridView.style.position = "fixed";
gridView.style.top = "0";
gridView.style.left = "0";
gridView.id = "gridViewDiv";
body.appendChild(gridView);

// load font-awesome
function addCss(fileName) {
    var link = '<link rel="stylesheet" type="text/css" href="' + fileName + '">'
    $('head').append(link)
}
addCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css');
var gridCssUrl = chrome.extension.getURL("app/contentScript/gridView/gridView.css");
addCss('gridCssUrl');

// load footer html
var fturl = chrome.extension.getURL("footer/footer.html");
$("#web-data-view-footer").load(fturl);

// load spreadsheet/grid  html
//var gvurl = chrome.extension.getURL("app/contentScript/gridView/grid.html");
//$("#gridViewDiv").load(gvurl);

// grid js

$.getScript("https://docs.handsontable.com/0.30.1/bower_components/handsontable/dist/handsontable.full.js", function(){
});

var data = function () {
    return Handsontable.helper.createSpreadsheetData(100, 10);
};

var container = document.getElementById('gridViewDiv');

var DATASET = [];

for (var i = 0; i < clusters.length; i++) {
    tempdata = [];
    for (var j = 0; j < clusters[i].length; j++) {
        tempdata.push(globalBlocks[clusters[i][j]]['-att-innerText']);
    }
    DATASET.push(tempdata);
}

fieldNames = [];
numOfInstances = 0;
for (var i = 0; i < clusters.length; i++) {
    fieldNames.push({title: "Field " + i});
    if (numOfInstances < clusters[i].length) {
        numOfInstances = clusters[i].length;
    }
}

dataSet = [];
for (var j = 0; j < numOfInstances; j++) {
    dataSet[j] = Array.apply(null, Array(clusters.length)).map(function () {return ""});
}

for (var i = 0; i < clusters.length; i++) {
    for (var j = 0; j < clusters[i].length; j++) {
        dataSet[j][i]=globalBlocks[clusters[i][j]]['-att-innerText'];
    }
}

chrome.storage.local.set({"dataSet": dataSet});
chrome.storage.local.set({"fieldNames": fieldNames});

//var myWindow = window.open("", "MsgWindow", "width=200,height=100");
//myWindow.document.write("<script> document.write(chrome.storage.local.get('lastname')) <\/script>");
// myWindow.document.write("<script> document.write('adsfdsaf fdsfa') <\/script>");

$('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.12/datatables.css"/>');
gridView.innerHTML = '<table id="data-table" class="display" width="100%"></table>'

$(document).ready(function() {
    $('#data-table').DataTable( {
        data: dataSet,
        columns: fieldNames,
        scrollX: "100%",
        scrollY: "800px"
    } );
} );
   */