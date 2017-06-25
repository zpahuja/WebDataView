console.log("VIPS Highlight All Labels");
console.log(LabelledData);

for (var i = 0; i < LabelledData.length; i++) {
	var label = LabelledData[i][0];
	var data = LabelledData[i][1];
  	var globalBlocksIndex = LabelledData[i][2];
	var labelColor = {email:"#FFFF00", title:"#FF7400", phone:"#00FF00", address:"#6F00FF", interests: "#00FFFF"};
	highlightLabel(globalBlocksIndex, data, labelColor[label]);
}

function highlightLabel(globalBlocksIndex, title, color) {
	var box = globalBlocks[globalBlocksIndex]['-att-box'];
	box.style.border = "2px solid ".concat(color);
	box.title = title;
}
