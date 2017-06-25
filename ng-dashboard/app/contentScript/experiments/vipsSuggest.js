//Initialization
vips = new VipsAPI(); //our API
globalBlocks = vips.getVisualBlockList(); //the list that contains your data, each item is a data element

//Your algorithm to analyze the data is here
//The following code manually specifies the result as a list of IDs.
//http://infolab.stanford.edu/db_pages/members.html 
/*************************************************************/
alert("just a demo, only works for http://infolab.stanford.edu/db_pages/members.html");
ids = [];
ids2 = [];
//leftcolumn: starting "1-6-1"; ending "1-27-1";
s = 6;
e = 27;
for (var i = s; i <= e; i++) {
	ids.push("1-"+i+"-1");
}
//starting "1-6-2"; ending "1-27-2";
s = 6;
e = 27;
for (var i = s; i <= e; i++) {
	ids.push("1-"+i+"-2");
}
//for 2nd clusters starting "1-6-3"; ending "1-26-3";
s = 6;
e = 26;
for (var i = s; i <= e; i++) {
	ids2.push("1-"+i+"-3");
}
//starting "1-6-4"; ending "1-26-4";
s = 6;
e = 26;
for (var i = s; i <= e; i++) {
	ids2.push("1-"+i+"-4");
}
/*************************************************************/

//Visualize the result
for (var i = 0; i < globalBlocks.length; i++) {
	for (var j = 0; j < ids.length; j++) {
		if (globalBlocks[i]['-vips-id']===ids[j])
			globalBlocks[i]['-att-box'].style.border = "4px solid blue";
	}
	for (var j = 0; j < ids2.length; j++) {
		if (globalBlocks[i]['-vips-id']===ids2[j])
			globalBlocks[i]['-att-box'].style.border = "4px solid orange";
	}
}
confirm("We think the highlighted blocks are interesting data in this page. Do you want to save it?");