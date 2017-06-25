console.log("VIPS Highlight Phone Number");
var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();

for (var i = 0; i < globalBlocks.length; i++) {
	var innerText = globalBlocks[i]['-att-innerText'];
	var outerText = globalBlocks[i]['-att-outerText'];
	var childElementCount = globalBlocks[i]['-att-childElementCount'];

	phoneNumber = validatePhoneNumber(innerText, outerText);
	if (phoneNumber && childElementCount <= 1) {
		var box = globalBlocks[i]['-att-box'];
		box.style.border = "3px solid #00FF00";
		box.title = phoneNumber;
	}
}

function validatePhoneNumber(innerText, outerText) {
	var text = innerText || outerText;
	textWithoutLineBreak = text.replace(/(\r\n|\n|\r)/gm,"");
	textWithoutSpaces = textWithoutLineBreak.replace(/\s+/g, '');
	textWithoutSpecialCharacters =  textWithoutSpaces.replace(/[^\w\s]/gi, '');

	// Get 7 or 10 digit numbers
	if ( (/^\d{7}$/).test(textWithoutSpecialCharacters) || (/^\d{10}$/).test(textWithoutSpecialCharacters))
		return textWithoutSpecialCharacters;
	else
		return false;
}
