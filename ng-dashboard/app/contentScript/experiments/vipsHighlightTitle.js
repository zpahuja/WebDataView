console.log("VIPS Highlight Job Title");
var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();

for (var i = 0; i < globalBlocks.length; i++) {
	var innerText = globalBlocks[i]['-att-innerText'];
	var outerText = globalBlocks[i]['-att-outerText'];
	var childElementCount = globalBlocks[i]['-att-childElementCount'];

	title = validateTitle(innerText || outerText, ["Lecturer", "Professor", "Chair", "Emeritus", "Adjunct", "Affiliate"]);
	if (title && childElementCount <= 1) {
		var box = globalBlocks[i]['-att-box'];
		box.style.border = "3px solid #FF7400";
		box.title = title;
	}
}

function validateTitle(text, dictionary) {
	textWithoutLineBreak = text.replace(/(\r\n|\n|\r)/gm,"");
	for(var i = 0; i < dictionary.length; i++) {
		var pattern = new RegExp(dictionary[i], "i");
		if(pattern.test(textWithoutLineBreak))
			return textWithoutLineBreak;
	}
	return false;
}
