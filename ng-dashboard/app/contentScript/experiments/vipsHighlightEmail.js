console.log("VIPS Highlight Email");
var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();

for (var i = 0; i < globalBlocks.length; i++) {
	var innerText = globalBlocks[i]['-att-innerText'];
	var outerText = globalBlocks[i]['-att-outerText'];
	var innerHTML = globalBlocks[i]['-att-innerHTML'];
	var childElementCount = globalBlocks[i]['-att-childElementCount'];

	email = validateEmail(innerText, outerText, innerHTML);
	if (email && childElementCount <= 1) {
		var box = globalBlocks[i]['-att-box'];
		box.style.border = "3px solid #FFFF00";
		box.title = email;
	}
}

function validateEmail(innerText, outerText, html) {

	var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (innerText) {
		innerTextWithoutLineBreak = innerText.replace(/(\r\n|\n|\r)/gm,"");
		innerTextWithoutSpaces = innerTextWithoutLineBreak.replace(/\s+/g, '');
		if (emailRegEx.test(innerTextWithoutSpaces)) {
			return innerTextWithoutSpaces;
		}
	}

	if (outerText) {
		outerTextWithoutLineBreak = innerText.replace(/(\r\n|\n|\r)/gm,"");
		outerTextWithoutSpaces = innerTextWithoutLineBreak.replace(/\s+/g, '');
		if (emailRegEx.test(outerTextWithoutSpaces)) {
			return outerTextWithoutSpaces;
		}
	}

	link = html.match(/mailto:(.*)/);
	if(link) { 
		console.log(link[1]);
		return true;
	}
	return false;
}