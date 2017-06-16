function VipsBlock() {
	//rendered Box, that corresponds to DOM element
	var _box = null;
	//children of this node
	var _children = null;
	//node id
	var _id = 0;
	//node's Degree Of Coherence
	var _DoC = 0;

	//number of images in node
	var _containImg = 0;
	//if node is image
	var _isImg = false;
	//if node is visual block
	var _isVisualBlock = false;
	//if node contains table
	var _containTable = false;
	//number of paragraphs in node
	var _containP = 0;
	//if node was already divided
	var _alreadyDivided = false;
	//if node can be divided
	var _isDividable = true;

	var _bgColor = null;

	var _frameSourceIndex = 0;
	var _sourceIndex = 0;
	var _tmpSrcIndex = 0;
	var _order = 0;


	//length of text in node
	var _textLen = 0;
	//length of text in links in node
	var _linkTextLen = 0;

	this.setIsVisualBlock = function(isVisualBlock) {
		_isVisualBlock = isVisualBlock;
		checkProperties();
	}

	this.isVisualBlock = function() {
		return _isVisualBlock;
	}

	var checkProperties = function() {
		checkIsImg();
		checkContainImg(this);
		checkContainTable(this);
		checkContainP(this);
		//***need work
	}

	var checkIsImg = function() {
	if (_box.nodeName == "IMG")
		_isImg = true;
	else
		_isImg = false;
	}

	var checkContainImg = function(vipsblock) {
		if(vipsblock.getBox().nodeName == "IMG") {
			vipsblock._isImg = true;
			this._containImg++;
		}

		for (var i = 0; i < vipsblock.getChildren().length; i++) {
			checkContainImg((vipsblock.getChildren())[i]);
		}
	}

	var checkContainTable = function(vipsblock) {
		if(vipsblock.getBox().nodeName == "TABLE") {
			this._containTable = true;
		}

		for (var i = 0; i < vipsblock.getChildren().length; i++) {
			checkContainTable((vipsblock.getChildren())[i]);
		}
	}

	var checkContainP = function(vipsblock) {
		if(vipsblock.getBox().nodeName == "P") {
			this._containP++;
		}

		for (var i = 0; i < vipsblock.getChildren().length; i++) {
			checkContainP((vipsblock.getChildren())[i]);
		}
	}

	this.addChild = function(child) {
		_children.push(child);
	}

	this.getChildren = function() {
		return _children;
	}

	this.setBox = function(box) {
		_box = box;
	}

	this.getBox = function() {
		return _box;
	}

	this.setId = function(id) {
		this._id = id;
	}

	this.getId = function() {
		return _id;
	}

	this.setDoC = function(doc) {
		this._doc = doc;
	}

	this.getDoC = function() {
		return _doc;
	}

	this.isDividable = function() {
		return _isDividable;
	}

	this.setIsDividable = function(isDividable) {
		this._isDividable = isDividable;
	}

	this.isAlreadyDivided = function() {
		return _alreadyDivided;
	}

	this.setAlreadyDivide = function(alreadyDivided) {
		this._alreadyDivided = alreadyDivided;
	}

	/**
	 * Checks if block is image
	 * @return True if block is image, otherwise false
	 */
	this.isImg = function()
	{
		return _isImg;
	}

	/**
	 * Checks if block contain images
	 * @return Number of images
	 */
	this.containImg = function()
	{
		return _containImg;
	}

	/**
	 * Checks if block contains table
	 * @return True if block contains table, otherwise false
	 */
	this.containTable = function()
	{
		return _containTable;
	}

	/**
	 * Gets number of paragraphs in block
	 * @return Number of paragraphs
	 */
	this.containP = function()
	{
		return _containP;
	}

	this.getBgColor = function() {
		if (this.getBox().nodeType == 3) {
			_bgColor = "white";
		}
		else {
			getComputedStyle(this.getBox()).getPropertyValue("background-color");
		}

		return _bgColor;
	}

}



