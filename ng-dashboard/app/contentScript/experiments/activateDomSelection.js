console.log("Activate DOM Selection........");

var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();

for (var i = 0; i < globalBlocks.length; i++) {
	var box = globalBlocks[i]['-att-box'];
	//box.style.border = "2px solid #FF0000";
	box.setAttribute("id", i);
	//box.title = i.toString().concat(" : ", globalBlocks[i]['-vips-id']);
	box.addEventListener('click', function(e){
		e.preventDefault();
		this.style.border = "4px solid blue";
	});
}

if (typeof showBorderForDomSelection != 'function') {
	showBorderForDomSelection = function(){
		event.preventDefault();
		console.log(event.id);
	    event.target.style.border = "2px solid #FF0000";
	}
}

if (typeof hideBorderForDomSelection != 'function') {
	hideBorderForDomSelection = function (){    
		event.preventDefault();
		console.log(event.target);
	    event.target.style.border = "";
	}
}

document.addEventListener("click", showBorderForDomSelection);
document.addEventListener("mouseout", hideBorderForDomSelection);