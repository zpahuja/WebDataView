console.log("Labelling Data Elements...");
var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();
dataLabels = new Array(globalBlocks.length); // Each global block has a label that has been validated or is undefined
LabelledData = []; // Array of [label, extractedData, globalBlocksIndex]
listOfNames = [];

for (var i = 0; i < globalBlocks.length; i++) {
	var childElementCount = globalBlocks[i]['-att-childElementCount'];
	// Only leaf nodes can be labelled. Else continue
	if(childElementCount > 1) continue;

	var innerText = globalBlocks[i]['-att-innerText'];
	var outerText = globalBlocks[i]['-att-outerText'];
	var blockText = innerText || outerText;
	var innerHTML = globalBlocks[i]['-att-innerHTML'];
	var outerHTML = globalBlocks[i]['-att-outerHTML'];

	// Label Emails
	var email = validateEmail(blockText, innerHTML);
	if(labelData("email", email, i)) continue;

	// Label Titles
	var dictOfFacultyTitles = ["Lecturer", "Professor", "Chair", "Emeritus", "Adjunct", "Affiliate", "Faculty", "Research", "Scholar"];
	var title = validateDictionary(blockText, dictOfFacultyTitles);
	if (labelData("title", title, i)) continue;

	// Label Phone Numbers
	var phoneNumber = validatePhoneNumber(blockText);
	if (labelData("phone", phoneNumber, i)) continue;

	// Label Images
	var imageURL = validateImage(i, innerHTML || outerHTML);
	// TODO: Use alt attribute of images to correlate them with record when image not part of a record
	if (labelData("image", imageURL, i)) continue;

	// Label Interests
	var dictOfCSInterests = ["Program", "Circuit", "Electronic", "Signal", "Computation", "Software", "Algorithms", "Processing", "Microelectronic", "Artificial Intelligence", "Probabilistic", "Probability", "Automata", "Computability", "Complexity", "Computational", "Information", "Architecture", "Convex Optimization", "Theory", "Theoretical", "Bioinformatics", "Quantum", "Analog", "Digital", "Nano", "Mobile", "Autonomous", "Multicore", "Network", "Parallel", "Computing", "Machine Vision", "Computer Vision", "Security", "Interface", "Cognitive", "Database", "Graphics", "Stochastic", "Control", "Nonlinear", "Convex Analysis", "Game Theory", "Optimization", "Communication", "Numerical", "Simulation", "Automatic", "Recognition", "Inference", "Wireless", "Electromagent", "Micro", "Statistic", "Semiconductor", "Distributed", "Multithreaded", "Parallel", "Operating System", "Underactuated", "Robot", "Data Structures", "Big Data", "Randomized", "Machine Learning", "Cryptography", "Cryptanalysis"];
	var interests = validateDictionary(blockText, dictOfCSInterests);
	if (labelData("interests", interests, i)) continue;

	// Label Names
	var name = validateName(blockText);
	if (labelData("name", name, i)) continue;

	var id = validateID(blockText);
	if (labelData("id", id, i)) continue;

	// Label Qualifications/ Degrees
	var dictOfDegreeTitles = ["PhD", "Ph\\.D", "M\\.S\\.", "B\\.S\\.", "M\\.Phil", "MPhil"];
	var degree = validateDictionary(blockText, dictOfDegreeTitles);
	if (labelData("degree", degree, i)) continue;

	// Validate Addresses
	var address = validateAddress(blockText);
	if (labelData("address", address, i)) continue;
}

// Labels that rely on recognizing all names on webpage first
for (var i = 0; i < globalBlocks.length; i++) {
	var childElementCount = globalBlocks[i]['-att-childElementCount'];
	// Only leaf nodes can be labelled. Else continue
	if(childElementCount > 1 || dataLabels[i]) continue;

	var innerText = globalBlocks[i]['-att-innerText'];
	var outerText = globalBlocks[i]['-att-outerText'];
	var blockText = innerText || outerText;

	// Label IDs
	var id = validateID(blockText);
	if (labelData("id", id, i)) continue;
}

/* This is where highlights begin */
/*
for (var i = 0; i < LabelledData.length; i++) {
	var label = LabelledData[i][0];
	var data = LabelledData[i][1];
	var globalBlocksIndex = LabelledData[i][2];
	var labelColor = {email:"#FFFF00", title:"#FF7400", phone:"#00FF00", address:"#6F00FF", interests:"#00FFFF", image:"#FF0000", degree:"#581845", name:"#2670CF", id:"#FFFF00"};
	highlightLabel(globalBlocksIndex, data, labelColor[label]);
}
*/
/* This is where highlights end */

function highlightLabel(globalBlocksIndex, title, color) {
	var box = globalBlocks[globalBlocksIndex]['-att-box'];
	box.style.border = "2px solid ".concat(color);
	box.title = title;
}

function labelData(label, data, index) {
	if (data) {
		dataLabels[index] = label;
		LabelledData.push([label, data, index]);
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
	mailto = html.match(/mailto:(.*)/);
	if (mailto) {
		email = mailto[1].match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/);
			if (email && emailRegEx.test(email[0])) {
				return email[0];
			}
	}
 	
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
	textWithoutSpecialCharacters =	textWithoutSpaces.replace(/[^\w\s]/gi, '');

	// Get 7 or 10 digit numbers
	if ( (/^\d{7}$/).test(textWithoutSpecialCharacters) || (/^\d{10}$/).test(textWithoutSpecialCharacters))
		return textWithoutSpecialCharacters;
	else
		return false;
}

function validateImage(index, html) {
	if(globalBlocks[index]['-att-nodeName'] == "IMG") {
		return globalBlocks[index]['-att-src'];
	}

	// check for "<img " in html
	img = html.match(/<img.*src\s*\=\s*\"([^"]+?)\"/);
	if(img) {
		// if url begins with a '//' add 'http:' at beginning
		if((/\/\/.*/).test(img[1])) {
			return "http:".concat(img[1]);
		}
		return img[1];
	}
	return false;
}

function validateAddress(text) {
	textWithoutLineBreak = text.replace(/(\r\n|\n|\r)/gm,"");
	if ((/\d/i).test(textWithoutLineBreak))
		return textWithoutLineBreak;
	else
		return false;
}

function validateName(txt) {
	/*
	Following solution includes a bug fix with NER when there is a middle initial followed by a period in the name such as Kevin C. Chang
	TODO: It is not the best solution. Best solution would replace all /\s\w\./ with \s\w as NER relies on both first name, last name so 
	below solution reduces number of true positives of NER
	*/

	nlp = window.nlp_compromise;
	var names = [];
	var people = nlp.text(txt).people();
	for (var i = 0; i < people.length; i++) {
		if (!people[i].pos["Pronoun"]) {
		    var pattern = new RegExp((people[i].text).concat("(\\s?[A-z]\\.)+.*\\.?"), "g");
			var sentence = txt.match(pattern);
			if(sentence) {
				var sentenceWithoutPeriods = sentence[0].replace(/(\.)/g,"");
				var person = nlp.text(sentenceWithoutPeriods).people()[0];
				listOfNames.push([person.firstName, person.lastName]);
				if(person.text != people[i].text) {
					var patt = new RegExp((person.firstName).concat(".*?", person.lastName), "gi");
					var name = sentence[0].match(patt);
					if(name && name[0].replace(/\./g,"") == person.text) {
						names.push(name[0]);
					}
				}
			}
			else {
				listOfNames.push([people[i].firstName, people[i].lastName]);
				names.push(people[i].text);
			}
		}
	}

	return names.toString();
}

function validateID(text) {
	// if there is a single space then it cannot be an id
	if((/.+\s.+/).test(text)) return false;

	for(var i = 0; i < listOfNames.length; i++) {
		if((listOfNames[i][0] && (text.toLowerCase()).includes(listOfNames[i][0].toLowerCase())) || (listOfNames[i][1] && (text.toLowerCase()).includes(listOfNames[i][1].toLowerCase()))) {
			return text;
		}
	}
}
