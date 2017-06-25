console.log("vips Cluster()");

vipsCluster        = [];
vipsCluster["1"]   = [];
vipsClusterID      = [];
vipsClusterID["1"] = [];
clusters           = [];
leafBlocks         = [];
var colors         = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
var colorCounter   = 0;

for (var i = 0; i < globalBlocks.length; i++) {
	var vipsId = globalBlocks[i]['-vips-id'];
	vipsCluster[vipsId] = [];
	vipsClusterID[vipsId] = [];
	vipsCluster[(vipsId.match(/(.*)-\d/))[1]].push(i);
	vipsClusterID[(vipsId.match(/(.*)-\d/))[1]].push(vipsId);
}

for (var i = 0; i < globalBlocks.length; i++) {
	var vipsId = globalBlocks[i]['-vips-id'];
	clusters[i] = [];
	for(var j = 0; j < vipsCluster[vipsId].length; j++) {
		var childIndex = vipsCluster[vipsId][j];
		var childId    = globalBlocks[childIndex]['-vips-id'];
		var childCount = vipsCluster[childId].length;
		if(childCount == 0) {
			leafBlocks.push(childIndex);
		}

		if(clusters[i][childCount]) {
			clusters[i][childCount].push(childIndex);
		}
		else {
			clusters[i][childCount] = [childIndex];
		}
	}
}te

console.log(vipsCluster);
console.log(vipsClusterID);
console.log(clusters);

for (var i = 0; i < globalBlocks.length; i++) {
	for (var j = 0; j < clusters[i].length; j++) {
		if(clusters[i][j]) {
			for(var k = 0; k < clusters[i][j].length; k++) {
				var idx = clusters[i][j][k];
				var vips_id = globalBlocks[idx]['-vips-id'];
				var child_count = j;
				highlightLabel(idx, idx.toString().concat(" : ", vips_id, " : ", child_count.toString()), colors[colorCounter]);
				// highlightLabel(i, i.toString().concat(" : ", vips_id, " : ", child_count.toString()), colors[colorCounter]);
			}
			colorCounter++;
		}
	}
}