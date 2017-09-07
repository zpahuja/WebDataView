var Periphery = {};

/******************************** create a box ********************************/

Periphery.createBox = function(id, className, appendToSelector) {
    appendToSelector = appendToSelector ? appendToSelector : 'body';
	var attrs = {};
	if (id) {
		attrs.id = id;
	}
	attrs.class = className ? "periphery-default-iframe " + className : "periphery-default-iframe";
	var iframe = $('<iframe />', attrs);
	if (window.self === window.top) {
        $(appendToSelector).append(iframe);
	}
	iframe.contents().find("head").append($("<link/>", {
		rel: "stylesheet",
		href: chrome.extension.getURL('lib/periphery/periphery-extra.css'),
		type: "text/css"
	}));

	return iframe.contents().find("body");
};

/******************************** style elements within a box ********************************/

Periphery.loadBoxCSS = function(boxSelector, CSSPath, callback) {
	var head = $(boxSelector).contents().find("head");
	head.append($("<link/>", {
		rel: "stylesheet",
		href: CSSPath,
		type: "text/css"
	}));
	if (callback && typeof(callback) === 'function') {
		callback();
	}
};

Periphery.loadBoxJS = function(boxSelector, JSPath, callback) {
	var head = $(boxSelector).contents().find("head");
	head.append($("<link/>", {
		href: JSPath,
		type: "text/javascript"
	}));
	if (callback && typeof(callback) === 'function') {
		callback();
	}
};

/******************************** find/modify a specific boxe ********************************/

Periphery.findBox = function(boxSelector) {
	return $(boxSelector).contents().find("body");
};

Periphery.rewriteBox = function(boxSelector, HTML) {
	Periphery.findBox(boxSelector).html(HTML)
};

Periphery.appendToBox = function(boxSelector, HTML) {
	Periphery.findBox(boxSelector).append(HTML)
};

Periphery.prependToBox = function(boxSelector, HTML) {
	Periphery.findBox(boxSelector).prepend(HTML)
};

/******************************** find/modify elements within all boxes ********************************/

Periphery.find = function(elemSelector) {
	return $(".periphery-default-iframe").contents().find(elemSelector);
};

Periphery.rewrite = function(elemSelector, HTML) {
	Periphery.find(elemSelector).html(HTML)
};

Periphery.append = function(elemSelector, HTML) {
	Periphery.find(elemSelector).append(HTML);
};

Periphery.prepend = function(elemSelector, HTML) {
	Periphery.find(elemSelector).prepend(HTML);
};

/******************************** find/modify elements within a specific box ********************************/

Periphery.findElemInBox = function(elemSelector, boxSelector) {
	return $(boxSelector).contents().find(elemSelector);
};

Periphery.rewriteElemInBox = function(elemSelector, boxSelector, HTML) {
	Periphery.findElemInBox(elemSelector, boxSelector).html(HTML)
};

Periphery.appendToElemInBox = function(elemSelector, boxSelector, HTML) {
	Periphery.findElemInBox(elemSelector, boxSelector).append(HTML);
};

Periphery.prependToElemInBox = function(elemSelector, boxSelector, HTML) {
	Periphery.findElemInBox(elemSelector, boxSelector).prepend(HTML);
};