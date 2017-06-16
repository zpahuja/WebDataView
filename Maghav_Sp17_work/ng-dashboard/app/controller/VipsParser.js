function VipsParser() {
	var _pageHeight = window.innerHeight;
	var _pageWidth = window.innerWidth;
	// Default value
	var _sizeTresholdHeight = 80;
	var _sizeTresholdWidth = 80;

	var _vipsBlocks = new VipsBlock();
	var _currentVipsBlock = null;
	var _tempVipsBlock = null;
	var _visualBlocksCount = 0;

	this.parse = function() {
		if(pageWidth && pageHeight) {
			_vipsBlocks = new VipsBlock(); 
			visualBlockCount = 0;
			constructVipsBlockTree(_vipsBlocks);
			divideVipsBlockTree(_vipsBlocks);
			getVisualBlocksCount(_vipsBlocks);
		}
		else {
			console.log("Page Viewport is not defined");
		}
	}

	var isTextNode = function(el) {
		if (el.nodeType == 3) {
			return true;
		}
		else {
			return false;
		}
	}

	var getVisualBlocksCount = function(vipsBlock) {
		if (vipsBlock.isVisualBlock())
			_visualBlocksCount++;
		for (var i = 0; i < vipsBlock.getChildren().length; i++) {
			if(!isTextNode(vipsblock.getChildren()[i].getBox()))
				getVisualBlocksCount(vipsblock.getChildren()[i]);
		}
	}

	var constructVipsBlockTree = function(element,node) {
		node.setBox(element);
		var element_list = element.childNodes;
		var clength = 0;

		if (!isTextNode(element)) {
			for(var i = 0; i < element_list.length; i++) {
				node.addChild(new VipsBlock());
				clength = node.getChildren().length;
				constructVipsBlockTree(box, node.getChildren()[clength-1]);
			}
		} 
	}

	var divideVipsBlockTree = function(vipsBlock) {
		_currentVipsBlock = vipsBlock;
		var elementBox = vipsBlock.getBox();

		if (applyVipsRules(elementBox) && vipsBlock.isDividable() && !vipsBlock.isVisualBlock()) {
			// if element is dividable, let's divide it
			_currentVipsBlock.setAlreadyDivided(true);
			for (var i = 0; i < vipsBlock.getChildren().length; i++) {
				if (!isTextNode(vipsBlock.getChildren()[i].getBox()))
					divideVipsBlockTree(vipsBlock.getChildren()[i]);
			}
		}

		else {
			if (vipsBlock.isDividable()) {
				vipsBlock.setIsVisualBlock(true);
				vipsBlock.setDoC(11);
			}

			if (!verifyValidity(elementBox)) {
				_currentVipsBlock.setIsVisualBlock(false);
			}
		}
	}

	var getOffset = function(el) {
		el = el.getBoundingClientRect();
		return {
			left: el.left + window.scrollX,
			top: el.top + window.scrollY
		}
	}

	var verifyValidity = function(node) {
		nlist = node.childNodes;

		if (getOffset(node).left <= 0 || getOffset(node).top <= 0) {
			return false;
		}

		if (node.offsetWidth <= 0 || node.offsetHeight <= 0) {
			return false;
		}

		for (var i = 0; i < nlist.length; i++) {
			if (nlist[i].nodeName == "IMG") {
				return true;
			}
			if (nlist[i].nodeName == "INPUT") {
				return true;
			}
		}

		return true;

	}

	//***may need this
	var getDisplayType = function(ele) {
		var cStyle = ele.currentStyle || window.getComputedStyle(ele, ""); 
		return cStyle.display;
	}

	/** VIPS DOC Rules
	 * On different DOM nodes it applies different sets of VIPS rules.
	 * @param node DOM node
	 * @return Returns true if element is dividable, otherwise false.
	 */
	var applyVipsRules = function(node) {
		var ret = false;

		if (node.style.display == "inline") {
			ret = applyInlineTextNodeVipsRules(node);
		}
		else if (node.nodeName == "TABLE")
		{
			ret = applyTableNodeVipsRules(node);
		}
		else if (node.nodeName = "TR")
		{
			ret = applyTrNodeVipsRules(node);
		}
		else if (node.nodeName = "TD")
		{
			ret = applyTdNodeVipsRules(node);
		}
		else if (node.nodeName = "P")
		{
			ret = applyPNodeVipsRules(node);
		}
		else
		{
			ret = applyOtherNodeVipsRules(node);
		}

		return ret;
	}

	var applyOtherNodeVipsRules = function(node)
	{
		// 1 2 3 4 6 8 9 11

		if (ruleOne(node))
			return true;

		if (ruleTwo(node))
			return true;

		if (ruleThree(node))
			return true;

		if (ruleFour(node))
			return true;

		if (ruleSix(node))
			return true;

		if (ruleEight(node))
			return true;

		if (ruleNine(node))
			return true;

		if (ruleEleven(node))
			return true;

		return false;
	}

	/**
	 * Applies VIPS rules on &lt;P&gt; node.
	 * @param node Node
	 * @return Returns true if one of rules success and node is dividable.
	 */
	var applyPNodeVipsRules = function(node)
	{
		// 1 2 3 4 5 6 8 9 11

		if (ruleOne(node))
			return true;

		if (ruleTwo(node))
			return true;

		if (ruleThree(node))
			return true;

		if (ruleFour(node))
			return true;

		if (ruleFive(node))
			return true;

		if (ruleSix(node))
			return true;

		if (ruleSeven(node))
			return true;

		if (ruleEight(node))
			return true;

		if (ruleNine(node))
			return true;

		if (ruleTen(node))
			return true;

		if (ruleEleven(node))
			return true;

		if (ruleTwelve(node))
			return true;

		return false;
	}

	/**
	 * Applies VIPS rules on &lt;TD&gt; node.
	 * @param node Node
	 * @return Returns true if one of rules success and node is dividable.
	 */
	var applyTdNodeVipsRules = function(node)
	{
		// 1 2 3 4 8 9 10 12

		if (ruleOne(node))
			return true;

		if (ruleTwo(node))
			return true;

		if (ruleThree(node))
			return true;

		if (ruleFour(node))
			return true;

		if (ruleEight(node))
			return true;

		if (ruleNine(node))
			return true;

		if (ruleTen(node))
			return true;

		if (ruleTwelve(node))
			return true;

		return false;
	}

	/**
	 * Applies VIPS rules on &TR;&gt; node.
	 * @param node Node
	 * @return Returns true if one of rules success and node is dividable.
	 */
	var applyTrNodeVipsRules = function(node)
	{
		// 1 2 3 7 9 12

		if (ruleOne(node))
			return true;

		if (ruleTwo(node))
			return true;

		if (ruleThree(node))
			return true;

		if (ruleSeven(node))
			return true;

		if (ruleNine(node))
			return true;

		if (ruleTwelve(node))
			return true;

		return false;
	}

	/**
	 * Applies VIPS rules on &lt;TABLE&gt; node.
	 * @param node Node
	 * @return Returns true if one of rules success and node is dividable.
	 */
	var applyTableNodeVipsRules = function(node)
	{
		// 1 2 3 7 9 12

		if (ruleOne(node))
			return true;

		if (ruleTwo(node))
			return true;

		if (ruleThree(node))
			return true;

		if (ruleSeven(node))
			return true;

		if (ruleNine(node))
			return true;

		if (ruleTwelve(node))
			return true;

		return false;
	}

	/**
	 * Applies VIPS rules on inline nodes.
	 * @param node Node
	 * @return Returns true if one of rules success and node is dividable.
	 */
	var applyInlineTextNodeVipsRules = function(node)
	{
		// 1 2 3 4 5 6 8 9 11

		if (ruleOne(node))
			return true;

		if (ruleTwo(node))
			return true;

		if (ruleThree(node))
			return true;

		if (ruleFour(node))
			return true;

		if (ruleFive(node))
			return true;

		if (ruleSix(node))
			return true;

		if (ruleEight(node))
			return true;

		if (ruleNine(node))
			return true;

		if (ruleTwelve(node))
			return true;

		return false;
	}


	var _cnt = 0;
	var checkValidChildrenNodes = function(node) {
		var nchild = node.childNodes;
		if (isTextNode(node)) {
			if (node.textContent = " ") {
				_cnt++;
			}
		}

		else {
			if(node.offsetWidth > 0 && node.offsetHeight > 0) {
				_cnt++;
			}
		}

		for(var i = 0; i < nchild.length; i++) {
			checkValidChildrenNodes(nchild[i]);
		}
	}

	var hasValidChildrenNodes = function(node) {
		var nchild = node.childNodes;
		if(node.nodeName == "IMG" || node.nodeName == "INPUT") {
			if (node.offsetWidth > 0 && node.offsetHeight > 0) {
				_currentVipsBlock.setIsVisualBlock(true);
				_currentVipsBlock.setDoC(8);
				return true;
			}

			else {
				return false;
			}
		}

		if(nchild == []) {
			return false;
		}

		_cnt = 0;

		for(var i = 0; i < nchild.length; i++) {
			checkValidChildrenNodes(nchild[i]);
		}

		return (_cnt > 0) ? true : false;
	}

	var numberOfValidChildNodes = function(node) {
		_cnt = 0;
		var nchild = node.childNodes;

		if(nchild == []) {
			return _cnt;
		}

		for(var i = 0; i < nchild.length; i++) {
			checkValidChildrenNodes(nchild[i]);
		}

		return _cnt;
	}

	/**
	 * VIPS Rule One
	 * <p>
	 * If the DOM node is not a text node and it has no valid children, then
	 * this node cannot be divided and will be cut.
	 * 
	 * @param node
	 *            Input node
	 * 
	 * @return True, if rule is applied, otherwise false.
	 */
	var ruleOne = function(node)
	{
		if (!isTextNode(node))
		{
			if (!hasValidChildrenNodes(node))
			{
				_currentVipsBlock.setIsDividable(false);
				return true;
			}
		}

		return false;
	}

	/**
	 * VIPS Rule Two
	 * <p>
	 * If the DOM node has only one valid child and the child is not a text
	 * node, then divide this node
	 * 
	 * @param node
	 *            Input node
	 * 
	 * @return True, if rule is applied, otherwise false.
	 */
	var ruleTwo = function(node)
	{
		if (numberOfValidChildNodes(node) == 1)
		{
			if (!isTextNode(node.firstChild))
				return true;
			else
				return false;
		}

		return false;
	}

	/**
	 * VIPS Rule Three
	 * <p>
	 * If the DOM node is the root node of the sub-DOM tree (corresponding to
	 * the block), and there is only one sub DOM tree corresponding to this
	 * block, divide this node.
	 * 
	 * @param node
	 *            Input node
	 * 
	 * @return True, if rule is applied, otherwise false.
	 */
	var ruleThree = function(node)
	{
		//***return false for now since 1st round
		return false;

		// if (!isRootElement(node))
		// 	return false;

		// var result = true;
		// var cnt = 0;

		// for (var i = 0; i < _vipsblock.getChildren().length; i++)
		// {
		// 	if (vipsBlock.getBox().nodeName == node.nodeName)
		// 	{
		// 		result = true;
		// 		isOnlyOneDomSubTree(node, vipsBlock.getBox(), result);

		// 		if (result)
		// 			cnt++;
		// 	}
		// }

		// return (cnt == 1) ? true : false;
	}

	var isVirtualTextNode1 = function(node) {
		var nchild = node.childNodes;
		if(node.style.display != "inline") {
			return false;
		}

		for(var i = 0; i < nchild.length; i++) {
			if(!isTextNode(nchild[i]))
				return false;
		}

		return true;

	}

	var isVirtualTextNode2 = function(node) {
		var nchild = node.childNodes;
		if(node.style.display != "inline") {
			return false;
		}

		for(var i = 0; i < nchild.length; i++) {
			if(!isTextNode(nchild[i]) || !isVirtualTextNode1(nchild[i]))
				return false;
		}

		return true;

	}

	var isVirtualTextNode = function(node) {
		if (isVirtualTextNode1(node))
			return true;
		if (isVirtualTextNode2(node))
			return true;

		return false;
	}

	/**
	 * VIPS Rule Four
	 * <p>
	 * If all of the child nodes of the DOM node are text nodes or virtual text
	 * nodes, do not divide the node. <br>
	 * If the font size and font weight of all these child nodes are same, set
	 * the DoC of the extracted block to 10.
	 * Otherwise, set the DoC of this extracted block to 9.
	 * 
	 * @param node
	 *            Input node
	 * 
	 * @return True, if rule is applied, otherwise false.
	 */
	var ruleFour = function(node)
	{
		var i = 0;
		var child_list = node.childNodes;

		if (child_list == null)
			return false;

		for (i = 0; i < child_list.length; i++)
		{
			if (isTextNode(child_list[i]))
				continue;
			if (!isTextNode(child_list[i]) ||
					!isVirtualTextNode(child_list[i]))
				return false;
		}

		_currentVipsBlock.setIsVisualBlock(true);
		_currentVipsBlock.setIsDividable(false);

		if (child_list.length == 1)
		{
			if (child_list[0].nodeName == "EM")
				_currentVipsBlock.setDoC(11);
			else
				_currentVipsBlock.setDoC(10);
			return true;
		}

		var font_weight = child_list[0].fontWeight;
		var font_size = child_list[0].style.fontSize;

		for (i = 0; i < child_list.length; i++)
		{
			if (getComputedStyle(child_list[i]).fontWeight == null)
				return false;

			if (isTextNode(child_list[i]))
			{
				if (child_list[i].style.fontWeight != font_size || child_list[i].style.fontWeight != font_weight)
				{
					_currentVipsBlock.setDoC(9);
					break;
				}
				else
					_currentVipsBlock.setDoC(10);
			}

		}

		return true;
	}

	/**
	 * VIPS Rule Five
	 * <p>
	 * If one of the child nodes of the DOM node is line-break node, then
	 * divide this DOM node.
	 * 
	 * @param node
	 *            Input node
	 * 
	 * @return True, if rule is applied, otherwise false.
	 */
	var ruleFive = function(node)
	{
		var i = 0;
		var child_list = node.childNodes;

		if (child_list == [])
			return false;

		for (i = 0; i < child_list.length; i++) {
			if (child_list[i].style.display == "block")
				return true;
		}

		return false;
	}

	/**
	 * VIPS Rule Six
	 * <p>
	 * If one of the child nodes of the DOM node has HTML tag &lt;hr&gt;, then
	 * divide this DOM node
	 * 
	 * @param node
	 *            Input node
	 * 
	 * @return True, if rule is applied, otherwise false.
	 */
	var ruleSix = function(node)
	{
		var i = 0;
		var child_list = node.childNodes;

		if (child_list == [])
			return false;

		for (i = 0; i < child_list.length; i++)
		{
			if (child_list[i].nodeName == "HR")
				return true;
		}

		return false;
	}

	/**
	 * VIPS Rule Seven
	 * <p>
	 * If the background color of this node is different from one of its
	 * children’s, divide this node and at the same time, the child node with
	 * different background color will not be divided in this round.
	 * Set the DoC value (6-8) for the child node based on the &lt;html&gt;
	 * tag of the child node and the size of the child node.
	 * 
	 * @param node
	 *            Input node
	 * 
	 * @return True, if rule is applied, otherwise false.
	 */
	var ruleSeven = function(node)
	{
		var nchild = node.childNodes;

		if (nchild == [])
			return false;

		if (isTextNode(node))
			return false;

		//String nodeBgColor = node.getStylePropertyValue("background-color");
		var nodeBgColor = _currentVipsBlock.getBgColor();
		var block_child = _currentVipsBlock.getChildren()

		for (var i = 0; i < block_child.length; i++)
		{
			if (!(block_child[i].getBgColor() == nodeBgColor))
			{
				block_child[i].setIsDividable(false);
				block_child[i].setIsVisualBlock(true);
				block_child[i].setDoC(7);
				return true;
			}
		}

		return false;
	}


	var findTextChildrenNodes = function(node,results)
	{
		var nchild = node.childNodes;
		if (isTextNode(node))
		{
			results.concat(node);
			return;
		}

		for (var i = 0; i < nchild.length; i++)
		{
			findTextChildrenNodes(nchild[i], results);
		}
	}

	var getAllChildren = function(node,results) {
		var nchild = node.childNodes;
		results.concat(node);

		if(isTextNode(node))
			return;
		for (var i = 0; i < nchild.length; i++) {
			getAllChildren(nchild[i],results);
		}

	} 

	/**
	 * VIPS Rule Eight
	 * <p>
	 * If the node has at least one text node child or at least one virtual
	 * text node child, and the node's relative size is smaller than
	 * a threshold, then the node cannot be divided.
	 * Set the DoC value (from 5-8) based on the html tag of the node.
	 * @param node
	 *            Input node
	 * 
	 * @return True, if rule is applied, otherwise false.
	 */
	var ruleEight = function(node)
	{
		var nchild = node.childNodes;
		var children = [];

		if (nchild == [])
			return false;

		findTextChildrenNodes(node, children);

		var cnt = children.length;

		if (cnt == 0)
			return false;

		if (node.offsetWidth == 0 || node.offsetHeight == 0)
		{
			children.clear();

			getAllChildren(node, children);

			for (var i = 0; i < children.length; i++)
			{
				if (children[i].offsetWidth != 0 && children[i].offsetHeight != 0)
					return true;
			}
		}

		if (node.offsetWidth * node.offsetHeight > _sizeTresholdHeight * _sizeTresholdWidth)
			return false;

		if (node.nodeName == "UL")
		{
			return true;
		}

		_currentVipsBlock.setIsVisualBlock(true);
		_currentVipsBlock.setIsDividable(false);

		if (node.nodeName == "XDIV")
			_currentVipsBlock.setDoC(7);
		else if (node.nodeName == "CODE")
			_currentVipsBlock.setDoC(7);
		else if (node.nodeName == "DIV")
			_currentVipsBlock.setDoC(5);
		else
			_currentVipsBlock.setDoC(8);
		return true;
	}

	/**
	 * VIPS Rule Nine
	 * <p>
	 * If the child of the node with maximum size are small than
	 * a threshold (relative size), do not divide this node. <br>
	 * Set the DoC based on the html tag and size of this node.
	 * @param node
	 *            Input node
	 * 
	 * @return True, if rule is applied, otherwise false.
	 */
	var ruleNine = function(node)
	{
		var nchild = node.childNodes;
		if (nchild == [])
			return false;

		var maxSize = 0;
		var childSize = 0;

		for (var i = 0; i < nchild.length; i++)
		{
			childSize = nchild[i].offsetWidth * nchild[i].offsetHeight;

			if (maxSize < childSize)
			{
				maxSize = childSize;
			}
		}

		if (maxSize > _sizeTresholdWidth * _sizeTresholdHeight)
			return true;

		//TODO set DOC
		_currentVipsBlock.setIsVisualBlock(true);
		_currentVipsBlock.setIsDividable(false);

		if (node.nodeName == "XDIV")
			_currentVipsBlock.setDoC(7);
		if (node.nodeName == "A")
			_currentVipsBlock.setDoC(11);
		else
			_currentVipsBlock.setDoC(8);

		return true;
	}

	var findPreviousSiblingNodeVipsBlock = function(node,vipsBlock) {
		if(vipsBlock.getBox() == node) {
			_tempVipsBlock = vipsBlock;
			return
		}

		else {
			var bchild = vipsBlock.getChildren();
			for (var i = 0; i < bchild.length; i++) {
				findPreviousSiblingNodeVipsBlock(node, bchild[i]);
			}
		}
	}

	/**
	 * VIPS Rule Ten
	 * <p>
	 * If previous sibling node has not been divided, do not divide this node
	 * @param node
	 *            Input node
	 * 
	 * @return True, if rule is applied, otherwise false.
	 */
	var ruleTen = function(node)
	{
		_tempVipsBlock = null;
		findPreviousSiblingNodeVipsBlock(node.getNode().getPreviousSibling(), _vipsBlocks);

		if (_tempVipsBlock == null)
			return false;

		if (_tempVipsBlock.isAlreadyDivided())
			return true;

		return false;
	}

	/**
	 * VIPS Rule Eleven
	 * <p>
	 * Divide this node.
	 * @param node
	 *            Input node
	 * 
	 * @return True, if rule is applied, otherwise false.
	 */
	var ruleEleven = function(node)
	{
		//System.err.println("Applying rule Eleven on " + node.getNode().getNodeName() + " node");

		return (isTextNode(node)) ? false : true;
	}

	/**
	 * VIPS Rule Twelve
	 * <p>
	 * Do not divide this node <br>
	 * Set the DoC value based on the html tag and size of this node.
	 * @param node
	 *            Input node
	 * 
	 * @return True, if rule is applied, otherwise false.
	 */
	var ruleTwelve = function(node)
	{

		_currentVipsBlock.setIsDividable(false);
		_currentVipsBlock.setIsVisualBlock(true);

		if (node.nodeName == "XDIV")
			_currentVipsBlock.setDoC(7);
		else if (node.nodeName == "LI")
			_currentVipsBlock.setDoC(8);
		else if (node.nodeName == "SPAN")
			_currentVipsBlock.setDoC(8);
		else if (node.nodeName == "SUP")
			_currentVipsBlock.setDoC(8);
		else if (node.nodeName == "IMG")
			_currentVipsBlock.setDoC(8);
		else
			_currentVipsBlock.setDoC(333);
		return true;
	}
}