console.log("VIPS Highlight All");
var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();
for (var i = 0; i < globalBlocks.length; i++) {
	var box = globalBlocks[i]['-att-box'];
	console.log(globalBlocks[i]['-vips-id']);
	box.style.border = "2px solid #FF0000";
	box.title = i.toString().concat(" : ", globalBlocks[i]['-vips-id']);
	box.addEventListener('click', function(e){
		e.preventDefault();
		this.style.border = "4px solid blue";
	});
}