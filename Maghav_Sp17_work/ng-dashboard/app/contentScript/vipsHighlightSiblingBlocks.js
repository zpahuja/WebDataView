console.log("VIPS Highlight All Sibling Nodes...");
var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();
root = vips.getVisualBlockTree();
alert("You need to open console in Google Chrome to see the output. See how to do that here: https://developers.google.com/web/tools/chrome-devtools/debug/console/console-ui?hl=en");
alert("After opening the console, click on any visual block to see its siblings in the console");
for (var i = 0; i < globalBlocks.length; i++) {
	var box = globalBlocks[i]['-att-box'];
	box.style.border = "2px solid #FF0000"; 
	box.title = globalBlocks[i]['-vips-id'];
	var cur = root.first(function (node) {
	    return node.model.data['-vips-id'] === globalBlocks[i]['-vips-id'];
	});
	// root.first() is a function of TreeModel. You can see the tutorial about TreeModel here: 
	// http://jnuno.com/tree-model-js/
	var siblings = root.all(function (node) {
	    return node.parent === cur.parent;
	});
	// root.all() is also a function of TreeModel.
	box.siblings = siblings;
	box.addEventListener('click', function(e){
		e.preventDefault();
		var ss = this.siblings;
		console.log("You have just clicked on a block with vips-id " + this.title);
		console.log("Here is the list of its siblings in the visual block tree:");
		for (var k = 0; k < ss.length; k++) {
			console.log(ss[k].model.data['-vips-id'])
			console.log(ss[k].model.data['-att-box']);
		}
		this.style.border = "4px solid blue";
	});
}