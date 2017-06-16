console.log("VIPS Clear All Highlights");
vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();
for (var i = 0; i < globalBlocks.length; i++) {
	globalBlocks[i]['-att-box'].style.border = "";
}