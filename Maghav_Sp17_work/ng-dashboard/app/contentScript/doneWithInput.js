chrome.runtime.sendMessage(globalBlocks, function(response) {
/*
for (var i = 0; i < globalBlocks.length; i++) {
	console.log(globalBlocks[i]['-vips-id']);
	console.log(globalBlocks[i]['-input']);

} */
  console.log("globalBlocks sent");
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    //if (request.greeting == "hello")
    //console.log(request);
    sendResponse({farewell: "goodbye"});
    clusterDict = request;
    // array for colour each representing a cluster
	colors = [];
	colors.push("none");
	//colors.push("4px solid blue");
	colors.push("4px solid orange");
	colors.push("4px solid green");
	colors.push("4px solid yellow");
	colors.push("4px solid black");
    console.log(clusterDict);
    csv_list = [];
    c1_list = [];
    c2_list = [];
    for (var i = 0; i < globalBlocks.length; i++) {
		globalBlocks[i]['-att-box'].style.border = colors[clusterDict[globalBlocks[i]['-vips-id']]];
		//console.log(globalBlocks[i]['-vips-id']);
		//console.log(colors[clusterDict[globalBlocks[i]['-vips-id']]]);
		if( clusterDict[globalBlocks[i]['-vips-id']]==1)
			c1_list.push(globalBlocks[i]['-att-src'])
		else if(clusterDict[globalBlocks[i]['-vips-id']]==2)
			c2_list.push(globalBlocks[i]['-att-textContent'])
	}
	csv_list.push(c1_list);
	csv_list.push(c2_list);
	var data = csv_list;
csvContent="";
data.forEach(function(infoArray, index){

   dataString = infoArray.join(",");
   csvContent += index < data.length ? dataString+ "\n" : dataString;

});

filename = window.location.host + '-SSDB.csv';
var blob = new Blob([csvContent], {type: "text/csv;charset=utf-8"});
saveAs(blob, filename);





  });
