var body = document.getElementsByTagName("body")[0];
var ft = document.createElement("div");
ft.style.position = "fixed";
ft.style.width = "100%";
ft.style.height = "7%";
ft.style.bottom = "0px";
ft.style.backgroundColor = "white";
ft.style.zIndex = "10000";
ft.id = "web-data-view-footer";
ft.style.opacity = "0.75";
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

console.log(DATASET);

var hot = new Handsontable(container, {
    data: DATASET,
    minSpareCols: 1,
    minSpareRows: 1,
    rowHeaders: true,
    colHeaders: true,
    contextMenu: true,
    autoWrapRow: true
});