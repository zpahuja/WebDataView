console.log("Labelling Data Elements...");

var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();
var dataLabels = new Array(globalBlocks.length); // Each global block has a label that has been validated or is undefined
var LabelledData = []; // Array of [label, extractedData, globalBlocksIndex]

for (var i = 0; i < globalBlocks.length; i++) {
	var childElementCount = globalBlocks[i]['-att-childElementCount'];
	// Only leaf nodes can be labelled. Else continue
	if(childElementCount > 1) continue;

	var innerText = globalBlocks[i]['-att-innerText'];
	var outerText = globalBlocks[i]['-att-outerText'];
  var innerHTML = globalBlocks[i]['-att-innerHTML'];

  // Label Emails
  var email = validateEmail(innerText || outerText, innerHTML);
	if(labelData("email", email, i)) continue;

  // Label Titles
  var dictOfFacultyTitles = ["Lecturer", "Professor", "Chair", "Emeritus", "Adjunct", "Affiliate"];
	var title = validateDictionary(innerText || outerText, dictOfFacultyTitles);
	if (labelData("title", title, i)) continue;

	// Label Phone Numbers
  var phoneNumber = validatePhoneNumber(innerText || outerText);
	if (labelData("phone", phoneNumber, i)) continue;

	// Validate Addresses
  var address = validateAddress(innerText || outerText);
	if (labelData("address", address, i)) continue;
}

console.log(LabelledData);
console.log("Label Data Elements finished successfully");

function labelData(label, data, index) {
	if (data) {
		dataLabels[index] = label;
		LabelledData[LabelledData.length] = [label, data, index];
		// console.log("label : ".concat(label, "; data : ", data, "; index : ", index));
		return true;
	}
	return false;
}

function validateEmail(text, html) {

	var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (text) {
		textWithoutLineBreak = text.replace(/(\r\n|\n|\r)/gm,"");
		textWithoutSpaces = textWithoutLineBreak.replace(/\s+/g, '');
		if (emailRegEx.test(textWithoutSpaces))
			return textWithoutSpaces;
	}

	// Find email address from mailto in href if not in text
	/* TODO pattern match to extract email from mailto */
	link = html.match(/mailto:(.*)/);
 	if (link) return link;

	return false;
}

function validateDictionary(text, dictionary) {
	textWithoutLineBreak = text.replace(/(\r\n|\n|\r)/gm,"");
	for(var i = 0; i < dictionary.length; i++) {
		var pattern = new RegExp(dictionary[i], "i");
		if(pattern.test(textWithoutLineBreak))
			return textWithoutLineBreak;
	}
	return false;
}

function validatePhoneNumber(text) {
	textWithoutLineBreak = text.replace(/(\r\n|\n|\r)/gm,"");
	textWithoutSpaces = textWithoutLineBreak.replace(/\s+/g, '');
	textWithoutSpecialCharacters =  textWithoutSpaces.replace(/[^\w\s]/gi, '');

	// Get 7 or 10 digit numbers
	if ( (/^\d{7}$/).test(textWithoutSpecialCharacters) || (/^\d{10}$/).test(textWithoutSpecialCharacters))
		return textWithoutSpecialCharacters;
	else
		return false;
}

function validateAddress(text) {
	textWithoutLineBreak = text.replace(/(\r\n|\n|\r)/gm,"");
  if ((/\d/i).test(textWithoutLineBreak))
      return textWithoutLineBreak;
  return false;
}
