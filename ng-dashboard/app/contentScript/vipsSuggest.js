//Initialization
console.log("HEY");
//var jq = document.createElement('script');
//jq.src = "lib/jquery/jquery.min.js";
//document.getElementsByTagName('head')[0].appendChild(jq);
// ... give time for script to load, then type (or see below for non wait option)
//jQuery.noConflict();

var Coordinates = [[]];
var index = 0;

console.log(window.location.href);
var url = window.location.href;


// Map for testing
if(url=='http://webscraper.io/test-sites/e-commerce/static/computers/laptops')
	var check = "div.thumbnail";
if(url=='https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=protein')
	var check = "div.s-item-container";
if(url=='http://cs.illinois.edu/people/faculty/department-faculty')
	var check = "article.extDirectoryPerson";
if(url=='https://www.ece.illinois.edu/directory/faculty.asp')
	var check = "article";
if(url=='https://www.yelp.com/search?find_desc=Restaurants&find_loc=Champaign%2C+IL&ns=1')
	var check = "li.regular-search-result";
if(url=='https://www.youtube.com/')
	var check = "div.yt-lockup-dismissable";
if(url=='https://github.com/search?utf8=%E2%9C%93&q=c%2B%2B&type=')
	var check = "div.repo-list-item.d-flex.flex-justify-start.py-4.public.source";


// Finding the coordinates of each class
// Coordinates - List of the coordinates of records in order(top,left,bottom,right)
$(check).each(function() {
		var offset = $(this).offset()
    	var right = offset.left + $(this).width();
    	var bottom = offset.top + $(this).height();
    	Coordinates[index++] = [offset.top,offset.left,bottom,right];
		//console.log("top: ".concat(offset.top, ", left: ", offset.left, ", bottom: ", bottom, ", right :", right))
});


//Initialization
vips = new VipsAPI(); //our API
globalBlocks = vips.getVisualBlockList(); //the list that contains your data, each item is a data element

//----------------------//
// Find the records


// Highlighting all the blocks red
for (var i = 0; i < globalBlocks.length; i++) {
	var box = globalBlocks[i]['-att-box'];
	box.style.border = "2px solid #FF0000";
	box.title = globalBlocks[i]['-vips-id'];
	}

// assigning record number to a block that belongs to a particular record
for(var i=0;i<globalBlocks.length;i++)
    {
        globalBlocks[i]['-record-no'] = -1;
    }


for (var i = 0; i < globalBlocks.length; i++) 
{
	for(var j = 0; j < Coordinates.length;j++)
	{
		if((globalBlocks[i]['-vips-startX'] > Coordinates[j][1]-10 && globalBlocks[i]['-vips-endX'] < Coordinates[j][3]+10) && (globalBlocks[i]['-vips-startY']> Coordinates[j][0]-10  && globalBlocks[i]['-vips-endY']<Coordinates[j][2]+10))
		{	var box = globalBlocks[i]['-att-box'];
			box.style.border = "3px solid blue";
			box.title = globalBlocks[i]['-vips-id'];
			globalBlocks[i]['-record-no'] = j;
			console.log(globalBlocks[i]['-vips-id']);
			console.log(globalBlocks[i]['-record-no'])
		}
	}
}




console.log("Record progress");

//-----------------------//
 	pos = [];
	input_ids = {};
	neg = [];
	cur_clus = 1;
	colors_temp = [];
	
	for(var i=0;i<globalBlocks.length;i++)
    {
        globalBlocks[i]['-input'] = 0;
    }
    colors_temp.push("4px solid red");
	//colors_temp.push("4px solid blue");
	colors_temp.push("4px solid orange");
	colors_temp.push("4px solid green");
	colors_temp.push("4px solid yellow");
	colors_temp.push("4px solid black");

/*
	// Highlighting all the blocks red
	for (var i = 0; i < globalBlocks.length; i++) {
	var box = globalBlocks[i]['-att-box'];
	box.style.border = "2px solid #FF0000";
	box.title = globalBlocks[i]['-vips-id'];
	}
*/
	// Taking input from the user
	for (var i = 0; i < globalBlocks.length; i++) {
	    var box = globalBlocks[i]['-att-box'];
	    box.title = globalBlocks[i]['-vips-id'];
	    box.addEventListener('click', function (e) {
	        e.preventDefault();
	        var vips_id = this.title;
	        if (pos.length > 0) console.log( vips_id.substr(0,pos[pos.length-1].lastIndexOf('-')));
	        if (pos.length === 0 || !pos[pos.length-1].startsWith(vips_id)) {
	            pos.push(vips_id);
	            input_ids[vips_id] = cur_clus;
	            for (var j = 0; j < globalBlocks.length; j++) {
	            	if (vips_id.localeCompare(globalBlocks[j]['-vips-id'])===0) {
	            		globalBlocks[j]['-input'] = cur_clus;
	            		break;
	            	}
	            }
	            this.style.border = colors_temp[cur_clus];
	            // dangerous if the access to the array is asynchronous, working in my tests
	        }
	        //console.log(pos);
	    });
	    /*box.addEventListener('contextmenu', function (e) {
	        e.preventDefault();
	        cur_clus++;
	    });*/

	}

/*
$(document.body).append('<button id="new-field" style="height:50px;"> Add New Field </button>');
$('#new-field').on('click', function () {
	console.log(colors_temp[cur_clus]);
	cur_clus++;
});*/

// Enter for next field
$(window).on('keypress', function(e) {

    var code = (e.keyCode ? e.keyCode : e.which);
  if(code == 13) { 
  	cur_clus++;
    console.log(colors_temp[cur_clus]);
	
  }


});

// To make sure we are finished with taking inputs
$(document.body).append('<input type="button" id="end-input" style="height:50px;" value="Done with Inputs" />');
$('#end-input').on('click', function () {
	console.log("end-input works");
	chrome.runtime.sendMessage(globalBlocks, function(response) {
/*
for (var i = 0; i < globalBlocks.length; i++) {
	console.log(globalBlocks[i]['-vips-id']);
	console.log(globalBlocks[i]['-input']);

} */
  console.log("globalBlocks sent");
});
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
	colors.push("4px solid red");
	//colors.push("4px solid blue");
	colors.push("4px solid orange");
	colors.push("4px solid green");
	colors.push("4px solid yellow");
	colors.push("4px solid black");
    //console.log(clusterDict);


    //Coloring things 
    
    for (var i = 0; i < globalBlocks.length; i++) {
		globalBlocks[i]['-att-box'].style.border = colors[clusterDict[globalBlocks[i]['-vips-id']]];
		console.log(globalBlocks[i]['-vips-id']);
		console.log(colors[clusterDict[globalBlocks[i]['-vips-id']]]);
	}

	
  });

confirm("We think the highlighted blocks are interesting data in this page. Do you want to save it?");