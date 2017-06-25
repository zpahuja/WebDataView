console.log("VIPS KMEANS");
var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();

var feature_set = ["-att-title","-style-font-size", "-att-tagName","-att-className","-style-font-family",  "-style-width","-style-height","-att-childElementCount","-style-line-height"]
var CSS_COLOR_NAMES = ["Blue","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
var dataset = []
var id2cluster = new Array(globalBlocks.length);

for (var i = 0; i < globalBlocks.length; i++) {
    var arr = [];
    var box = globalBlocks[i]['-att-box'];
    box.title = i.toString();

    for (var j = 0; j < feature_set.length; j++) {
        if( feature_set[j] =="-att-title"||feature_set[j]=="-att-tagName"){
            arr.push(hashCode(globalBlocks[i][feature_set[j]]) *100);
        }else if (feature_set[j] == "-style-font-family"||feature_set[j] == "-att-className") {
            arr.push(hashCode(globalBlocks[i][feature_set[j]])*300);
        }else if (feature_set[j] =="-style-width" || feature_set[j] == "-style-height") {
            arr.push(parseInt(globalBlocks[i][feature_set[j]])/10);
        }else{
            arr.push(parseInt(globalBlocks[i][feature_set[j]])*800);
        }
    }
    dataset.push(arr)
}

var kmeans = new KMEANS();
var numClusters = 30;
var clusters = kmeans.run(dataset, numClusters);

csv_list = [];
for(var k = 0; k<clusters.length; k++){
    clusters_list = []
    img_list = []
    for(var i  = 0; i < globalBlocks.length; i++){
        for(var j = 0; j< clusters[k].length; j++){
            if (i == clusters[k][j]){
                tmp = globalBlocks[i]["-att-innerText"].replace(/\n/g,' ');
                tmp = tmp.replace(/,/g, ' ');
                clusters_list.push(tmp);
                if (typeof globalBlocks[i]["-att-src"]!='undefined'){
                    img_list.push(globalBlocks[i]["-att-src"]);
                }
                var box = globalBlocks[i]['-att-box'];
                // box.style.backgroundColor = getBgColor(CSS_COLOR_NAMES[k]);
                //box.style.backgroundImage = "url(https://upload.wikimedia.org/wikipedia/en/4/48/Blank.JPG)";
                //box.style.backgroundRepeat = "repeat";
                //box.style.boxShadow = "inset 0 0 0 1000px " + getBgColor(CSS_COLOR_NAMES[k]);
                box.style.border = "2px solid rgba(0,0,0,0)";
                box.style.borderLeft = "2.5px solid " + CSS_COLOR_NAMES[k];
                box.style.paddingLeft = "5px";
                id2cluster[i] = k;
            }
        }
    }
    csv_list.push(clusters_list);
    if (img_list.length>0) {
        csv_list.push(img_list);
    }
}

var data = csv_list;
csvContent="";
data.forEach(function(infoArray, index){

    dataString = infoArray.join(",");
    csvContent += index < data.length ? dataString+ "\n" : dataString;

});

/*
filename = window.location.host + '-WebDataView.csv';
var blob = new Blob([csvContent], {type: "text/csv;charset=utf-8"});
saveAs(blob, filename);
*/

// helper functions
function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = ~~(((hash << 5) - hash) + str.charCodeAt(i));
    }
    return hash;
}

function colorToRGBA(color) {
    // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
    // color must be a valid canvas fillStyle. This will cover most anything
    // you'd want to use.
    // Examples:
    // colorToRGBA('red')  # [255, 0, 0, 255]
    // colorToRGBA('#f00') # [255, 0, 0, 255]
    var cvs, ctx;
    cvs = document.createElement('canvas');
    cvs.style.visibility = "hidden";
    cvs.height = 1;
    cvs.width = 1;
    ctx = cvs.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
}

function byteToHex(num) {
    // Turns a number (0-255) into a 2-character hex number (00-ff)
    return ('0'+num.toString(16)).slice(-2);
}

function colorToHex(color) {
    // Convert any CSS color to a hex representation
    // Examples:
    // colorToHex('red')            # '#ff0000'
    // colorToHex('rgb(255, 0, 0)') # '#ff0000'
    var rgba, hex;
    rgba = colorToRGBA(color);
    hex = [0,1,2].map(
        function(idx) { return byteToHex(rgba[idx]); }
    ).join('');
    return "#"+hex;
}

function hex2rgba_convert(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

function getBgColor(color) {
    return hex2rgba_convert(colorToHex(color), 10);
}