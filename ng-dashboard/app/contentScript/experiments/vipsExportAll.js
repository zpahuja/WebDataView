console.log("VIPS Export All");
var vips = new VipsAPI();
var visualData = vips.getVisualData();

// export to JSON and download
var strout = JSON.stringify(visualData);
//filename = 'wdv_' + encodeURI(document.title) + '.json';
//console.log(strout);
//var a         = document.createElement('a');
//a.href        = 'data:' +  strout;
//a.target      = '_blank';
//a.download    = filename;
//document.body.appendChild(a);
//a.click();
filename = 'vips_' + window.location.host + '.json';
var blob = new Blob([strout], {type: "text/json;charset=utf-8"});
saveAs(blob, filename);