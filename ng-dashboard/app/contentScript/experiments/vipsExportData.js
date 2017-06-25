console.log("VIPS Export Data");
var vips = new VipsAPI();
var visualData = vips.getVisualData();
var globalBlocks = vips.getVisualBlockList();

var data = []
var leafData = []
var vipsIDtoBlockIndex = []
var children = new Array(globalBlocks.length);
var hashStyleClass = [];

var CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

for (var i = 0; i < globalBlocks.length; i++) {
	children[i] = [];
	vipsID = globalBlocks[i]['-vips-id'];
	vipsIDtoBlockIndex[vipsID] = i;
}

for (var i = 0; i < globalBlocks.length; i++) {
	vipsID = globalBlocks[i]['-vips-id'];

	parentID = vipsID.match(/(.*)-\d*/);
	if(parentID) {
		var parentIdx = vipsIDtoBlockIndex[parentID[1]];
		if(!children[parentIdx]) {
			children[parentIdx] = [];
		}
		children[parentIdx].push(i);
	}
}

for (var i = 0; i < globalBlocks.length; i++) {
	var vipsID = globalBlocks[i]['-vips-id'];
	var childElementCount = globalBlocks[i]['-att-childElementCount'];
	if(childElementCount > 2) continue;

	var innerText = globalBlocks[i]['-att-innerText'];
	var outerText = globalBlocks[i]['-att-outerText'];
	var blockText = innerText || outerText;
	blockText = blockText.replace(/(\r\n|\n|\r)/gm,"");

	leafData[i] = blockText;

	var mtch = globalBlocks[i]['-vips-id'].match(/((\d-)*)(\d)/);
	if(mtch) {
		pos = mtch[3];
	}

	posInt = parseInt(pos);

	idxNext = vipsIDtoBlockIndex[mtch[1].concat(posInt+1)];
	idxPrev = vipsIDtoBlockIndex[mtch[1].concat(posInt-1)];
	hashPrev = hashNext = "";
	if(idxPrev) {
		hashPrev = globalBlocks[idxPrev]['-style-background-color'].toString().concat(globalBlocks[idxPrev]['-style-color'], globalBlocks[idxPrev]['-style-font-family'], globalBlocks[idxPrev]['-style-font-kerning'], globalBlocks[idxPrev]['-style-font-size'], globalBlocks[idxPrev]['-style-color'], globalBlocks[idxPrev]['-att-classList']);
	}
	if(idxNext) {
		hashNext = globalBlocks[idxNext]['-style-background-color'].toString().concat(globalBlocks[idxNext]['-style-color'], globalBlocks[idxNext]['-style-font-family'], globalBlocks[idxNext]['-style-font-kerning'], globalBlocks[idxNext]['-style-font-size'], globalBlocks[idxNext]['-style-color'], globalBlocks[idxNext]['-att-classList']);
	}

	//var hashVal = globalBlocks[i]['-style-background-color'].toString().concat(globalBlocks[i]['-style-color'], globalBlocks[i]['-style-font-family'], globalBlocks[i]['-style-font-kerning'], globalBlocks[i]['-style-font-size'], globalBlocks[i]['-style-color'], globalBlocks[i]['-att-classList'], pos);
	//var hashPrev = i>0 ? globalBlocks[i-1]['-style-background-color'].toString().concat(globalBlocks[i-1]['-style-color'], globalBlocks[i-1]['-style-font-family'], globalBlocks[i-1]['-style-font-kerning'], globalBlocks[i-1]['-style-font-size'], globalBlocks[i-1]['-style-color'], globalBlocks[i-1]['-att-classList']) : "";
	//var hashNext = i+1<globalBlocks.length ? globalBlocks[i+1]['-style-background-color'].toString().concat(globalBlocks[i+1]['-style-color'], globalBlocks[i+1]['-style-font-family'], globalBlocks[i+1]['-style-font-kerning'], globalBlocks[i+1]['-style-font-size'], globalBlocks[i+1]['-style-color'], globalBlocks[i+1]['-att-classList']) : "";

	var hashVal = globalBlocks[i]['-style-background-color'].toString().concat(globalBlocks[i]['-style-color'], globalBlocks[i]['-style-font-family'], globalBlocks[i]['-style-font-kerning'], globalBlocks[i]['-style-font-size'], globalBlocks[i]['-style-color'], globalBlocks[i]['-att-classList'], hashPrev, hashNext, (mtch[1].match(/-/g) || []).length);
	if(!hashStyleClass[hashVal]) { hashStyleClass[hashVal] = []; }
	hashStyleClass[hashVal].push(i);
}

var hashKeys = Object.keys(hashStyleClass);
for (var i = 0; i <hashKeys.length; i++) {
	for(var j = 0; j < hashStyleClass[hashKeys[i]].length; j++) {
		var id = hashStyleClass[hashKeys[i]][j];
		var box = globalBlocks[id]['-att-box'];
		box.style.border = "1px solid ".concat(CSS_COLOR_NAMES[i]);
		box.title = id.toString().concat(" : ", vipsID);
	}
}

//console.log(children);

for (var i = 0; i < globalBlocks.length; i++) {
	var ithData = [];
	for (var j = 0; j < children[i].length; j++) {
		var childIdx = children[i][j];
		if(leafData[j]) {
			childObj = {id: globalBlocks[j]['-vips-id'], data: leafData[j]};
			ithData.push(childObj);
		}
	}
	if(ithData.length > 0) {
		data.push({id: globalBlocks[i]['-vips-id'], data: ithData});
	}
}

// export to JSON and download
var strout = JSON.stringify(data);
filename = 'data_' + window.location.host + '.json';
var blob = new Blob([strout], {type: "text/json;charset=utf-8"});
saveAs(blob, filename);